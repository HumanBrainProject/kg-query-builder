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


const defaultResultSize = 20;

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

const rootFieldReservedProperties = [
  "root_schema",
  "schema:root_schema",
  "http://schema.org/root_schema",
  "identifier",
  "schema:identifier",
  "http://schema.org/identifier",
  "@id",
  "@type",
  "@context",
  "meta",
  "structure",
  "merge",
  "_collection",
  "_id",
  "_identifiers",
  "_indexTimestamp",
  "_inferenceOf",
  "_key",
  "_rev",
  "_timestamp",
  "https://core.kg.ebrains.eu/vocab/meta/revision",
  "https://core.kg.ebrains.eu/vocab/meta/space",
  "https://core.kg.ebrains.eu/vocab/meta/user",
  "https://core.kg.ebrains.eu/vocab/meta/alternative"
];
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

const normalizeUser = user => {
  if (!user || !user["@id"]) {
    return {
      id: null,
      name: null,
      picture: null
    };
  }
  return {
    id: user["@id"],
    name: user["http://schema.org/name"],
    picture: user["https://schema.hbp.eu/users/picture"]
  };
};

export class QueryBuilderStore {
  meta = null;
  defaultResponseVocab = defaultContext.query;
  responseVocab = defaultContext.query;
  queryId = null;
  label = "";
  space = null;
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
  fromSpace = null;
  isFetchingQuery = false;
  fetchQueryError = null;
  mode = "build";
  specifications = [];
  includeAdvancedAttributes = false;
  resultSize = defaultResultSize;
  resultStart = 0;
  resultInstanceId = "";
  resultRestrictToSpaces = null;
  resultQueryParameters = {};
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
      resultInstanceId: observable,
      resultRestrictToSpaces: observable,
      setResultRestrictToSpaces: action,
      resultQueryParameters: observable,
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
      canSaveQuery: computed,
      isQueryEmpty: computed,
      hasQueryChanged: computed,
      hasChanged: computed,
      hasQueries: computed,
      groupedQueries: computed,
      groupedFilteredQueries: computed,
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
      queryParametersNames: computed,
      getQueryParameters: action,
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
      setResultInstanceId: action,
      setResultQueryParameter: action,
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
      fromSpace: observable,
      mode: observable,
      setMode: action,
      includeAdvancedAttributes: observable,
      toggleIncludeAdvancedAttributes: action,
      saveLabel: computed
    });

    this.transportLayer = transportLayer;
    this.rootStore = rootStore;
  }

  setResultRestrictToSpaces(spaces) {
    this.resultRestrictToSpaces = spaces;
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
      const reg = /^https?:\/\/.+\/(.+)$/;
      const type = this.rootStore.typeStore.types[id];
      if (type) {
        const properties = type.properties.filter(prop => (this.includeAdvancedAttributes  || !prop.attribute.startsWith("https://core.kg.ebrains.eu/vocab/meta"))
                                                            && (!filter 
                                                                || (prop.label && prop.label.toLowerCase().includes(filter))
                                                                || (Array.isArray(prop.canBe) && prop.canBe.some(t => {
                                                                      const m = t.match(reg);
                                                                      if (!m) {
                                                                        return false;
                                                                      }
                                                                      return m[1].toLowerCase().includes(filter);
                                                                  }))
                                                            )
                                                  );
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
          if (Array.isArray(prop.canBe)) {
            counters[key] = {
              property: {...prop, canBe:  [...prop.canBe].sort()},
              count: 0
            };
          } else {
            counters[key] = {
              property: prop,
              count: 0
            };
          }
        } else {
          const property = counters[key].property;
          if (Array.isArray(prop.canBe)) {
            if (Array.isArray(property.canBe)) {
              prop.canBe.forEach(p => {
                if (!property.canBe.includes(p)) {
                  property.canBe.push(p);
                }
              });
              property.canBe = [...property.canBe].sort();
            } else {
              property.canBe = [...prop.canBe].sort();
            }
          }
        }
        counters[key].count += 1;
      });
    });
    return Object.values(counters).filter(({count}) => count > 1 || groups.length === 1).map(({property}) => property).sort((a, b) => a.label.localeCompare(b.label));
  }

  isACurrentFieldFilteredCommonProperty(property) {
    return this.currentFieldFilteredCommonProperties.some(prop => prop.simpleAttributeName === property.simpleAttributeName && prop.reverse === property.reverse);
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
      this.responseVocab = this.context.meta?this.context.meta.responseVocab:this.context.query;
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.rootField = new Field({
        id: schema.id,
        label: schema.label,
        canBe: [schema.id]
      });
      this.rootField.isInvalidLeaf = true;
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
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
      this.space = toJS(this.rootStore.authStore.privateSpace);
      this.selectField(this.rootField);
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
      this.resultStart = 0;
      this.resultSize = defaultResultSize;
      this.resultInstanceId = "";
      this.resultQueryParameters = {};
      this.resultRestrictToSpaces = null;
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
      this.rootField.isInvalidLeaf = true;
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
      this.responseVocab = this.defaultResponseVocab;
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
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
      this.space = toJS(this.rootStore.authStore.privateSpace);
      this.resetField();
      if (this.mode !== "build" && this.mode !== "edit") {
        this.mode = "build";
      }
      this.resultStart = 0;
      this.resultSize = defaultResultSize;
      this.resultInstanceId = "";
      this.resultQueryParameters = {};
      this.resultRestrictToSpaces = null;
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
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
      this.space = toJS(this.rootStore.authStore.privateSpace);
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

  get canSaveQuery() {
    return !!this.space?.permissions?.canWrite;
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

  get groupedQueries() {
    const groups = {};
    const authStore = this.rootStore.authStore;
    this.specifications.forEach(spec => {
      if (spec.space) {
        const space = authStore.getSpace(spec.space);
        if (space) {
          if (!groups[spec.space]) {
            groups[spec.space] = {
              name: space.name,
              label: space.isPrivate?"My private queries":`Shared queries in space ${space.name}`,
              showUser: true,
              isPrivate: space.isPrivate,
              permissions: {...space.permissions},
              queries: []
            };
          }
          groups[spec.space].queries = [...groups[spec.space].queries, spec].sort(queryCompare);
        }
      }
    });
    return Object.values(groups)
      .filter(group => group.queries.length)
      .sort((a, b) => {
        if (a.isPrivate) {
          return -1;
        }
        if (b.isPrivate) {
          return 1;
        }
        return a.name.localeCompare(b.name);
      });
  }

  get groupedFilteredQueries() {
    const filter = this.queriesFilterValue.toLowerCase();
    if (!filter) {
      return this.groupedQueries;
    }
    return this.groupedQueries.reduce((acc, group) => {
      const queries = group.queries.filter(query => (query.label && query.label.toLowerCase().includes(filter)) || (query.description && query.description.toLowerCase().includes(filter)) || (query.id && query.id.toLowerCase().includes(filter)));
      if (queries.length) {
        acc.push({
          name: group.name,
          label: group.label,
          showUser: group.showUser,
          permissions: {...group.permissions},
          queries: queries
        });
      }
      return acc;
    }, []);
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
      if (Array.isArray(schema.canBe)) {
        newField.isInvalidLeaf = true;
      }
      parent.isInvalidLeaf = false;
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
      newField.alias = uniqueId("field");
      newField.isInvalidLeaf = true;
      parent.isInvalidLeaf = false;
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
      if (Array.isArray(schema.canBe)) {
        newField.isInvalidLeaf = true;
      }
      parent.isInvalidLeaf = false;
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
          field.parent.isInvalidLeaf = true;
          field.parent.isFlattened = false;
        }
        this.checkMergeFields(field.parent);
      } else {
        remove(field.parent.structure, childField => field === childField);
        if (!field.parent.structure.length) {
          field.parent.isInvalidLeaf = true;
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

  getParametersFromField(field) {
    const parameters = [];
    if (field.optionsMap && field.optionsMap.has("filter")) {
      const filter = field.optionsMap.get("filter");
      if (filter && filter.parameter && typeof filter.parameter === "string") {
        const parameter = filter.parameter.trim();
        if (parameter) {
          parameters.push(parameter);
        }
      }
    }
    if (Array.isArray(field.merge) && field.merge.length) {
      field.merge.reduce((acc, f) => {
        acc.push(...this.getParametersFromField(f));
        return acc;
      }, parameters);
    }
    if (Array.isArray(field.structure) && field.structure.length) {
      field.structure.reduce((acc, f) => {
        acc.push(...this.getParametersFromField(f));
        return acc;
      }, parameters);
    }
    return parameters;
  }

  get queryParametersNames() {
    return Array.from(new Set(this.getParametersFromField(this.rootField).filter(p => !["scope", "size", "start", "instanceId"].includes(p)).sort()));
  }

  getQueryParameters() {
    this.queryParametersNames.forEach(name => {
      if (!this.resultQueryParameters[name]) {
        this.resultQueryParameters[name] = {
          name: name,
          value: ""

        };
      }
    });
    return Object.values(this.resultQueryParameters).filter(p => this.queryParametersNames.includes(p.name));
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
    } else {
      delete meta.responseVocab;
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

  _getRelativePath(jsonRP, isFlattened) {
    if(typeof jsonRP === "string") {
      return jsonRP;
    }
    if(isFlattened) {
      if(jsonRP[0] && typeof jsonRP[0] === "string") {
        return jsonRP[0];
      }
      return jsonRP[0]["@id"];
    }
    return jsonRP["@id"];
  }

  _getReverse(jsonRP, isFlattened) {
    if(typeof jsonRP === "string") {
      return false;
    }
    if(isFlattened) {
      if(jsonRP[0] && typeof jsonRP[0] === "string") {
        return false;
      }
      return jsonRP[0].reverse;
    }
    return jsonRP.reverse;
  }

  _getTypeFilter(jsonRP, isFlattened) {
    if(typeof jsonRP === "string") {
      return undefined;
    }
    if(isFlattened) {
      if(jsonRP[0] && typeof jsonRP[0] === "string") {
        return undefined;
      }
      return jsonRP[0].typeFilter;
    }
    return jsonRP.typeFilter;
  }

  _getValidTypeFilter(typeFilter) {
    if(Array.isArray(typeFilter)) {
      return typeFilter.map(t => {
        if(t !== null && typeof t === "object") {
          return t["@id"];
        }
        return undefined;
      })
    }
    if(typeFilter !== null && typeof typeFilter === "object" && typeFilter["@id"]) {
      return [typeFilter["@id"]];
    }
    return [];
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
          const relativePath = jsonRP && this._getRelativePath(jsonRP, isFlattened);
          const reverse = jsonRP && this._getReverse(jsonRP, isFlattened);
          const typeFilter = jsonRP && this._getTypeFilter(jsonRP, isFlattened);
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
          } else if (relativePath === "@id" || relativePath === "@type") {
            attribute = relativePath;
          }
          let property = null;
          if (attribute) {
            parentField.lookups.some(id => this._findAndSetProperty(property, id, attribute, jsonField));
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
          const validTypeFilter = this._getValidTypeFilter(typeFilter);
          if (validTypeFilter.length) {
            field.typeFilterEnabled = true;
            field.typeFilter = validTypeFilter;
          }
          if (Array.isArray(property.canBe)) {
            field.isInvalidLeaf = true;
          }
          parentField.isInvalidLeaf = false;
        }

        if (jsonField.merge) {
          if (!field) {
            field = new Field({}, parentField);
            field.isInvalidLeaf = true;
            parentField.isInvalidLeaf = false;
          }
          field.isMerge = true;
          this._processJsonSpecificationMergeFields(field, jsonField.merge instanceof Array ? jsonField.merge : [jsonField.merge]);
        }
        if (!field) {
          field = new Field({}, parentField);
          field.isInvalid = true;
          field.isUnknown = true;
          field.isInvalidLeaf = true;
          parentField.isInvalidLeaf = false;
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

  _findAndSetProperty(property, id, attribute, jsonField) {
    const type = this.rootStore.typeStore.types[id];
    if (type) {
      property = type.properties.find(property => property.attribute === attribute && (!jsonField.structure || (jsonField.structure && property.canBe)));
      if (property) {
        property = toJS(property);
      }
      return !!property;
    }
    return false;
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
          const relativePath = jsonRP && this._getRelativePath(jsonRP, isFlattened);
          const reverse = jsonRP && this._getReverse(jsonRP, isFlattened);
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
            parentFieldLookup.schema.canBe.some(id => this._findAndSetProperty(property, id, attribute, jsonField));
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
        parentField.isInvalidLeaf = false;
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
      if (parentField.isRootMerge && Array.isArray(parentField.merge) && parentField.merge.length < 2) {
        parentField.isInvalid = true;
      }
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
      this.space = toJS(this.rootStore.authStore.getSpace(query.space));
      this.sourceQuery = query;
      this.updateQuery(query);
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.result = null;
      this.resultStart = 0;
      this.resultSize = defaultResultSize;
      this.resultInstanceId = "";
      this.resultQueryParameters = {};
      this.resultRestrictToSpaces = null;
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.getSpace(query.space));
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
      } else {
        this.defaultResponseVocab = this.context.query;
      }
      this.responseVocab = this.meta.responseVocab;
    } else {
      this.defaultResponseVocab = this.context.query;
      this.responseVocab = this.context.query;
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
        const instanceId = typeof this.resultInstanceId === "string"?this.resultInstanceId.trim():null;
        const params = this.getQueryParameters().reduce((acc, p) => {
          acc[p.name] = typeof p.value === "string"?p.value:"";
          return acc;
        }, {})
        const response = await this.transportLayer.performQuery(query, this.stage, this.resultStart, this.resultSize, instanceId?instanceId:null, this.resultRestrictToSpaces, params);
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

  setResultInstanceId(instanceId) {
    this.resultInstanceId = instanceId;
  }

  setResultQueryParameter(name, value) {
    if (this.resultQueryParameters[name]) {
      this.resultQueryParameters[name].value = value;
    } else {
      this.resultQueryParameters[name] = {
        name: name,
        value: value
      };
    }
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
      this.fromSpace = toJS(this.space);
    } else if (!this.isSaving) {
      this.rootField.structure = [];
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
    }
  }

  setRunError(error) {
    this.runError = error;
  }

  setFetchQueriesError(error) {
    this.fetchQueriesError = error;
  }

  get saveLabel() {
    if(this.label && this.label.endsWith("-Copy")) {
      return this.label;
    }
    return this.label + "-Copy";
  }

  setSaveAsMode(mode) {
    this.saveAsMode = mode;
    if (mode) {
      this.fromQueryId = this.queryId;
      this.fromLabel = this.label;
      this.fromDescription = this.description;
      this.fromSpace = toJS(this.space);
      this.queryId = _.uuid();
      this.label = this.saveLabel;
      this.space = (this.space && this.space.permissions && this.space.permissions.canCreate)?toJS(this.space):toJS(this.rootStore.authStore.privateSpace);
    } else {
      this.queryId = this.fromQueryId;
      this.label = this.fromLabel;
      this.description = this.fromDescription;
      this.space = toJS(this.fromSpace);
      this.fromQueryId = null;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
    }

  }

  toggleCompareChanges() {
    this.compareChanges = !this.compareChanges;
  }

  setLabel(label) {
    this.label = label;
  }

  setSpace(space) {
    this.space = toJS(space);
  }

  setDescription(description) {
    this.description = description;
  }

  async saveQuery(navigation) {
    if (!this.isQueryEmpty && !this.isSaving && !this.saveError && !(this.sourceQuery && this.sourceQuery.isDeleting)) {
      this.isSaving = true;
      if (this.sourceQuery && this.sourceQuery.deleteError) {
        this.sourceQuery.deleteError = null;
      }
      const queryId = this.saveAsMode ? this.queryId : this.sourceQuery.id;
      const query = this.JSONQuery;
      try {
        await this.transportLayer.saveQuery(queryId, query, this.space?this.space.name:"myspace");
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
              space: this.rootStore.authStore.getSpace(query.space),
              isDeleting: false,
              deleteError: null
            };
            this.specifications.push(this.sourceQuery);
            navigation(`/queries/${queryId}/${this.mode}`);
          }
          this.saveAsMode = false;
          this.isSaving = false;
          this.fromQueryId = null;
          this.fromLabel = "";
          this.fromDescription = "";
          this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
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

  setMode(mode, location, navigate) {
    const id = (this.saveAsMode && this.sourceQuery && this.queryId !== this.sourceQuery.id)?this.sourceQuery.id:this.queryId;
    if (["build", "edit", "execute"].includes(mode)) {
      this.mode = mode;
      const path = `/queries/${id}/${mode}`;
      if (location.pathname !== path) {
        navigate(path);
      }
    } else {
      this.mode = "build";
      navigate(`/queries/${id}/build`, { replace: true });
    }
  }

  async selectQueryById(id, mode, location, navigate) {
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
        this.setMode(mode, location, navigate);
      } else {
        navigate("/", {replace: true});
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
        navigate("/", {replace: true});
      }
    }
  }
}

export default QueryBuilderStore;