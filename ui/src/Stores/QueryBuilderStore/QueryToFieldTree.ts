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
import { Query } from "../Query";
import { QuerySpecification } from "./QuerySpecification";

const getRelativePathFromObject = (path?: any) => {
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

const getRelativePathFromArray = (paths: any) => {
  if (!Array.isArray(paths) || paths.length === 0) {
    return null;
  }
  return getRelativePathFromObject(paths[0]);
};

const getRelativePath = (path: any) => {
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

const isReverseFromArray = (list: any) => {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  return isReverseFromObject(list[0]);
};

const getIsReverse = (object: any) => {
  if (Array.isArray(object)) {
    return isReverseFromArray(object);
  }
  return isReverseFromObject(object);
};

const getTypeFromObject = (object: any) => {
  if (object instanceof Object) {
    return object["@id"];
  }
  return undefined;
};

const getTypes = (object: any) => {
  if (Array.isArray(object)) {
    return object.map(t => getTypeFromObject(t)).filter(t => !!t);
  }
  const type = getTypeFromObject(object);
  if (type) {
    return [type];
  }
  return [];
};

const getTypeFiltertFromObject = (object: any) => {
  if (object instanceof Object) {
    return getTypes(object.typeFilter);
  }
  return [];
};

const getTypeFiltertFromArray = (list: any) => {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return getTypeFiltertFromObject(list[0]);
};

const getTypeFilter = (object: any) => {
  if (Array.isArray(object)) {
    return getTypeFiltertFromArray(object);
  }
  return getTypeFiltertFromObject(object);
};

const getPropertyFromLookups = (
  types: Map<string, Type>,
  lookups,
  attribute,
  isReverse: boolean,
  isLeaf: boolean
) => {
  if (!(types instanceof Object) || !Array.isArray(lookups) || !attribute) {
    return null;
  }
  let property = lookups.reduce((acc, id) => {
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
  }, {});
  if (Object.keys(property).length) {
    return toJS(property);
  }
  return null;
};

const getProperty = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  lookups,
  relativePath,
  isReverse: boolean,
  isLeaf: boolean
) => {
  let attribute = null;
  let attributeNamespace = null;
  let simpleAttributeName = null;
  if (attributeReg.test(relativePath)) {
    attribute = relativePath;
    [, simpleAttributeName] = relativePath.match(attributeReg);
  } else if (namespaceReg.test(relativePath)) {
    [, attributeNamespace, simpleAttributeName] =
      relativePath.match(namespaceReg);
    attribute =
      context && context[attributeNamespace]
        ? context[attributeNamespace] + simpleAttributeName
        : null;
  } else if (modelReg.test(relativePath)) {
    attribute = relativePath.match(modelReg)[1];
  } else if (relativePath === "@id" || relativePath === "@type") {
    attribute = relativePath;
  }
  let property = getPropertyFromLookups(
    types,
    lookups,
    attribute,
    isReverse,
    isLeaf
  );
  const isUnknown = !property;
  if (isUnknown) {
    property = {
      attribute: attribute,
      attributeNamespace: attributeNamespace,
      simpleAttributeName: simpleAttributeName,
      reverse: isReverse
    };
  }
  property.isUnknown = isUnknown;
  property.attributeNamespace = attributeNamespace;
  return property;
};

const getField = (types: Map<string, Type>, context: QuerySpecification.Context, parentField: Query.Field, path, isLeaf) => {
  if (path) {
    const isFlattened = getIsFlattened(path);
    const relativePath = getRelativePath(path);
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
    const field = new Field(schema, parentField);
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

const getIsFlattened = (object: any) => Array.isArray(object) && object.length > 1;

const addFieldToParent = (parentField: Query.Field, field: Query.Field) => {
  if (!Array.isArray(parentField.structure)) {
    parentField.structure = [];
  }
  parentField.structure.push(field);
  parentField.isInvalidLeaf = false;
};

const getFlattenRelativePath = (path:(QuerySpecification.Path|string)[]) => {
  return path.length > 2 ? path.slice(1) : path[1];
}
  

const setFieldProperties = (field: Query.Field, jsonField) => {
  const [, namespace, propertyName] = namespaceReg.test(jsonField.propertyName)
    ? jsonField.propertyName.match(namespaceReg)
    : [null, null, null];
  if (namespace) {
    field.namespace = namespace;
  }
  if (propertyName && propertyName !== field.schema.simpleAttributeName) {
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

const addPropertiesToField = (field: QuerySpecification.Field, properties) => {
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
  field: Query.Field,
  jsonField: QuerySpecification.Field
) => {
  const flattenRelativePath = getFlattenRelativePath(jsonField.path as (QuerySpecification.Path | string)[]);
  const childrenJsonFields: QuerySpecification.Field[] = [
    {
      path: flattenRelativePath,
      structure: jsonField.structure
    }
  ];
  addPropertiesToField(childrenJsonFields[0], jsonField);
  addJsonFieldsToField(types, context, field, childrenJsonFields);
  if (
    Array.isArray(flattenRelativePath) &&
    flattenRelativePath.length ||
    (field.structure && field.structure.length === 1)
  ) {
    field.isFlattened = true;
  }
};

const addChildrenOfField = (
  types: Map<string, Type>,
  context: QuerySpecification.Context,
  field: Query.Field,
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
  parentField: Query.Field,
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
  parentField: Query.Field,
  jsonFields?: QuerySpecification.Field|QuerySpecification.Field[]
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
