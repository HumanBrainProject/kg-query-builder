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
import { toJS } from "mobx";
import uniqueId from "lodash/uniqueId";

import { optionsToKeepOnFlattenendField, attributeReg, modelReg } from "./QuerySettings";

const hasTypeFilter = field => field instanceof Object && !!field.typeFilterEnabled && Array.isArray(field.typeFilter) && !!field.typeFilter.length;

const getTypeFilter = field => {
  if (hasTypeFilter(field)) {
    if (field.typeFilter.length === 1) {
      return {"@id": field.typeFilter[0]};
    }
    return field.typeFilter.map(t => ({"@id": t}));
  }
  return [];
};

const getAttribute = field => {
  if (!(field instanceof Object) || !(field.schema instanceof Object)) {
    return null;
  }
  if (!attributeReg.test(field.schema.attribute) && modelReg.test(field.schema.attribute)) {
    return field.schema.attribute.match(modelReg)[1];
  }
  return field.schema.attribute;
};

const getRelativePath = field => {
  if (!(field instanceof Object) || !(field.schema instanceof Object)) {
    return null;
  }
  if (field.schema.attributeNamespace && field.schema.simpleAttributeName) {
    return `${field.schema.attributeNamespace}:${field.schema.simpleAttributeName}`;
  }
  return getAttribute(field);
};

const getPath = field => {
  const relativePath = getRelativePath(field);
  if (!relativePath) {
    return null;
  }
  const hasType = hasTypeFilter(field);
  if (field.isReverse) {
    const path = {
      "@id": relativePath,
      "reverse": true
    };
    if (hasType) {
      path.typeFilter = getTypeFilter(field);
    }
    return path;
  }

  if (hasType) {
    return {
      "@id": relativePath,
      "typeFilter": getTypeFilter(field)
    };
  }
  return relativePath;
};

const getNamespace = field => field.namespace || "query";

const getPopertyName = field => {
  const namespace = getNamespace(field);
  const alias = field.alias && field.alias.trim();
  const name = alias || field.schema.simpleAttributeName || field.schema.label || uniqueId("field");
  return `${namespace}:${name}`;
};

const addOptions = (jsonField, options) => {
  if (Array.isArray(options)) {
    options.forEach(({ name, value }) => jsonField[name] = toJS(value));
  }
};

const addLastChildOptionsOfFlattenedField = (jsonField, options) => {
  if (Array.isArray(options)) {
    const filteredOptions = options.filter(({name}) => !optionsToKeepOnFlattenendField.includes(name))
    filteredOptions.forEach(({ name, value }) => jsonField[name] = toJS(value));
  }
};

const getFlattenedField = field => {
  const jsonField = {};
  jsonField.propertyName = getPopertyName(field);
  addOptions(jsonField, field.options);
  const paths = [];
  while (field && field.isFlattened) {
    const path = getPath(field);
    if (path) {
      paths.push(path);
    }
    field = path && field.structure && field.structure[0]
  }
  if (field) {
    const path = getPath(field);
    if (path) {
      paths.push(path);
    }
    addLastChildOptionsOfFlattenedField(jsonField, field.options);
  }
  if (!paths.length) {
    return null;
  }
  if (paths.length === 1) {
    jsonField.path = paths[0];
  } else {
    jsonField.path = paths;
  }
  const structure = getStructure(field.structure);
  if (structure) {
    jsonField.structure = structure;
  }
  return jsonField;
};

const getJsonField = field => {
  if (field.isFlattened) {
    return getFlattenedField(field);
  }
  const path = getPath(field);
  if (!path) {
    return null;
  }
  const jsonField = {
    propertyName: getPopertyName(field),
    path: path
  };
  addOptions(jsonField, field.options);
  const structure = getStructure(field.structure);
  if (structure) {
    jsonField.structure = structure;
  }
  return jsonField;
};

const getStructure = fields => {
  if (!Array.isArray(fields) || !fields.length) {
    return null;
  }

  const structure = fields
    .map(f => getJsonField(f))
    .filter(f => !!f);

  if (structure.length > 1) {
    return structure;
  } 
  if (structure.length === 1) {
    return structure[0];
  }
  return null;
};

export const buildQueryStructureFromFieldTree = field => {
  const structure = getStructure(field.structure);
  if (!structure) {
    return undefined;
  }
  //Gets rid of the undefined values
  return JSON.parse(JSON.stringify(structure));
};
