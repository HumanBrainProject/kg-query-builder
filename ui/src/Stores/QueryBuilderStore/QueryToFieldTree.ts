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

import {
  optionsToKeepOnFlattenendField,
  fieldReservedProperties,
  namespaceReg,
  attributeReg,
  modelReg
} from "./QuerySettings";
import Field from "../Field";
import { Type } from "../TypeStore";
import { QuerySpecification } from "./QuerySpecification";

const getRelativePathFromObject = (path?: any): string | null => {
  if (!path) {
    return null;
  }
  if (typeof path === "string") {
    return path;
  }
  if (path instanceof Object) {
    return path["@id"];
  }
  return null;
};

const getRelativePathFromArray = (paths: any): string | null => {
  if (!Array.isArray(paths) || paths.length === 0) {
    return null;
  }
  return getRelativePathFromObject(paths[0]);
};

const getRelativePath = (path: any): string | null => {
  if (Array.isArray(path)) {
    return getRelativePathFromArray(path);
  }
  return getRelativePathFromObject(path);
};

const isReverseFromObject = (object: any): boolean => {
  if (object instanceof Object) {
    return !!object.reverse;
  }
  return false;
};

const isReverseFromArray = (list: any): boolean => {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  return isReverseFromObject(list[0]);
};

const getIsReverse = (object: any): boolean => {
  if (Array.isArray(object)) {
    return isReverseFromArray(object);
  }
  return isReverseFromObject(object);
};

const getTypeFromObject = (object: any): string | undefined => {
  if (object instanceof Object) {
    return object["@id"];
  }
  return undefined;
};

const getTypes = (object: any): string[] => {
  if (Array.isArray(object)) {
    return object.map(t => getTypeFromObject(t)).filter(t => !!t) as string[];
  }
  const type = getTypeFromObject(object);
  if (type) {
    return [type];
  }
  return [];
};

const getTypeFilterFromObject = (object: any): string[] => {
  if (object instanceof Object) {
    return getTypes(object.typeFilter);
  }
  return [];
};

const getTypeFilterFromArray = (list: any): string[] => {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return getTypeFilterFromObject(list[0]);
};

const getTypeFilter = (object: any): string[] => {
  if (Array.isArray(object)) {
    return getTypeFilterFromArray(object);
  }
  return getTypeFilterFromObject(object);
};

const getPropertyFromLookups = (
  types: Map<string, Type>,
  lookups: string[],
  attribute: string | undefined,
  attributeNamespace: string | undefined,
  simpleAttributeName: string | undefined,
  isReverse: boolean,
  isLeaf: boolean
): QuerySpecification.CombinedSchema => {
  const propertyFallback: QuerySpecification.CombinedSchema = {
    isUnknown: true,
    attribute: attribute,
    attributeNamespace: attributeNamespace,
    simpleAttributeName: simpleAttributeName,
    reverse: isReverse
  };
  if (!(types instanceof Object) || !Array.isArray(lookups) || !attribute) {
    return propertyFallback;
  }
  const property = lookups.reduce((acc, id) => {
    const type = types.get(id);
    if (type) {
      const prop = type.properties.find(
        p =>
          p.attribute === attribute &&
          (isReverse ? !!p.reverse : !p.reverse) &&
          (isLeaf || p.canBe)
      );
      if (prop) {
        if (
          Array.isArray(acc.canBe) &&
          Array.isArray(prop.canBe) &&
          prop.canBe.length
        ) {
          const canBe = new Set(acc.canBe);
          prop.canBe.forEach(p => canBe.add(p));
          acc = {
            ...acc,
            ...prop,
            canBe: Array.from(canBe)
          };
        } else {
          acc = {
            ...acc,
            ...prop
          };
        }
      }
    }
    return acc;
  }, {} as QuerySpecification.CombinedSchema);
  if (Object.keys(property).length) {
    return {
      ...toJS(property),
      isUnknown: false,
      attributeNamespace: attributeNamespace
    };
  }
  return propertyFallback;
};

const getProperty = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  lookups: string[],
  relativePath: string | null,
  isReverse: boolean,
  isLeaf: boolean
): QuerySpecification.CombinedSchema => {
  let attribute;
  let attributeNamespace;
  let simpleAttributeName;
  if (relativePath) {
    const attributeMatch = relativePath.match(attributeReg);
    if (attributeMatch) {
      attribute = relativePath;
      [, simpleAttributeName] = attributeMatch;
    } else {
      const namespaceMatch = relativePath.match(namespaceReg);
      if (namespaceMatch) {
        [, attributeNamespace, simpleAttributeName] = namespaceMatch;
        attribute =
          attributeNamespace && context && context[attributeNamespace]
            ? context[attributeNamespace] + simpleAttributeName
            : undefined;
      } else {
        const modelMatch = relativePath.match(modelReg);
        if (modelMatch) {
          [, attribute] = modelMatch;
        } else if (relativePath === "@id" || relativePath === "@type") {
          attribute = relativePath;
        }
      }
    }
  }
  return getPropertyFromLookups(
    types,
    lookups,
    attribute,
    attributeNamespace,
    simpleAttributeName,
    isReverse,
    isLeaf
  );
};

const getField = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  parentField: Field,
  path: QuerySpecification.Path | string | (QuerySpecification.Path | string)[],
  isLeaf: boolean
) => {
  if (path) {
    const isFlattened = getIsFlattened(path);
    const relativePath: string | null = getRelativePath(path);
    const isReverse = getIsReverse(path);
    const typeFilter = getTypeFilter(path);
    const property = getProperty(
      types,
      context,
      parentField.lookups,
      relativePath,
      isReverse,
      isLeaf
    );
    const { isUnknown, ...schema } = property;
    const field = new Field(
      schema as QuerySpecification.CombinedSchema,
      parentField
    );
    field.isUnknown = isUnknown;
    field.isFlattened = isFlattened;
    field.isReverse = isReverse;
    if (typeFilter.length) {
      field.typeFilterEnabled = true;
      field.typeFilter = typeFilter;
    }
    if (Array.isArray(property.canBe)) {
      field.isInvalidLeaf = true;
    }
    return field;
  }

  const field = new Field(undefined, parentField);
  field.isInvalidLeaf = true;
  field.isInvalid = true;
  field.isUnknown = true;
  return field;
};

const getIsFlattened = (object: any) =>
  Array.isArray(object) && object.length > 1;

const addFieldToParent = (parentField: Field, field: Field) => {
  if (!Array.isArray(parentField.structure)) {
    parentField.structure = [];
  }
  parentField.structure.push(field);
  parentField.isInvalidLeaf = false;
};

const getFlattenRelativePath = (path: (QuerySpecification.Path | string)[]) => {
  return path.length > 2 ? path.slice(1) : path[1];
};

const setFieldProperties = (
  field: Field,
  jsonField: QuerySpecification.Field
) => {
  let namespace = null;
  let propertyName = null;
  if (jsonField.propertyName && namespaceReg.test(jsonField.propertyName)) {
    const m = jsonField.propertyName.match(namespaceReg);
    if (m) {
      namespace = m[1];
      propertyName = m[2];
    }
  }
  if (namespace) {
    field.namespace = namespace;
  }
  if (propertyName && propertyName !== field.schema?.simpleAttributeName) {
    field.alias = propertyName;
  }
  Object.entries(jsonField).forEach(([name, value]) => {
    if (
      !fieldReservedProperties.includes(name) &&
      (!field.isFlattened || optionsToKeepOnFlattenendField.includes(name))
    ) {
      field.setOption(name, value);
    }
  });
};

const addPropertiesToField = (
  field: QuerySpecification.Field,
  properties: QuerySpecification.Field
) => {
  Object.entries(properties).forEach(([name, value]) => {
    if (
      !fieldReservedProperties.includes(name) &&
      !optionsToKeepOnFlattenendField.includes(name)
    ) {
      field[name] = value;
    }
  });
};

const addChildrenOfFlattenedField = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  field: Field,
  jsonField: QuerySpecification.Field
) => {
  const flattenRelativePath = getFlattenRelativePath(
    jsonField.path as (QuerySpecification.Path | string)[]
  );
  const childrenJsonFields: QuerySpecification.Field[] = [
    {
      path: flattenRelativePath,
      structure: jsonField.structure
    }
  ];
  addPropertiesToField(childrenJsonFields[0], jsonField);
  addJsonFieldsToField(types, context, field, childrenJsonFields);
  if (
    (Array.isArray(flattenRelativePath) && flattenRelativePath.length) ||
    (field.structure && field.structure.length === 1)
  ) {
    field.isFlattened = true;
  }
};

const addChildrenOfField = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  field: Field,
  jsonField: QuerySpecification.Field
) => {
  if (field.isFlattened) {
    addChildrenOfFlattenedField(types, context, field, jsonField);
  } else if (jsonField.structure) {
    addJsonFieldsToField(types, context, field, jsonField.structure);
  }
};

const addJsonFieldToField = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  parentField: Field,
  jsonField: QuerySpecification.Field
) => {
  const hasPath = !!jsonField.path;
  const isLeaf = !jsonField.structure;
  const field = getField(types, context, parentField, jsonField.path, isLeaf);

  if (!hasPath) {
    field.isInvalid = true;
  }

  setFieldProperties(field, jsonField);
  addFieldToParent(parentField, field);
  addChildrenOfField(types, context, field, jsonField);
};

const addJsonFieldsToField = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  parentField: Field,
  jsonFields?: QuerySpecification.Field | QuerySpecification.Field[]
) => {
  if (!parentField || !jsonFields) {
    return;
  }
  if (!Array.isArray(jsonFields)) {
    jsonFields = [jsonFields];
  }
  jsonFields.forEach(jsonField =>
    addJsonFieldToField(types, context, parentField, jsonField)
  );
};

export const buildFieldTreeFromQuery = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  schema: QuerySpecification.Schema,
  query: QuerySpecification.Field
) => {
  if (!schema) {
    return null;
  }
  const { structure, properties } = query;
  const rootField = new Field({
    id: schema.id,
    label: schema.label,
    canBe: [schema.id]
  });
  addJsonFieldsToField(types, context, rootField, structure);
  properties &&
    Object.entries(properties).forEach(([name, value]) =>
      rootField.setOption(name, value)
    );
  return rootField;
};
