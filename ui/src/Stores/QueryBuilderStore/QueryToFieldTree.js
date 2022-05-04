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

import { optionsToKeepOnFlattenendField, fieldReservedProperties, namespaceReg, attributeReg, modelReg } from "./QuerySettings";
import Field from "../Field";

const getRelativePathFromObject = path => {
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

const getRelativePathFromArray = paths => {
  if (!Array.isArray(paths) || paths.length === 0) {
    return null;
  }
  return getRelativePathFromObject(paths[0]);
};

const getRelativePath = (path, isFlattened) => {
  if(isFlattened) {
    return getRelativePathFromArray(path);
  }
  return getRelativePathFromObject(path);
};

const isReversFromObject = object => {
  if (object instanceof Object) {
    return !!object.reverse;
  }
  return false;
};

const isReversFromArray = list => {
  if (!Array.isArray(list) || list.length === 0) {
    return false;
  }
  return isReversFromObject(list[0]);
};

const getIsReverse = (object, isFlattened) => {
  if(isFlattened) {
   return isReversFromArray(object)
  }
  return isReversFromObject(object);
};

const getTypeFromObject = object => {
  if (object instanceof Object) {
    return object["@id"];
  }
  return undefined;
};

const getTypes = object => {
  if(Array.isArray(object)) {
    return object
      .map(t => getTypeFromObject(t))
      .filter(t => !!t);
  }
  const type = getTypeFromObject(object);
  if (type) {
    return [type];
  }
  return [];
};

const getTypeFiltertFromObject = object => {
  if (object instanceof Object) {
    return getTypes(object.typeFilter);
  }
  return [];
};

const getTypeFiltertFromArray = list => {
  if (!Array.isArray(list) || list.length === 0) {
    return [];
  }
  return getTypeFiltertFromObject(list[0]);
};

const getTypeFilter = (object, isFlattened) => {
  if(isFlattened) {
    return getTypeFiltertFromArray(object);
  }
  return getTypeFiltertFromObject(object);
};

const getPropertyFromLookups = (types, lookups, attribute, isLeaf) => {
  if (!(types instanceof Object) || !Array.isArray(lookups) || !attribute) {
    return null;
  }
  let property = null;
  lookups.some(id => {
    const type = types[id];
    if (type) {
      property = type.properties.find(p => p.attribute === attribute && (isLeaf || p.canBe));
      return !!property;
    }
    return false;
  });
  if (property) {
    return toJS(property);
  }
  return null;
};

const getProperty = (types, context, lookups, relativePath, isMerge, isReverse, isLeaf) => {
  let attribute = null;
  let attributeNamespace = null;
  let simpleAttributeName = null;
  if (attributeReg.test(relativePath)) {
    attribute = relativePath;
    [, simpleAttributeName] = relativePath.match(attributeReg);

  } else if (namespaceReg.test(relativePath)) {
    [, attributeNamespace, simpleAttributeName] = relativePath.match(namespaceReg);
    attribute = context && context[attributeNamespace] ? context[attributeNamespace] + simpleAttributeName : null;
  } else if (modelReg.test(relativePath)) {
    attribute = relativePath.match(modelReg)[1];
  } else if (relativePath === "@id") {
    attribute = relativePath;
  } else if (!isMerge && relativePath === "@type") {
    attribute = relativePath;
  }
  let property = getPropertyFromLookups(types, lookups, attribute, isLeaf);
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

const getField = (types, context, parentField, path, isLeaf) => {
  if (path) {
    const isFlattened = getIsFlattened(path);
    const relativePath = getRelativePath(path, isFlattened);
    const isReverse = getIsReverse(path, isFlattened);
    const typeFilter = getTypeFilter(path, isFlattened);
    const lookups = getParentFieldLookups(parentField, false);
    const property = getProperty(types, context, lookups, relativePath, false, isReverse, isLeaf);
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

  const field = new Field({}, parentField);
  field.isInvalidLeaf = true;
  field.isInvalid = true;
  field.isUnknown = true;
  return field;
};

const getIsFlattened = object => Array.isArray(object) && object.length > 1;

const getParentFieldLookups = (parentField, isMerge) => {
  if (!isMerge) {
    return parentField.lookups;
  }
  const field = (parentField.isRootMerge && parentField.parent) ? parentField.parent : parentField;
  if (field.schema?.canBe?.length) {
    return field.schema.canBe;
  }
  return null;
};

const addFieldToParentProperty = (parentField, propertyName, field) => {
  if (!Array.isArray(parentField[propertyName])) {
    parentField[propertyName] = [];
  }
  parentField[propertyName].push(field);
};

const addFieldToParent = (parentField, field) => {
  if (parentField.isRootMerge) {
    addFieldToParentProperty(parentField, "merge", field);
  } else {
    addFieldToParentProperty(parentField, "structure", field);
  }
  parentField.isInvalidLeaf = false;
};

const getFlattenRelativePath = path => path.length > 2 ? path.slice(1) : path[1];

const setFieldProperties = (field, jsonField) => {
  const [, namespace, propertyName] = namespaceReg.test(jsonField.propertyName) ? jsonField.propertyName.match(namespaceReg) : [null, null, null];
  if (namespace) {
    field.namespace = namespace;
  }
  if (propertyName && propertyName !== field.schema.simpleAttributeName && propertyName !== field.schema.label) {
    field.alias = propertyName;
  }
  Object.entries(jsonField).forEach(([name, value]) => {
    if (!fieldReservedProperties.includes(name) && (!field.isFlattened || optionsToKeepOnFlattenendField.includes(name))) {
      field.setOption(name, value);
    }
  });
};

const addPropertiesToField = (field, properties) => {
  Object.entries(properties).forEach(([name, value]) => {
    if (!fieldReservedProperties.includes(name) && !optionsToKeepOnFlattenendField.includes(name)) {
      field[name] = value;
    }
  });
};

const addChildrenOfFlattenedField = (types, context, field, jsonField) => {
  const flattenRelativePath = getFlattenRelativePath(jsonField.path);
  const childrenJsonFields = [
    {
      path: flattenRelativePath,
      structure: jsonField.structure
    }
  ];
  addPropertiesToField(childrenJsonFields[0], jsonField);
  addJsonFieldsToField(types, context, field, childrenJsonFields);
  if (flattenRelativePath.length || (field.structure && field.structure.length === 1)) {
    field.isflattened = true;
  }
};

const addChildrenOfField = (types, context, field, jsonField) => {
  if (field.isFlattened) {
    addChildrenOfFlattenedField(types, context, field, jsonField);
  } else if (jsonField.structure) {
    addJsonFieldsToField(types, context, field, jsonField.structure);
  }
};

const addJsonFieldToField = (types, context, parentField, jsonField) => {
  const hasPath = !!jsonField.path;
  const isLeaf = !jsonField.structure;
  const isMerge = !!jsonField.merge;
  const field = getField(types, context, parentField, jsonField.path, isLeaf);

  if ((isMerge && hasPath) || (!isMerge && !hasPath)) {
    field.isInvalid = true;
  }

  if (isMerge) {
    field.isMerge = true
    addJsonFieldsToMergeField(types, context, field, jsonField.merge);
  }
  setFieldProperties(field, jsonField);
  addFieldToParent(parentField, field);
  addChildrenOfField(types, context, field, jsonField);
};

const addJsonFieldsToField = (types, context, parentField, jsonFields) => {
  if (!parentField || !jsonFields) {
    return;
  }
  if (!Array.isArray(jsonFields)) {
    jsonFields = [jsonFields];
  }
  jsonFields.forEach(jsonField => addJsonFieldToField(types, context, parentField, jsonField));
};

const addChildrenOfMergeField = (types, context, field, jsonField) => {
  if (field.isFlattened) {
    const flattenRelativePath = getFlattenRelativePath(jsonField.path);
    const childrenJsonFields = [
      {
        path: flattenRelativePath
      }
    ];
    addJsonFieldsToMergeField(types, context, field, childrenJsonFields);
    if (flattenRelativePath.length || (field.merge && field.merge.length === 1)) {
      field.isflattened = true;
    }
  }
};

const addJsonFieldToMergeField = (types, context, parentField, jsonField) => {
  const isLeaf = !jsonField.structure;
  const field = getField(types, context, parentField, jsonField.path, isLeaf)
  addFieldToParent(parentField, field);
  addChildrenOfMergeField(types, context, field, jsonField);
};

const addJsonFieldsToMergeField = (types, context, parentField, jsonFields) => {
  if (!parentField || !jsonFields) {
    return;
  }
  if (!Array.isArray(jsonFields)) {
    jsonFields = [jsonFields];
  }
  jsonFields.forEach(jsonField => addJsonFieldToMergeField(types, context, parentField, jsonField));
  if (parentField.isRootMerge && Array.isArray(parentField.merge) && parentField.merge.length < 2) {
    parentField.isInvalid = true;
  }
};

const buildFieldTreeFromQuery = (types, context, schema, query) => {
  if (!schema) {
    return null;
  }
  const { merge, structure, properties } = query;
  const rootField = new Field({
    id: schema.id,
    label: schema.label,
    canBe: [schema.id]
  });
  if (merge) {
    rootField.isMerge = true;
    rootField.isInvalid = true;
    const jsonFields = Array.isArray(merge)? merge : [merge];
    addJsonFieldsToMergeField(types, context, rootField, jsonFields);
  }
  addJsonFieldsToField(types, context, rootField, structure);
  properties && Object.entries(properties).forEach(([name, value]) => rootField.setOption(name, value));
  return rootField;
};

export default buildFieldTreeFromQuery;