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

const processPath = (field, relativePath) => {
  if (field.schema.reverse) {
    const path = {
      "@id": relativePath,
      "reverse": true
    };
    if (field.typeFilterEnabled && field.typeFilter.length) {
      path.typeFilter = field.typeFilter.map(t => ({"@id": t}));
    }
    return path;
  }

  if (field.typeFilterEnabled && field.typeFilter.length) {
    return {
      "@id": relativePath,
      "typeFilter": field.typeFilter.map(t => ({"@id": t}))
    };
  }
  return relativePath;
};


const processMergeFields = (json, merge) => {
  const jsonMerge = [];
  merge && !!merge.length && merge.forEach(field => {
    let jsonMergeFields = [];
    let mergeField = field;
    while (mergeField) {
      if (mergeField.schema.attribute) {
        const attribute = (!attributeReg.test(mergeField.schema.attribute) && modelReg.test(mergeField.schema.attribute)) ? mergeField.schema.attribute.match(modelReg)[1] : mergeField.schema.attribute;
        const relativePath = mergeField.schema.attributeNamespace && mergeField.schema.simpleAttributeName ? `${mergeField.schema.attributeNamespace}:${mergeField.schema.simpleAttributeName}` : attribute;
        if (mergeField.schema.reverse) {
          jsonMergeFields.push({
            "@id": relativePath,
            "reverse": true
          });
        } else {
          jsonMergeFields.push(relativePath);
        }
        mergeField = mergeField.structure && mergeField.structure.length && mergeField.structure[0];
      }
    }
    if (jsonMergeFields.length > 1) {
      jsonMerge.push({
        "path": jsonMergeFields
      });
    } else if (jsonMergeFields.length === 1) {
      jsonMerge.push({
        "path": jsonMergeFields[0]
      });
    }
  });
  if (jsonMerge.length > 1) {
    json.merge = jsonMerge;
  } else if (jsonMerge.length === 1) {
    json.merge = jsonMerge[0];
  }
};

const processFields = (json, field) => {
  const jsonFields = [];
  field.structure && !!field.structure.length && field.structure.forEach(field => {
    let jsonField = {};
    jsonField.propertyName = (field.namespace ? field.namespace : "query") + ":" + ((field.alias && field.alias.trim()) || field.schema.simpleAttributeName || field.schema.label || uniqueId("field"));
    if (field.schema.attribute) {
      const attribute = (!attributeReg.test(field.schema.attribute) && modelReg.test(field.schema.attribute)) ? field.schema.attribute.match(modelReg)[1] : field.schema.attribute;
      const relativePath = field.schema.attributeNamespace && field.schema.simpleAttributeName ? `${field.schema.attributeNamespace}:${field.schema.simpleAttributeName}` : attribute;
      jsonField.path = processPath(field, relativePath);
    }
    field.options.forEach(({ name, value }) => jsonField[name] = toJS(value));
    if (field.merge.length) {
      processMergeFields(jsonField, field.merge);
    }
    if (field.isFlattened) {
      const topField = field;
      jsonField.path = [jsonField.path];
      while (field.isFlattened && field.structure[0]) {
        field = field.structure[0];
        const relativePath = field.schema.attributeNamespace && field.schema.simpleAttributeName ? `${field.schema.attributeNamespace}:${field.schema.simpleAttributeName}` : field.schema.attribute;
        jsonField.path.push(processPath(field, relativePath));
        if (field.structure && field.structure.length) {
          jsonField.propertyName = (topField.namespace ? topField.namespace : "query") + ":" + (topField.alias || field.schema.simpleAttributeName || field.schema.label);
        }
        field.options.filter(({name}) => !optionsToKeepOnFlattenendField.includes(name)).forEach(({ name, value }) => jsonField[name] = toJS(value));
      }
    }
    if (field.structure && field.structure.length) {
      processFields(jsonField, field);
    }
    jsonFields.push(jsonField);
  });
  if (jsonFields.length > 1) {
    json.structure = jsonFields;
  } else if (jsonFields.length === 1) {
    json.structure = jsonFields[0];
  }
};

const buildQueryStructureFromFieldTree = field => {
  const json = {};
  if (field.merge) {
    processMergeFields(json, field.merge);
  }
  processFields(json, field);
  if (!json.structure) {
    return undefined;
  }
  //Gets rid of the undefined values
  return JSON.parse(JSON.stringify(json.structure));
};

export default buildQueryStructureFromFieldTree;