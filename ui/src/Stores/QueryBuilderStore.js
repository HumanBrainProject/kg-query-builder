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

import { observable, action, computed, runInAction, toJS, makeObservable } from "mobx";
import uniqueId from "lodash/uniqueId";
import isEqual from "lodash/isEqual";
import remove from "lodash/remove";
import _  from "lodash-uuid";
import jsonld from "jsonld";
import Field from "./Field";

const jsdiff = require("diff");


const defaultContext = {
  "@vocab": "https://core.kg.ebrains.eu/vocab/query/",
  "query": "https://schema.hbp.eu/myQuery/",
  "propertyName": {
    "@id": "propertyName",
    "@type": "@id"
  },
  "merge": {
    "@type": "@id",
    "@id": "merge"
  },
  "path": {
    "@id": "path",
    "@type": "@id"
  }
};

const queryCompare = (a, b) => {
  if (a.label && b.label) {
    return a.label.localeCompare(b.label);
  }
  if (a.label) {
    return -1;
  }
  if (b.label) {
    return 1;
  }
  return a.id.localeCompare(b.id);
};

const rootFieldReservedProperties = ["root_schema", "schema:root_schema", "http://schema.org/root_schema", "identifier", "schema:identifier", "http://schema.org/identifier", "@id", "@type", "https://core.kg.ebrains.eu/vocab/meta/revision", "https://core.kg.ebrains.eu/vocab/meta/space", "https://core.kg.ebrains.eu/vocab/meta/user", "@context", "meta", "structure", "merge"];
const fieldReservedProperties = ["propertyName", "path", "merge", "structure"];
const optionsToKeepOnFlattenendField = ["ensureOrder", "required", "singleValue"];

const namespaceReg = /^(.+):(.+)$/;
const attributeReg = /^https?:\/\/.+\/(.+)$/;
const modelReg = /^\/?((.+)\/(.+)\/(.+)\/(.+))$/;

const isChildOfField = (node, parent, root) => {
  while (node && node !== parent && node !== root) {
    node = node.parent;
  }
  return node === parent;
};

const getProperties = query => {
  if (!query) {
    return {};
  }
  return Object.entries(query)
    .filter(([name,]) => !rootFieldReservedProperties.includes(name))
    .reduce((result, [name, value]) => {
      result[name] = value;
      return result;
    }, {});
};

const normalizeUser = user => ({
  id: user["@id"],
  name: user["http://schema.org/name"],
  picture: user["https://schema.hbp.eu/users/picture"]
});

export class QueryBuilderStore {
  meta = null;
  defaultResponseVocab = defaultContext.query;
  responseVocab = null;
  queryId = null;
  label = "";
  space = "";
  description = "";
  stage = "RELEASED";
  sourceQuery = null;
  context = null;
  rootField = null;
  fetchQueriesError = null;
  isFetchingQueries = false;
  isSaving = false;
  saveError = null;
  isRunning = false;
  runError = null;
  saveAsMode = false;
  compareChanges = false;
  queriesFilterValue = "";
  childrenFilterValue = "";
  fromQueryId = null;
  fromLabel = "";
  fromDescription = "";
  isFetchingQuery = false;
  fetchQueryError = null;
  mode = "build";
  specifications = [];
  includeAdvancedAttributes = false;

  resultSize = 20;
  resultStart = 0;
  result = null;
  tableViewRoot = ["data"];

  currentField = null;

  transportLayer = null;
  rootStore = null;

  constructor(transportLayer, rootStore) {
    makeObservable(this, {
      queryId: observable,
      label: observable,
      space: observable,
      description: observable,
      stage: observable,
      sourceQuery: observable,
      context: observable,
      meta: observable,
      defaultResponseVocab: observable,
      responseVocab: observable,
      rootField: observable,
      fetchQueriesError: observable,
      isFetchingQueries: observable,
      isSaving: observable,
      saveError: observable,
      isRunning: observable,
      runError: observable,
      saveAsMode: observable,
      compareChanges: observable,
      specifications: observable,
      resultSize: observable,
      resultStart: observable,
      result: observable.shallow,
      tableViewRoot: observable,
      currentField: observable,
      isFetchingQuery: observable,
      fetchQueryError: observable,
      currentFieldLookups: computed,
      currentFieldFilteredPropertiesGroups: computed,
      currentFieldFilteredCommonProperties: computed,
      currentFieldLookupsAttributes: computed,
      currentFieldLookupsLinks: computed,
      currentFieldLookupsCommonAttributes: computed,
      currentFieldLookupsCommonLinks: computed,
      selectRootSchema: action,
      resetRootSchema: action,
      clearRootSchema: action,
      setAsNewQuery: action,
      hasRootSchema: computed,
      rootSchema: computed,
      isQuerySaved: computed,
      isOneOfMySavedQueries: computed,
      isQueryEmpty: computed,
      hasQueryChanged: computed,
      hasChanged: computed,
      hasQueries: computed,
      hasMyQueries: computed,
      hasMyFilteredQueries: computed,
      hasOthersQueries: computed,
      hasOthersFilteredQueries: computed,
      myQueries: computed,
      myFilteredQueries: computed,
      othersQueries: computed,
      othersFilteredQueries: computed,
      queriesFilterValue: observable,
      setQueriesFilterValue: action,
      childrenFilterValue: observable,
      setChildrenFilterValue: action,
      addField: action,
      addMergeField: action,
      addMergeChildField: action,
      removeField: action,
      setResponseVocab: action,
      selectField: action,
      resetField: action,
      JSONQueryFields: computed,
      JSONQueryProperties: computed,
      JSONMetaProperties: computed,
      JSONQuery: computed,
      JSONSourceQuery: computed,
      JSONQueryDiff: computed,
      selectQuery: action,
      updateQuery: action,
      executeQuery: action,
      setResultSize: action,
      setResultStart: action,
      setStage: action,
      returnToTableViewRoot: action,
      appendTableViewRoot: action,
      cancelChanges: action,
      setRunError: action,
      setFetchQueriesError: action,
      setSaveAsMode: action,
      toggleCompareChanges: action,
      setLabel: action,
      setSpace: action,
      saveQuery: action,
      cancelSaveQuery: action,
      deleteQuery: action,
      cancelDeleteQuery: action,
      fetchQueries: action,
      setDescription: action,
      fetchQueryById: action,
      fromQueryId: observable,
      fromLabel: observable,
      fromDescription: observable,
      mode: observable,
      setMode: action,
      includeAdvancedAttributes: observable,
      toggleIncludeAdvancedAttributes: action
    });

    this.transportLayer = transportLayer;
    this.rootStore = rootStore;
  }

  toggleIncludeAdvancedAttributes() {
    this.includeAdvancedAttributes = !this.includeAdvancedAttributes;
  }

  get currentFieldLookups() {
    const field = this.currentField;
    if (!field) {
      return [];
    }
    if (field.isRootMerge && field !== this.rootField) {
      if (field.parent) {
        return field.parent.lookups;
      }
      return [];
    }

    if (!field.isFlattened ||
                (field.isMerge &&
                  (field.isRootMerge ||
                    (!field.isRootMerge && (!field.structure || !field.structure.length))))) {
      return field.lookups;
    }
    return [];
  }

  setChildrenFilterValue(value) {
    this.childrenFilterValue = value;
  }

  get currentFieldFilteredPropertiesGroups() {
    const field = this.currentField;
    const lookups = field.typeFilterEnabled?this.currentFieldLookups.filter(type => field.typeFilter.includes(type)):this.currentFieldLookups;

    if (!lookups.length) {
      return [];
    }

    const filter = this.childrenFilterValue && this.childrenFilterValue.toLowerCase();

    return lookups.reduce((acc, id) => {
      const type = this.rootStore.typeStore.types[id];
      if (type) {
        const properties = type.properties.filter(prop => (this.includeAdvancedAttributes  || !prop.attribute.startsWith("https://core.kg.ebrains.eu/vocab/meta")) &&
                                                          (!filter || !prop.label || prop.label.toLowerCase().includes(filter)));
        if (properties.length) {
          acc.push({
            id: type.id,
            label: type.label,
            color: type.color,
            properties: properties
          });
        }
      }
      return acc;
    }, []);
  }

  get currentFieldFilteredCommonProperties() {
    const groups = this.currentFieldFilteredPropertiesGroups;
    if (!groups.length) {
      return [];
    }
    const counters = {};
    groups.forEach(group => {
      group.properties.forEach(prop => {
        const key = `${prop.attribute}${prop.reverse?":is-reverse":""}`;
        if (!counters[key]) {
          counters[key] = {
            property: prop,
            count: 0
          };
        }
        counters[key].count += 1;
      });
    });
    return Object.values(counters).filter(({count}) => count === groups.length).map(({property}) => property).sort((a, b) => a.label.localeCompare(b.label));
  }

  isACurrentFieldFilteredCommonProperty(property) {
    return this.currentFieldFilteredCommonProperties.some(prop => prop.attribute === property.attribute && prop.reverse === property.reverse);
  }

  get currentFieldLookupsAttributes() {
    const groups = this.currentFieldFilteredPropertiesGroups;

    if (!groups.length) {
      return [];
    }

    return groups.reduce((acc, group) => {
      const properties = group.properties.filter(prop => (!prop.canBe || !prop.canBe.length) &&
                                                         !this.isACurrentFieldFilteredCommonProperty(prop));
      if (properties.length) {
        acc.push({...group, properties: properties});
      }
      return acc;
    }, []);
  }

  get currentFieldLookupsLinks() {
    const groups = this.currentFieldFilteredPropertiesGroups;

    if (!groups.length) {
      return [];
    }

    return groups.reduce((acc, group) => {
      const properties = group.properties.filter(prop => prop.canBe && !!prop.canBe.length &&
                                                          !this.isACurrentFieldFilteredCommonProperty(prop));
      if (properties.length) {
        acc.push({...group, properties: properties});
      }
      return acc;
    }, []);
  }

  get currentFieldLookupsCommonAttributes() {
    return this.currentFieldFilteredCommonProperties.filter(prop => !prop.canBe || !prop.canBe.length);
  }

  get currentFieldLookupsCommonLinks() {
    return this.currentFieldFilteredCommonProperties.filter(prop => prop.canBe && !!prop.canBe.length);
  }

  selectRootSchema(schema) {
    if (!this.isSaving) {
      this.queryId = null;
      this.label = "";
      this.description = "";
      this.context = toJS(defaultContext);
      this.meta = null;
      this.defaultResponseVocab = this.context.query;
      this.responseVocab = null;
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.rootField = new Field({
        id: schema.id,
        label: schema.label,
        canBe: [schema.id]
      });
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.queriesFilterValue = "";
      this.childrenFilterValue = "";
      this.result = null;
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.space = this.rootStore.authStore.spaces[0];
      this.selectField(this.rootField);
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
    }
  }

  resetRootSchema() {
    if (!this.isSaving) {
      const rootField = this.rootField;
      this.clearRootSchema();
      if (rootField) {
        this.rootField = new Field(rootField.schema);
        this.selectField(this.rootField);
      }
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
    }
  }

  clearRootSchema() {
    if (!this.isSaving) {
      this.queryId = null;
      this.label = "";
      this.description = "";
      this.context = toJS(defaultContext);
      this.meta = null;
      this.defaultResponseVocab = this.context.query;
      this.responseVocab = null;
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.queriesFilterValue = "";
      this.childrenFilterValue = "";
      this.result = null;
      this.rootField = null;
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.resetField();
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
    }
  }

  setAsNewQuery(queryId) {
    if (!this.isSaving) {
      this.queryId = queryId;
      this.label = "";
      this.description = "";
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.queriesFilterValue = "";
      this.childrenFilterValue = "";
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
    }
  }

  get hasRootSchema() {
    return !!this.rootField && !!this.rootField.schema;
  }

  get rootSchema() {
    return this.rootField && this.rootField.schema;
  }

  get isQuerySaved() {
    return this.sourceQuery !== null;
  }

  get isOneOfMySavedQueries() {
    return this.sourceQuery !== null && this.sourceQuery.user.id === this.rootStore.authStore.user.id;
  }

  get isQueryEmpty() {
    return !this.rootField || !this.rootField.structure || !this.rootField.structure.length;
  }

  get hasQueryChanged() {
    return !isEqual(this.JSONQuery, this.JSONSourceQuery);
  }

  get hasChanged() {
    return (!this.isQueryEmpty && (this.sourceQuery === null
      || (this.saveAsMode && this.queryId !== this.sourceQuery.id)
      || this.hasQueryChanged))
      || (this.isQueryEmpty && this.sourceQuery);
  }

  get hasQueries() {
    return this.specifications.length > 0;
  }

  get hasMyQueries() {
    return this.myQueries.length > 0;
  }

  get hasMyFilteredQueries() {
    return this.myFilteredQueries.length > 0;
  }

  get hasOthersQueries() {
    return this.othersQueries.length > 0;
  }

  get hasOthersFilteredQueries() {
    return this.othersFilteredQueries.length > 0;
  }

  get myQueries() {
    if (this.rootStore.authStore.user) {
      return this.specifications.filter(spec => spec.user && (spec.user.id === this.rootStore.authStore.user.id)).sort((a, b) => queryCompare(a, b));
    }
    return [];
  }

  get myFilteredQueries() {
    const filter = this.queriesFilterValue.toLowerCase();
    return this.myQueries.filter(query => (query.label && query.label.toLowerCase().includes(filter)) || (query.description && query.description.toLowerCase().includes(filter)) || (query.id && query.id.toLowerCase().includes(filter)));
  }

  get othersQueries() {
    if (this.rootStore.authStore.user) {
      return this.specifications.filter(spec =>  !spec.user || (spec.user.id !== this.rootStore.authStore.user.id)).sort((a, b) =>queryCompare(a, b));
    }
    return this.specifications.sort((a, b) => queryCompare(a, b));
  }

  get othersFilteredQueries() {
    const filter = this.queriesFilterValue.toLowerCase();
    return this.othersQueries.filter(query => (query.label && query.label.toLowerCase().includes(filter)) || (query.description && query.description.toLowerCase().includes(filter)) || (query.id && query.id.toLowerCase().includes(filter)));
  }

  setQueriesFilterValue(value) {
    this.queriesFilterValue = value;
  }

  addField(schema, parent, gotoField = true) {
    if (!this.context["@vocab"]) {
      this.context["@vocab"] = toJS(defaultContext["@vocab"]);
    }
    if (!this.context.query) {
      this.context.query = this.responseVocab;
    }
    if (!this.context.propertyName) {
      this.context.propertyName = toJS(defaultContext.propertyName);
    }
    if (!this.context.path) {
      this.context.path = toJS(defaultContext.path);
    }
    if (parent === undefined) {
      parent = this.showModalFieldChoice || this.rootField;
      this.showModalFieldChoice = null;
    }
    if (!parent.isFlattened || parent.structure.length < 1) {
      const newField = new Field(schema, parent);
      if (parent.isMerge && !parent.isRootMerge) {
        newField.isMerge = true;
        newField.isFlattened = !!newField.lookups.length;
      }
      if (schema.reverse) {
        newField.isReverse = true;
      }
      if (!parent.structure || parent.structure.length === undefined) {
        parent.structure = [];
      }
      parent.structure.push(newField);
      const rootMerge = newField.rootMerge;
      if (rootMerge) {
        this.checkMergeFields(rootMerge);
      }
      if (gotoField) {
        this.selectField(newField);
      }
    }
  }

  addMergeField(parent, gotoField = true) {
    if (parent === undefined) {
      parent = this.showModalFieldChoice || this.rootField;
      this.showModalFieldChoice = null;
    }
    if (!parent.isRootMerge && parent !== this.rootFields) {
      if (!this.context["@vocab"]) {
        this.context["@vocab"] = toJS(defaultContext["@vocab"]);
      }
      if (!this.context.query) {
        this.context.query = this.responseVocab;
      }
      if (!this.context.propertyName) {
        this.context.propertyName = toJS(defaultContext.propertyName);
      }
      if (!this.context.path) {
        this.context.path = toJS(defaultContext.path);
      }
      if (!this.context.merge) {
        this.context.merge = toJS(defaultContext.merge);
      }
      const newField = new Field({}, parent);
      newField.isMerge = true;
      newField.isInvalid = true;
      newField.alias = uniqueId("field");
      if (!parent.structure || parent.structure.length === undefined) {
        parent.structure = [];
      }
      parent.structure.push(newField);
      if (gotoField) {
        this.selectField(newField);
      }
    }
  }

  checkMergeFields(parent) {
    if (parent.isRootMerge) {
      parent.structure.forEach(field => {
        let isUnknown = true;
        parent.lookups.some(id => {
          const type = this.rootStore.typeStore.types[id];
          if (type) {
            if (type.properties.find(property => property.attribute === field.schema.attribute && ((!field.schema.canBe && !property.canBe) || (isEqual(toJS(field.schema.canBe), toJS(property.canBe)))))) {
              isUnknown = false;
              return true;
            }
          }
          return false;
        });
        field.isUnknown = isUnknown;
      });
    }
  }

  addMergeChildField(schema, parent, gotoField = true) {
    if (parent === undefined) {
      parent = this.showModalFieldChoice || this.rootField;
      this.showModalFieldChoice = null;
    }
    if (parent.isRootMerge) {
      if (!this.context["@vocab"]) {
        this.context["@vocab"] = toJS(defaultContext["@vocab"]);
      }
      if (!this.context.query) {
        this.context.query = this.responseVocab;
      }
      if (!this.context.propertyName) {
        this.context.propertyName = toJS(defaultContext.propertyName);
      }
      if (!this.context.path) {
        this.context.path = toJS(defaultContext.path);
      }
      if (!this.context.merge) {
        this.context.merge = toJS(defaultContext.merge);
      }
      const newField = new Field(schema, parent);
      newField.isMerge = true;
      newField.isFlattened = !!newField.lookups.length;
      if (!parent.merge || parent.merge.length === undefined) {
        parent.merge = [];
      }
      parent.merge.push(newField);
      parent.isInvalid = (parent.merge.length < 2);
      this.checkMergeFields(parent);
      if (gotoField) {
        this.selectField(newField);
      }
    }
  }

  moveUpField(field) {
    const fieldIndex = field.parent?field.parent.structure.findIndex(f => f === field):-1;
    if (fieldIndex >= 1) {
      field.parent.structure.splice(fieldIndex, 1);
      field.parent.structure.splice(fieldIndex-1, 0, field);
    }
  }

  moveDownField(field) {
    const fieldIndex = field.parent?field.parent.structure.findIndex(f => f === field):-1;
    if (fieldIndex === -1?false:fieldIndex < (field.parent.structure.length -1)) {
      
      field.parent.structure.splice(fieldIndex, 1);
      field.parent.structure.splice(fieldIndex+1, 0, field);
    }
  }

  removeField(field) {
    if (field === this.rootField) {
      this.rootField = null;
      this.queryId = null;
      this.label = "";
      this.description = "";
      this.sourceQuery = null;
      this.context = null;
      this.specifications = [];
      this.saveError = null;
      this.runError = null;
      this.saveAsMode = false;
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.resetField();
    } else {
      const currentField = this.currentField;
      const parentField = field.parent;
      if (isChildOfField(this.currentField, field, this.rootField)) {
        this.resetField();
      }
      if (field.isMerge && field.parentIsRootMerge) {
        remove(field.parent.merge, childField => field === childField);
        field.parent.isInvalid = (field.parent.merge.length < 2);
        if (!field.parent.merge.length) {
          field.parent.isFlattened = false;
        }
        this.checkMergeFields(field.parent);
      } else {
        remove(field.parent.structure, childField => field === childField);
        if (!field.parent.structure.length) {
          field.parent.isFlattened = false;
        }
        const rootMerge = field.rootMerge;
        if (rootMerge) {
          this.checkMergeFields(rootMerge);
        }
      }
      if (field === currentField) {
        this.selectField(parentField);
      }
    }
  }

  setResponseVocab(vocab) {
    this.responseVocab = vocab;
    if (vocab) {
      this.context.query = vocab;
    } else {
      this.context.query = this.defaultResponseVocab;
    }
  }

  selectField(field) {
    this.currentField = field;
    this.childrenFilterValue = "";
    this.rootStore.typeStore.addTypesToTetch(this.currentField.lookups);
  }

  resetField() {
    this.currentField = null;
    this.childrenFilterValue = "";
  }

  get JSONQueryFields() {
    const json = {};
    if (this.rootField.merge) {
      this._processMergeFields(json, this.rootField.merge);
    }
    this._processFields(json, this.rootField);
    if (!json.structure) {
      return undefined;
    }
    //Gets rid of the undefined values
    return JSON.parse(JSON.stringify(json.structure));
  }

  get JSONQueryProperties() {
    const json = {};
    this.rootField.options.forEach(({ name, value }) => {
      const cleanValue = toJS(value);
      if (cleanValue !== undefined) {
        json[name] = cleanValue;
      }
    });
    return json;
  }

  get JSONMetaProperties() {
    let meta = {
      ...this.meta,
      type: this.rootField.schema.id
    };
    const name = this.label ? this.label.trim() : "";
    const description = this.description ? this.description.trim() : "";
    if (name) {
      meta.name = name;
    }
    if (description) {
      meta.description = description;
    }
    if (this.responseVocab) {
      meta.responseVocab = this.responseVocab;
    }
    return meta;
  }

  get JSONQuery() {
    let query = {
      "@context": toJS(this.context),
      "meta": this.JSONMetaProperties
    };
    if (this.JSONQueryProperties && this.JSONQueryFields) {
      query["structure"] = this.JSONQueryFields;
    }
    return query;
  }

  get JSONSourceQuery() {
    if (!this.sourceQuery) {
      return null;
    }
    const json = toJS(this.sourceQuery.properties);
    json["@context"] = toJS(this.sourceQuery.context);
    if (this.sourceQuery.structure) {
      json.structure = toJS(this.sourceQuery.structure);
    }
    if (this.sourceQuery.meta) {
      json["meta"] = toJS(this.sourceQuery.meta);
    }
    return json;
  }

  get JSONQueryDiff() {
    return jsdiff.diffJson(this.JSONSourceQuery, this.JSONQuery);
  }

  _processMergeFields(json, merge) {
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
  }

  _processFields(json, field) {
    const jsonFields = [];
    field.structure && !!field.structure.length && field.structure.forEach(field => {
      let jsonField = {};
      jsonField.propertyName = (field.namespace ? field.namespace : "query") + ":" + ((field.alias && field.alias.trim()) || field.schema.simpleAttributeName || field.schema.label || uniqueId("field"));
      if (field.schema.attribute) {
        const attribute = (!attributeReg.test(field.schema.attribute) && modelReg.test(field.schema.attribute)) ? field.schema.attribute.match(modelReg)[1] : field.schema.attribute;
        const relativePath = field.schema.attributeNamespace && field.schema.simpleAttributeName ? `${field.schema.attributeNamespace}:${field.schema.simpleAttributeName}` : attribute;
        jsonField.path = this._processPath(field, relativePath);
      }
      field.options.forEach(({ name, value }) => jsonField[name] = toJS(value));
      if (field.merge.length) {
        this._processMergeFields(jsonField, field.merge);
      }
      if (field.isFlattened) {
        const topField = field;
        jsonField.path = [jsonField.path];
        while (field.isFlattened && field.structure[0]) {
          field = field.structure[0];
          const relativePath = field.schema.attributeNamespace && field.schema.simpleAttributeName ? `${field.schema.attributeNamespace}:${field.schema.simpleAttributeName}` : field.schema.attribute;
          jsonField.path.push(this._processPath(field, relativePath));
          if (field.structure && field.structure.length) {
            jsonField.propertyName = (topField.namespace ? topField.namespace : "query") + ":" + (topField.alias || field.schema.simpleAttributeName || field.schema.label);
          }
          field.options.filter(({name}) => !optionsToKeepOnFlattenendField.includes(name)).forEach(({ name, value }) => jsonField[name] = toJS(value));
        }
      }
      if (field.structure && field.structure.length) {
        this._processFields(jsonField, field);
      }
      jsonFields.push(jsonField);
    });
    if (jsonFields.length > 1) {
      json.structure = jsonFields;
    } else if (jsonFields.length === 1) {
      json.structure = jsonFields[0];
    }
  }

  _processPath(field, relativePath) {
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
  }

  _processJsonSpecificationFields(parentField, jsonFields) {
    if (!jsonFields) {
      return;
    }
    if (!jsonFields.length) {
      jsonFields = [jsonFields];
    }
    if (parentField && jsonFields && jsonFields.length) {
      jsonFields.forEach(jsonField => {
        let field = null;
        if (jsonField.path) {
          const jsonRP = jsonField.path;
          let isUnknown = false;
          const isFlattened = !!jsonRP && typeof jsonRP !== "string" && jsonRP.length !== undefined && jsonRP.length > 1;
          const relativePath = jsonRP && (typeof jsonRP === "string" ? jsonRP : (isFlattened ? (jsonRP[0] && (typeof jsonRP[0] === "string" ? jsonRP[0] : jsonRP[0]["@id"])) : (typeof jsonRP === "string" ? jsonRP : jsonRP["@id"])));
          const reverse = jsonRP && (typeof jsonRP === "string" ? false : (isFlattened ? (jsonRP[0] && (typeof jsonRP[0] === "string" ? false : jsonRP[0].reverse)) : (typeof jsonRP === "string" ? false : jsonRP.reverse)));
          const typeFilter = jsonRP && (typeof jsonRP === "string" ? undefined : (isFlattened ? (jsonRP[0] && (typeof jsonRP[0] === "string" ? undefined : jsonRP[0].typeFilter)) : (typeof jsonRP === "string" ? undefined : jsonRP.typeFilter)));
          let attribute = null;
          let attributeNamespace = null;
          let simpleAttributeName = null;
          if (attributeReg.test(relativePath)) {
            attribute = relativePath;
            [, simpleAttributeName] = relativePath.match(attributeReg);

          } else if (namespaceReg.test(relativePath)) {
            [, attributeNamespace, simpleAttributeName] = relativePath.match(namespaceReg);
            attribute = this.context && this.context[attributeNamespace] ? this.context[attributeNamespace] + simpleAttributeName : null;
          } else if (modelReg.test(relativePath)) {
            attribute = relativePath.match(modelReg)[1];
          } else if (relativePath === "@id") {
            attribute = relativePath;
          }
          let property = null;
          if (attribute) {
            parentField.lookups.some(id => {
              const type = this.rootStore.typeStore.types[id];
              if (type) {
                property = type.properties.find(property => property.attribute === attribute && (!jsonField.structure || (jsonField.structure && property.canBe)));
                if (property) {
                  property = toJS(property);
                }
                return !!property;
              }
              return false;
            });
          }
          if (!property) {
            isUnknown = true;
            property = {
              attribute: attribute,
              attributeNamespace: attributeNamespace,
              simpleAttributeName: simpleAttributeName,
              reverse: reverse
            };
          } else if (attributeNamespace) {
            property.attributeNamespace = attributeNamespace;
          }
          field = new Field(property, parentField);
          field.isUnknown = isUnknown;
          field.isFlattened = isFlattened;
          field.isReverse = reverse;
          const validTypeFilter = Array.isArray(typeFilter)?typeFilter.map(t => (t !== null && typeof t === "object")?t["@id"]:undefined):((typeFilter !== null && typeof typeFilter === "object" && typeFilter["@id"])?[typeFilter["@id"]]:[]);
          if (validTypeFilter.length) {
            field.typeFilterEnabled = true;
            field.typeFilter = validTypeFilter;
          }
        }

        if (jsonField.merge) {
          if (!field) {
            field = new Field({}, parentField);
          }
          field.isMerge = true;
          this._processJsonSpecificationMergeFields(field, jsonField.merge instanceof Array ? jsonField.merge : [jsonField.merge]);
        }
        if (!field) {
          field = new Field({}, parentField);
          field.isInvalid = true;
          field.isUnknown = true;
        }
        if ((jsonField.merge && jsonField.path) || (!jsonField.merge && !jsonField.path)) {
          field.isInvalid = true;
        }
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
        if (!parentField.structure || parentField.structure.length === undefined) {
          parentField.structure = [];
        }
        parentField.structure.push(field);
        if (field.isFlattened) {
          const flattenRelativePath = jsonField.path.length > 2 ? jsonField.path.slice(1) : jsonField.path[1];
          const childrenJsonFields = [
            {
              path: flattenRelativePath,
              structure: jsonField.structure
            }
          ];
          Object.entries(jsonField).forEach(([name, value]) => {
            if (!fieldReservedProperties.includes(name) && !optionsToKeepOnFlattenendField.includes(name)) {
              childrenJsonFields[0][name] = value;
            }
          });
          this._processJsonSpecificationFields(field, childrenJsonFields);
          if (flattenRelativePath.length || (field.structure && field.structure.length === 1)) {
            field.isflattened = true;
          }
        } else if (jsonField.structure) {
          this._processJsonSpecificationFields(field, jsonField.structure instanceof Array ? jsonField.structure : [jsonField.structure]);
        }
      });
    }
  }

  _processJsonSpecificationMergeFields(parentField, jsonFields) {
    if (!jsonFields) {
      return;
    }
    if (!jsonFields.length) {
      jsonFields = [jsonFields];
    }
    if (parentField && jsonFields && jsonFields.length) {
      jsonFields.forEach(jsonField => {
        let field = null;
        if (jsonField.path) {
          const jsonRP = jsonField.path;
          let isUnknown = false;
          const isFlattened = !!jsonRP && typeof jsonRP !== "string" && jsonRP.length !== undefined && jsonRP.length > 1;
          const relativePath = jsonRP && (typeof jsonRP === "string" ? jsonRP : (isFlattened ? (jsonRP[0] && (typeof jsonRP[0] === "string" ? jsonRP[0] : jsonRP[0]["@id"])) : (typeof jsonRP === "string" ? jsonRP : jsonRP["@id"])));
          const reverse = jsonRP && (typeof jsonRP === "string" ? false : (isFlattened ? (jsonRP[0] && (typeof jsonRP[0] === "string" ? false : jsonRP[0].reverse)) : (typeof jsonRP === "string" ? false : jsonRP.reverse)));
          let attribute = null;
          let attributeNamespace = null;
          let simpleAttributeName = null;
          if (attributeReg.test(relativePath)) {
            attribute = relativePath;
            [, simpleAttributeName] = relativePath.match(attributeReg);

          } else if (namespaceReg.test(relativePath)) {
            [, attributeNamespace, simpleAttributeName] = relativePath.match(namespaceReg);
            attribute = this.context && this.context[attributeNamespace] ? this.context[attributeNamespace] + simpleAttributeName : null;
          } else if (modelReg.test(relativePath)) {
            attribute = relativePath.match(modelReg)[1];
          } else if (relativePath === "@id") {
            attribute = relativePath;
          }
          let property = null;
          const parentFieldLookup = (parentField.isRootMerge && parentField.parent) ? parentField.parent : parentField;
          if (attribute && parentFieldLookup.schema && parentFieldLookup.schema.canBe && parentFieldLookup.schema.canBe.length) {
            parentFieldLookup.schema.canBe.some(id => {
              const type = this.rootStore.typeStore.types[id];
              if (type) {
                property = type.properties.find(property => property.attribute === attribute && (!jsonField.structure || (jsonField.structure && property.canBe)));
                if (property) {
                  property = toJS(property);
                }
                return !!property;
              }
              return false;
            });
          }
          if (!property) {
            isUnknown = true;
            property = {
              attribute: attribute,
              attributeNamespace: attributeNamespace,
              simpleAttributeName: simpleAttributeName,
              reverse: reverse
            };
          } else if (attributeNamespace) {
            property.attributeNamespace = attributeNamespace;
          }
          field = new Field(property, parentField);
          field.isMerge = true;
          field.isUnknown = isUnknown;
          field.isFlattened = isFlattened;
        }

        if (!field) {
          field = new Field({}, parentField);
          field.isInvalid = true;
          field.isUnknown = true;
        }
        if (parentField.isRootMerge) {
          if (!parentField.merge || parentField.merge.length === undefined) {
            parentField.merge = [];
          }
          parentField.merge.push(field);
        } else {
          if (!parentField.structure || parentField.structure.length === undefined) {
            parentField.structure = [];
          }
          parentField.structure.push(field);
        }
        if (field.isFlattened) {
          const flattenRelativePath = jsonField.path.length > 2 ? jsonField.path.slice(1) : jsonField.path[1];
          const childrenJsonFields = [
            {
              path: flattenRelativePath
            }
          ];
          this._processJsonSpecificationMergeFields(field, childrenJsonFields);
          if (flattenRelativePath.length || (field.mergeFields && field.mergeFields.length === 1)) {
            field.isflattened = true;
          }
        }
      });
    }
  }

  _processJsonSpecification(schema, merge, structure, properties) {
    if (!schema) {
      return null;
    }
    const rootField = new Field({
      id: schema.id,
      label: schema.label,
      canBe: [schema.id]
    });
    if (merge) {
      rootField.isMerge = true;
      rootField.isInvalid = true;
      this._processJsonSpecificationMergeFields(rootField, merge instanceof Array ? merge : [merge]);
    }
    this._processJsonSpecificationFields(rootField, structure);
    properties && Object.entries(properties).forEach(([name, value]) => rootField.setOption(name, value));
    return rootField;
  }

  selectQuery(query) {
    if (!this.isSaving
      && this.rootField && this.rootField.schema && this.rootField.schema.id
      && query && !query.isDeleting) {
      this.queryId = query.id;
      this.space = query.space;
      this.sourceQuery = query;
      this.updateQuery(query);
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.result = null;
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.savedQueryHasInconsistencies = this.hasQueryChanged;
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
    }
  }

  updateQuery(query) {
    this.context = toJS(query.context);
    if (!this.context) {
      this.context = toJS(defaultContext);
    }
    if (!this.context.query) {
      this.context.query = defaultContext.query;
    }
    this.meta = toJS(query.meta);
    if (this.meta) {
      this.label = this.meta.name?this.meta.name:"";
      this.description = this.meta.description?this.meta.description:"";
      if (this.meta.responseVocab) {
        this.defaultResponseVocab = this.meta.responseVocab;
        this.responseVocab = this.defaultResponseVocab;
        delete this.meta.responseVocab;
      } else {
        this.defaultResponseVocab = this.context.query;
        this.responseVocab = null;
      }
    } else {
      this.defaultResponseVocab = this.context.query;
      this.responseVocab = null;
    }
    this.rootField = this._processJsonSpecification(toJS(this.rootField.schema), toJS(query.merge), toJS(query.structure), toJS(query.properties));
    this.selectField(this.rootField);
  }

  async executeQuery() {
    if (!this.isQueryEmpty && !this.isRunning) {
      this.isRunning = true;
      this.runError = false;
      this.result = null;
      try {
        const query = this.JSONQuery;
        const response = await this.transportLayer.performQuery(query, this.stage, this.resultStart, this.resultSize);
        runInAction(() => {
          this.tableViewRoot = ["data"];
          this.result = response.data;
          this.isRunning = false;
        });
      } catch (e) {
        runInAction(() => {
          const message = e.message ? e.message : e;
          this.result = null;
          this.runError = `Error while executing query (${message})`;
          this.isRunning = false;
        });
        this.transportLayer.captureException(e);
      }
    }
  }

  setResultSize(size) {
    this.resultSize = size;
  }

  setResultStart(start) {
    this.resultStart = start;
  }

  setStage(scope) {
    this.stage = scope;
  }

  returnToTableViewRoot(index) {
    this.tableViewRoot = this.tableViewRoot.slice(0, index + 1);
  }

  appendTableViewRoot(index, key) {
    this.tableViewRoot.push(index);
    this.tableViewRoot.push(key);
  }

  cancelChanges() {
    if (this.sourceQuery) {
      this.selectQuery(this.sourceQuery);
      this.fromQueryId = this.queryId;
      this.fromLabel = this.label;
      this.fromDescription = this.description;
    } else if (!this.isSaving) {
      this.rootField.structure = [];
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
    }
  }

  setRunError(error) {
    this.runError = error;
  }

  setFetchQueriesError(error) {
    this.fetchQueriesError = error;
  }

  setSaveAsMode(mode) {
    this.saveAsMode = mode;
    if (mode) {
      this.fromQueryId = this.queryId;
      this.fromLabel = this.label;
      this.fromDescription = this.description;
      this.queryId = _.uuid();
      this.label = this.label?(this.label.endsWith("-Copy")?this.label:(this.label + "-Copy")):"";
    } else {
      this.queryId = this.fromQueryId;
      this.label = this.fromLabel;
      this.description = this.fromDescription;
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
    }

  }

  toggleCompareChanges() {
    this.compareChanges = !this.compareChanges;
  }

  setLabel(label) {
    this.label = label;
  }

  setSpace(space) {
    this.space = space;
  }

  setDescription(description) {
    this.description = description;
  }

  async saveQuery() {
    if (!this.isQueryEmpty && !this.isSaving && !this.saveError && !(this.sourceQuery && this.sourceQuery.isDeleting)) {
      this.isSaving = true;
      if (this.sourceQuery && this.sourceQuery.deleteError) {
        this.sourceQuery.deleteError = null;
      }
      const queryId = this.saveAsMode ? this.queryId : this.sourceQuery.id;
      const query = this.JSONQuery;
      try {
        await this.transportLayer.saveQuery(queryId, query, this.space);
        runInAction(() => {
          if (!this.saveAsMode && this.sourceQuery && this.sourceQuery.user.id === this.rootStore.authStore.user.id) {
            this.sourceQuery.label = query.meta && query.meta.name?query.meta.name:"";
            this.sourceQuery.description = query.meta && query.meta.description?query.meta.description:"";
            this.sourceQuery.context = query["@context"];
            this.sourceQuery.merge = query.merge;
            this.sourceQuery.structure = query.structure;
            this.sourceQuery.meta = query.meta;
            this.sourceQuery.properties = getProperties(query);
          } else if (!this.saveAsMode) {
            this.sourceQuery = this.findQuery(queryId);
            this.sourceQuery.label = query.meta && query.meta.name?query.meta.name:"";
            this.sourceQuery.description = query.meta && query.meta.description?query.meta.description:"";
            this.sourceQuery.specification = query;
            this.sourceQuery.meta = query.meta;
          } else {
            this.sourceQuery = {
              id: queryId,
              user: {
                id: this.rootStore.authStore.user.id,
                name: this.rootStore.authStore.user.displayName,
                picture: this.rootStore.authStore.user.picture
              },
              context: query["@context"],
              merge: query.merge,
              structure: query.structure,
              properties: getProperties(query),
              meta: query.meta,
              label: query.meta && query.meta.name?query.meta.name:"",
              description: query.meta && query.meta.description?query.meta.description:"",
              space: query.space,
              isDeleting: false,
              deleteError: null
            };
            this.specifications.push(this.sourceQuery);
            this.rootStore.history.push(`/queries/${queryId}/${this.mode}`);
          }
          this.saveAsMode = false;
          this.isSaving = false;
          this.fromQueryId = null;
          this.fromLabel = "";
          this.fromDescription = "";
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        runInAction(() => {
          this.saveError = `Error while saving query "${queryId}" (${message})`;
          this.isSaving = false;
        });
        this.transportLayer.captureException(e);
      }
    }
  }

  cancelSaveQuery() {
    if (!this.isSaving) {
      this.saveError = null;
    }
  }

  async deleteQuery(query) {
    if (query && !query.isDeleting && !query.deleteError && !(query === this.sourceQuery && this.isSaving)) {
      query.isDeleting = true;
      try {
        await this.transportLayer.deleteQuery(query.id);
        runInAction(() => {
          query.isDeleting = false;
          if (query === this.sourceQuery) {
            this.sourceQuery = null;
          }
          const index = this.specifications.findIndex(spec => spec.id === query.id);
          if (index !== -1) {
            this.specifications.splice(index, 1);
          }
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        runInAction(() => {
          query.deleteError = `Error while deleting query "${query.id}" (${message})`;
          query.isDeleting = false;
        });
        this.transportLayer.captureException(e);
      }
    }
  }

  cancelDeleteQuery(query) {
    if (query && !query.isDeleting) {
      query.deleteError = null;
    }
  }

  async fetchQueries() {
    if (!this.isFetchingQueries) {
      this.specifications = [];
      this.fetchQueriesError = null;
      if (this.rootField && this.rootField.schema && this.rootField.schema.id) {
        this.isFetchingQueries = true;
        try {
          const response = await this.transportLayer.listQueries(this.rootField.schema.id);
          runInAction(() => {
            this.specifications = [];
            this.queriesFilterValue = "";
            const jsonSpecifications = response && response.data && response.data.data && response.data.data.length ? response.data.data : [];
            jsonSpecifications.forEach(async jsonSpec => {
              try {
                const query = await this.normalizeQuery(jsonSpec);
                runInAction(() => this.specifications.push(query));
              } catch (e) {
                runInAction(() => {
                  this.fetchQueriesError = `Error while trying to expand/compact JSON-LD (${e})`;
                });
              }
            });
            if (this.sourceQuery) {
              const query = this.findQuery(this.sourceQuery.id);
              if (query) {
                this.sourceQuery = query;
              } else {
                this.sourceQuery = null;
              }
            }
            this.isFetchingQueries = false;
          });
        } catch (e) {
          runInAction(() => {
            this.specifications = [];
            const message = e.message ? e.message : e;
            this.fetchQueriesError = `Error while fetching saved queries for "${this.rootField.id}" (${message})`;
            this.isFetchingQueries = false;
          });
        }
      }
    }
  }

  async fetchQueryById(queryId) {
    this.isFetchingQuery = true;
    this.fetchQueryError = null;
    try {
      const response = await this.transportLayer.getQuery(queryId);
      const jsonSpecification = response && response.data ? response.data : null;
      try{
        const query = await this.normalizeQuery(jsonSpecification);
        runInAction(() => this.specifications.push(query));
      } catch (e) {
        runInAction(() => this.fetchQueriesError = `Error while trying to expand/compact JSON-LD (${e})`);
      }
      runInAction(() => this.isFetchingQuery = false);
    } catch (e) {
      runInAction(() => {
        const { response } = e;
        const { status } = response;
        const message = e.message ? e.message : e;
        this.isFetchingQuery = false;
        switch (status) {
        case 401: // Unauthorized
        case 403: // Forbidden
        {
          this.fetchQueryError = `You do not have permission to access the query with id "${queryId}"`;
          break;
        }
        case 404:
        {
          // It means that the query does not exist.
          return;
        }
        default: {
          this.fetchQueryError = `Error while fetching query with id "${queryId}" (${message})`;
        }
        }
      });
    }
  }

  async normalizeQuery(jsonSpec) {
    let queryId = jsonSpec["@id"];
    jsonSpec["@context"] = toJS(defaultContext);
    const expanded = await jsonld.expand(jsonSpec);
    const compacted = await jsonld.compact(expanded, jsonSpec["@context"]);
    return {
      id: queryId,
      user: normalizeUser(jsonSpec["https://core.kg.ebrains.eu/vocab/meta/user"]),
      context: compacted["@context"],
      merge: compacted.merge,
      structure: compacted.structure,
      properties: getProperties(compacted),
      meta: compacted.meta,
      label: compacted.meta && compacted.meta.name?compacted.meta.name:"",
      description: compacted.meta && compacted.meta.description?compacted.meta.description:"",
      space: jsonSpec["https://core.kg.ebrains.eu/vocab/meta/space"],
      isDeleting: false,
      deleteError: null
    };
  }

  findQuery(id) {
    return this.specifications.find(spec => spec.id === id);
  }

  setMode(mode) {
    const id = (this.saveAsMode && this.sourceQuery && this.queryId !== this.sourceQuery.id)?this.sourceQuery.id:this.queryId;
    if (["build", "edit", "execute"].includes(mode)) {
      this.mode = mode;
      const path = `/queries/${id}/${mode}`;
      if (this.rootStore.history.location.pathname !== path) {
        this.rootStore.history.push(path);
      }
    } else {
      this.mode = "build";
      this.rootStore.history.replace(`/queries/${id}/build`);
    }
  }

  async selectQueryById(id, mode) {
    let query = this.findQuery(id);
    if(!query) {
      await this.fetchQueryById(id);
      query = this.findQuery(id);
    }
    if(query) {
      const typeName = query.meta.type;
      const type = this.rootStore.typeStore.types[typeName];
      if(type) {
        this.selectRootSchema(type);
        this.selectQuery(query);
        this.setMode(mode);
      } else {
        this.rootStore.history.replace("/");
        if (this.mode !== "build" && this.mode !== "edit") {
          this.mode = "build";
        }
      }
    } else {
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
      if(this.hasRootSchema) {
        this.setAsNewQuery(id);
      } else {
        this.clearRootSchema();
        this.rootStore.history.replace("/");
      }
    }
  }
}

export default QueryBuilderStore;