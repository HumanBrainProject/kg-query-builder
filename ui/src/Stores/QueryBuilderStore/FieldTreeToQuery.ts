/*
 * Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This open source software code was developed in part or in whole in the
 * Human Brain Project, funded from the European Union's Horizon 2020
 * Framework Programme for Research and Innovation under
 * Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 * (Human Brain Project SGA1, SGA2 and SGA3).
 *
 */
import uniqueId from "lodash/uniqueId";
import camelCase from "lodash/camelCase";

import {
  optionsToKeepOnFlattenendField,
  attributeReg,
  modelReg
} from "./QuerySettings";
import { Query } from "../Query";
import { QuerySpecification } from "./QuerySpecification";
import Field from "../Field";

const hasTypeFilter = (field: Field): boolean =>
  field instanceof Object &&
  !!field.typeFilterEnabled &&
  Array.isArray(field.typeFilter) &&
  !!field.typeFilter.length;

const getTypeFilter = (field: Field): QuerySpecification.TypeFilter | QuerySpecification.TypeFilter[] => {
  if (hasTypeFilter(field)) {
    if (field.typeFilter.length === 1) {
      return { "@id": field.typeFilter[0] };
    }
    return field.typeFilter.map(t => ({ "@id": t }));
  }
  return [];
};

const getAttribute = (field: Field) => {
  if (!(field instanceof Object) || !field.schema) {
    return null;
  }
  if (
    field.schema.attribute &&
    !attributeReg.test(field.schema.attribute) &&
    modelReg.test(field.schema.attribute)
  ) {
    const match = field.schema.attribute.match(modelReg);
    if (match) {
      return match[1];
    }
  }
  return field.schema.attribute;
};

const getRelativePath = (field: Field) => {
  if (!(field instanceof Object) || !(field.schema instanceof Object)) {
    return null;
  }
  if (field.schema.attributeNamespace && field.schema.simpleAttributeName) {
    return `${field.schema.attributeNamespace}:${field.schema.simpleAttributeName}`;
  }
  return getAttribute(field);
};

const getPath = (field: Field) => {
  const relativePath = getRelativePath(field);
  if (!relativePath) {
    return null;
  }
  const hasType = hasTypeFilter(field);
  if (field.isReverse) {
    const path: QuerySpecification.Path = {
      "@id": relativePath,
      reverse: true
    };
    if (hasType) {
      path.typeFilter = getTypeFilter(field);
    }
    return path;
  }

  if (hasType) {
    return {
      "@id": relativePath,
      typeFilter: getTypeFilter(field)
    };
  }
  return relativePath;
};

const getNamespace = (field: Field) => field.namespace || "query";

const getPopertyName = (field: Field) => {
  const namespace = getNamespace(field);
  const alias = field.alias && field.alias.trim();
  const name =
    alias ||
    (field.schema &&
      (field.schema.simpleAttributeName || camelCase(field.schema.label))) ||
    uniqueId("field");
  return `${namespace}:${name}`;
};

const addOptions = (queryField: QuerySpecification.Field, options: Query.Option[]) => {
  if (Array.isArray(options)) {
    options.forEach(({ name, value }) => {
      switch (name) {
        case "sort": {
          if (value) {
            queryField.sort = true;
          }
          break;
        }
        case "ensureOrder": {
          if (value) {
            queryField.ensureOrder = true;
          }
          break;
        }
        case "filter": {
          if (value) {
            const v: QuerySpecification.FilterItem = {};
            const valueAsFilterItem = value as QuerySpecification.FilterItem;
            if(valueAsFilterItem.op) {
              v.op = valueAsFilterItem.op;
            }
            if(valueAsFilterItem.parameter) {
              v.parameter = valueAsFilterItem.parameter;
            }
            if(valueAsFilterItem.value) {
              v.value = valueAsFilterItem.value;
            }
            queryField.filter = v;
          }
          break;
        }
        case "singleValue": {
          if (value) {
            queryField.singleValue = true;
          }
          break;
        }
        default:
          if(name) {
            queryField[name] = value;
          }
      }
    });
  }
};


const addLastChildOptionsOfFlattenedField = (
  queryField: QuerySpecification.Field,
  options: Query.Option[]
) => {
  if (Array.isArray(options)) {
    const filteredOptions = options.filter(
      ({ name }) => name && !optionsToKeepOnFlattenendField.includes(name)
    );
    addOptions(queryField, filteredOptions);
  }
};

const getFlattenedField = (field: Field) => {
  const queryField = {} as QuerySpecification.Field;
  queryField.propertyName = getPopertyName(field);
  addOptions(queryField, field.options);
  const paths: (QuerySpecification.Path | string)[] = [];
  let targetField: "" | Field | null = field;
  while (targetField && targetField.isFlattened) {
    const path = getPath(targetField);
    if (path) {
      paths.push(path);
    }
    targetField = path && targetField.structure && targetField.structure[0];
  }
  if (targetField) {
    const path = getPath(targetField);
    if (path) {
      paths.push(path);
    }
    addLastChildOptionsOfFlattenedField(queryField, targetField.options);
  }
  if (!paths.length) {
    return null;
  }
  if (paths.length === 1) {
    queryField.path = paths[0];
  } else {
    queryField.path = paths;
  }
  if (targetField) {
    const structure = getStructure(targetField.structure);
    if (structure) {
      queryField.structure = structure;
    }
  }
  return queryField;
};

const getqueryField = (field: Field): null | QuerySpecification.Field => {
  if (field.isFlattened) {
    return getFlattenedField(field);
  }
  const path = getPath(field);
  if (!path) {
    return null;
  }
  const queryField: QuerySpecification.Field = {
    propertyName: getPopertyName(field),
    path: path
  };
  addOptions(queryField, field.options);
  const structure = getStructure(field.structure);
  if (structure) {
    queryField.structure = structure;
  }
  return queryField;
};

const getStructure = (
  fields: Field[] | undefined | Field
): null | QuerySpecification.Field | QuerySpecification.Field[] => {
  if (!Array.isArray(fields) || !fields.length) {
    return null;
  }

  const structure = (fields
    .map(f => getqueryField(f))
    .filter(f => !!f)) as QuerySpecification.Field[];

  if (structure.length > 1) {
    return structure;
  }
  if (structure.length === 1) {
    return structure[0];
  }
  return null;
};

export const buildQueryStructureFromFieldTree = (field: Field) => {
  const structure = getStructure(field.structure);
  if (!structure) {
    return undefined;
  }
  //Gets rid of the undefined values
  return JSON.parse(JSON.stringify(structure));
};
