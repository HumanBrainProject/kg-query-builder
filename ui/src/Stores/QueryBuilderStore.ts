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
import { AxiosError } from "axios";
import isEqual from "lodash/isEqual";
import remove from "lodash/remove";
import _  from "lodash-uuid";
import jsonld from "jsonld";
import jsdiff from "diff";

import { defaultContext, rootFieldReservedProperties } from "./QueryBuilderStore/QuerySettings";
import { buildFieldTreeFromQuery } from "./QueryBuilderStore/QueryToFieldTree";
import { buildQueryStructureFromFieldTree } from "./QueryBuilderStore/FieldTreeToQuery";
import { Space, Permission } from "./AuthStore";
import { TransportLayer } from "../Services/TransportLayer";
import { RootStore } from "./RootStore";
import Field from "./Field";
import { User } from "@sentry/browser";

export interface QueryMeta {
  name?: string
  description?: string
  type: string
  responseVoca?: string
}

export interface JsonLd {
  "@id": string
}

export interface JsonLdWithType extends JsonLd  {
  "@type": string
}

export interface QueryPath extends JsonLd {
  reverse?: boolean,
  typeFilter?: JsonLd[]
}

export enum QueryFilterOperation {
  IS_EMPTY = "IS_EMPTY",
  STARTS_WITH = "STARTS_WITH",
  ENDS_WITH = "ENDS_WITH",
  CONTAINS = "CONTAINS",
  EQUALS = "EQUALS",
  REGEX = "REGEX"
}

export interface QueryValueFilter {
  op: QueryFilterOperation,
  parameter?: string,
  value?: string
}

export enum QuerySingleItemStrategy {
  FIRST = "FIRST",
  CONCAT = "CONCAT"
}

export interface QueryStructureItem {
  path: (QueryPath|string)[]|QueryPath|string,
  propertyName: string,
  structure?: QueryStructureItem[],
  required?: boolean,
  sort?: boolean,
  filter?: QueryValueFilter,
  singleValue?: QuerySingleItemStrategy,
}

export interface QueryContext {
  "@vocab": string,
  "query": string,
  "propertyName": JsonLdWithType,
  "path": JsonLdWithType
}

export interface QueryProperties {
  [name: string]: any
}

export interface JSONQuerySpecification {
  "@id"?: string,
  "@context": QueryContext,
  meta: QueryMeta,
  structure?: QueryStructureItem[],
  [name: string]: any
}

export interface QueryUser {
  id: string,
  name: string,
  picture: string
}

export interface QuerySpecification {
  id: string,
  user: QueryUser,
  label: string,
  description: string,
  space: string,
  meta: QueryMeta,
  structure: QueryStructureItem[],
  deleteError?: string,
  isDeleting: boolean,
  context: QueryContext,
  properties: QueryProperties
}

export interface SpaceQueries {
  name: string,
  label: string,
  showUser: boolean,
  isPrivate: boolean,
  permissions: Permission,
  queries: QuerySpecification[]
}

export interface GroupedBySpaceQueries {
  [name: string]: SpaceQueries
}

const querySpecificationCompare = (a: QuerySpecification, b: QuerySpecification): number => {
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

const querySpecificationContains = (query: QuerySpecification, filter: string): boolean => 
    (!!query.label && query.label.toLowerCase().includes(filter)) ||
    (!!query.description && query.description.toLowerCase().includes(filter)) ||
    (!!query.id && query.id.toLowerCase().includes(filter));

const spaceQueriesCompare = (a: SpaceQueries, b: SpaceQueries): number => {
  if (a.isPrivate) {
    return -1;
  }
  if (b.isPrivate) {
    return 1;
  }
  return a.name.localeCompare(b.name);
};

const isChildOfField = (node, parent, root): boolean => {
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
    name: user["http://schema.org/name"], //NOSONAR it's a schema
    picture: user["https://schema.hbp.eu/users/picture"]
  };
};

const defaultResultSize = 20;

export class QueryBuilderStore {
  meta = null;
  defaultResponseVocab = defaultContext.query;
  responseVocab = defaultContext.query;
  queryId?: string;
  label = "";
  space?: Space;
  description = "";
  stage = "RELEASED";
  sourceQuery?: QuerySpecification;
  context = null;
  rootField = null;
  fetchQueriesError?: string;
  isFetchingQueries = false;
  isQueriesFetched = false;
  isSaving = false;
  saveError = null;
  savedQueryHasInconsistencies = false;
  isRunning = false;
  runError?: string;
  saveAsMode = false;
  compareChanges = false;
  queriesFilterValue = "";
  childrenFilterValue = "";
  fromQueryId?: string;
  fromLabel = "";
  fromDescription = "";
  fromSpace = null;
  isFetchingQuery = false;
  fetchQueryError?: string;
  specifications: QuerySpecification[] = [];
  includeAdvancedAttributes = false;
  resultSize = defaultResultSize;
  resultStart = 0;
  resultInstanceId = "";
  resultRestrictToSpaces?: string[];
  resultQueryParameters = {};
  result = null;
  showSavedQueries = false;

  currentField = null;

  transportLayer: TransportLayer;
  rootStore: RootStore;

  constructor(transportLayer: TransportLayer, rootStore: RootStore) {
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
      isQueriesFetched: observable,
      isSaving: observable,
      saveError: observable,
      savedQueryHasInconsistencies: observable,
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
      clearQuery: action,
      setAsNewQuery: action,
      rootSchema: computed,
      rootSchemaId: computed,
      hasRootSchema: computed,
      hasSupportedRootSchema: computed,
      isQuerySaved: computed,
      canSaveQuery: computed,
      canDeleteQuery: computed,
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
      removeField: action,
      setResponseVocab: action,
      selectField: action,
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
      cancelChanges: action,
      setRunError: action,
      setSaveAsMode: action,
      toggleCompareChanges: action,
      setLabel: action,
      setSpace: action,
      saveQuery: action,
      cancelSaveQuery: action,
      deleteQuery: action,
      cancelDeleteQuery: action,
      fetchQueries: action,
      clearQueries: action,
      setDescription: action,
      fetchQuery: action,
      fromQueryId: observable,
      fromLabel: observable,
      fromDescription: observable,
      fromSpace: observable,
      includeAdvancedAttributes: observable,
      toggleIncludeAdvancedAttributes: action,
      saveLabel: computed,
      resetQuery: action,
      showSavedQueries: observable,
      toggleShowSavedQueries: action,
    });

    this.transportLayer = transportLayer;
    this.rootStore = rootStore;
  }

  toggleShowSavedQueries(show: boolean) {
    this.showSavedQueries = show;
  }

  setResultRestrictToSpaces(spaces: string[]) {
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
    if (!field.isFlattened) {
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
      const reg = /^https?:\/\/.+\/(.+)$/; //NOSONAR
      const type = this.rootStore.typeStore.types.get(id);
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

    const counters = {};

    const addPropToNewCounter = (key: string, prop) => {
      if (Array.isArray(prop.canBe)) {
        counters[key] = {
          property: {...prop, canBe:  [...prop.canBe].sort()},
          count: 1
        };
      } else {
        counters[key] = {
          property: prop,
          count: 1
        };
      }
    };

    const addPropToCounter = (key: string, prop) => {
      const property = counters[key].property;
      if (Array.isArray(prop.canBe)) {
        if (Array.isArray(property.canBe)) {
          const toAdd = prop.canBe.filter(p => !property.canBe.includes(p));
          property.canBe = [...property.canBe, ...toAdd].sort();
        } else {
          property.canBe = [...prop.canBe].sort();
        }
      }
      counters[key].count += 1;
    };

    const addPropToCounters = prop => {
      const key = `${prop.attribute}${prop.reverse?":is-reverse":""}`;
      if (!counters[key]) {
        addPropToNewCounter(key, prop);
      } else {
        addPropToCounter(key, prop);
      }
    };

    const groups = this.currentFieldFilteredPropertiesGroups;
    if (!groups.length) {
      return [];
    }

    groups.forEach(group => {
      group.properties.forEach(prop => addPropToCounters(prop));
    });
    return Object.values(counters)
      .filter(({count}) => count > 1 || groups.length === 1)
      .map(({property}) => property)
      .sort((a, b) => a.label.localeCompare(b.label));
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
      this.queryId = undefined;
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
      this.runError = undefined;
      this.saveAsMode = false;
      this.queriesFilterValue = "";
      this.childrenFilterValue = "";
      this.result = null;
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
      this.space = toJS(this.rootStore.authStore.privateSpace);
      this.selectField(this.rootField);
      this.resultStart = 0;
      this.resultSize = defaultResultSize;
      this.resultInstanceId = "";
      this.resultQueryParameters = {};
      this.resultRestrictToSpaces = undefined;
      this.showSavedQueries = false;
    }
  }

  resetQuery() {
    this.resetRootSchema();
    this.queryId = undefined;
    this.showSavedQueries = false;
  }

  resetRootSchema() {
    if (!this.isSaving) {
      const queryId = this.queryId;
      this.clearQuery();
      this.queryId = queryId;
    }
  }

  clearRootSchema() {
    if (!this.isSaving) {
      this.rootField = null;
      this.clearQuery();
    }
  }

  clearQuery() {
    if (!this.isSaving) {
      const rootField = this.rootField;
      if (rootField) {
        this.rootField = new Field(toJS(rootField.schema));
        this.selectField(this.rootField);
        this.rootField.isInvalidLeaf = true;
      }
      this.fetchQueryError = undefined;
      this.queryId = undefined;
      this.label = "";
      this.description = "";
      this.context = toJS(defaultContext);
      this.meta = null;
      this.defaultResponseVocab = this.context.query;
      this.responseVocab = this.defaultResponseVocab;
      this.sourceQuery = undefined;
      this.savedQueryHasInconsistencies = false;
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = undefined;
      this.saveAsMode = false;
      this.queriesFilterValue = "";
      this.childrenFilterValue = "";
      this.result = null;
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
      this.space = toJS(this.rootStore.authStore.privateSpace);
      this.resultStart = 0;
      this.resultSize = defaultResultSize;
      this.resultInstanceId = "";
      this.resultQueryParameters = {};
      this.resultRestrictToSpaces = undefined;
      this.showSavedQueries = false;
    }
  }

  setAsNewQuery(queryId: string) {
    if (!this.isSaving) {
      this.queryId = queryId;
      this.label = "";
      this.description = "";
      this.sourceQuery = undefined;
      this.savedQueryHasInconsistencies = false;
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = undefined;
      this.saveAsMode = false;
      this.queriesFilterValue = "";
      this.childrenFilterValue = "";
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
      this.space = toJS(this.rootStore.authStore.privateSpace); 
      this.selectField(this.rootField);     
    }
  }

  get rootSchema() {
    return this.rootField?.schema;
  }

  get rootSchemaId() {
    return this.rootField?.schema?.id;
  }

  get hasRootSchema(): boolean {
    return !!this.rootSchema;
  }

  get hasSupportedRootSchema(): boolean  {
    if (!this.hasRootSchema) {
      return false;
    }
    const typeName = this.rootSchema.id;
    const type = this.rootStore.typeStore.types.get(typeName);
    return !!type;
  }

  get isQuerySaved(): boolean {
    return this.sourceQuery !== null;
  }

  get canSaveQuery(): boolean {
    return !!this.space?.permissions?.canWrite;
  }

  get canDeleteQuery(): boolean {
    return !!this.space?.permissions?.canDelete;
  }

  get isQueryEmpty(): boolean {
    return !this.rootField || !this.rootField.structure || !this.rootField.structure.length;
  }

  get hasQueryChanged(): boolean {
    return !isEqual(this.JSONQuery, this.JSONSourceQuery);
  }

  get hasChanged(): boolean {
    return (!this.isQueryEmpty && (this.sourceQuery === null || (this.saveAsMode && this.queryId !== this.sourceQuery.id) || this.hasQueryChanged))
      || (this.isQueryEmpty && !!this.sourceQuery);
  }

  get hasQueries(): boolean {
    return this.specifications.length > 0;
  }

  get groupedQueries(): SpaceQueries[] {
    const groups: GroupedBySpaceQueries = {};
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
          groups[spec.space].queries = [...groups[spec.space].queries, spec].sort(querySpecificationCompare);
        }
      }
    });
    return Object.values(groups)
      .filter(group => group.queries.length)
      .sort(spaceQueriesCompare);
  }

  get groupedFilteredQueries(): SpaceQueries[] {
    const filter = this.queriesFilterValue.toLowerCase();
    if (!filter) {
      return this.groupedQueries;
    }
    return this.groupedQueries.reduce((acc: SpaceQueries[], group) => {
      const queries = group.queries.filter(query => querySpecificationContains(query, filter));
      if (queries.length) {
        acc.push({
          name: group.name,
          label: group.label,
          showUser: group.showUser,
          permissions: {...group.permissions},
          queries: queries
        } as SpaceQueries);
      }
      return acc;
    }, []);
  }

  setQueriesFilterValue(value: string) {
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
      if (schema.reverse) {
        newField.isReverse = true;
      }
      if (!parent.structure || parent.structure.length === undefined) {
        parent.structure = [];
      }
      parent.structure.push(newField);
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
    const currentField = this.currentField;
    const parentField = field.parent;
    this.childrenFilterValue = "";
    if (isChildOfField(this.currentField, field, this.rootField)) {
      this.selectField(parentField);
    }
    remove(field.parent.structure, childField => field === childField);
    if (!field.parent.structure.length) {
      field.parent.isInvalidLeaf = true;
      field.parent.isFlattened = false;
    }
    if (field === currentField) {
      this.selectField(parentField);
    }
  }

  setResponseVocab(vocab: string) {
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
    this.rootStore.typeStore.addTypesToFetch(this.currentField.lookups);
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
    return buildQueryStructureFromFieldTree(this.rootField);
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

  get JSONQuery(): JSONQuerySpecification {
    let query: JSONQuerySpecification = {
      "@context": toJS(this.context),
      meta: this.JSONMetaProperties
    };
    if (this.JSONQueryProperties && this.JSONQueryFields) {
      query.structure = this.JSONQueryFields;
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
      json.meta = toJS(this.sourceQuery.meta);
    }
    return json;
  }

  get JSONQueryDiff() {
    return jsdiff.diffJson(this.JSONSourceQuery, this.JSONQuery);
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
      this.runError = undefined;
      this.saveAsMode = false;
      this.result = null;
      this.resultStart = 0;
      this.resultSize = defaultResultSize;
      this.resultInstanceId = "";
      this.resultQueryParameters = {};
      this.resultRestrictToSpaces = undefined;
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.getSpace(query.space));
      this.savedQueryHasInconsistencies = this.hasQueryChanged;
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
    const typeName = query?.meta?.type;
    const type = this.rootStore.typeStore.types.get(typeName);
    if(type) {
      const schema = {
        id: type.id,
        label: type.label,
        canBe: [type.id]
      };
      this.rootField = buildFieldTreeFromQuery(this.rootStore.typeStore.types, this.context, schema, toJS(query));
    } else {
      const unknownType = typeName?typeName:"<undefined>";
      const unknownSchema = {
        id: unknownType,
        label: unknownType,
        canBe: typeName?[typeName]:[]
      };
      this.rootField = buildFieldTreeFromQuery(this.rootStore.typeStore.types, this.context, unknownSchema, toJS(query));
      this.rootField.isUnknown = true;
    }
    this.selectField(this.rootField);
  }

  async executeQuery() {
    if (!this.isQueryEmpty && !this.isRunning) {
      this.isRunning = true;
      this.runError = undefined;
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
          this.result = response.data;
          this.isRunning = false;
        });
      } catch (e) {
        const error = e as AxiosError;
        runInAction(() => {
          const message = error?.message;
          this.result = null;
          this.runError = `Error while executing query (${message})`;
          this.isRunning = false;
        });
      }
    }
  }

  setResultSize(size: number) {
    this.resultSize = size;
  }

  setResultStart(start: number) {
    this.resultStart = start;
  }

  setResultInstanceId(instanceId: string) {
    this.resultInstanceId = instanceId;
  }

  setResultQueryParameter(name: string, value: string) {
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

  setRunError(error?:string) {
    this.runError = error;
  }

  get saveLabel() {
    if (!this.label) {
      return this.label;
    }
    if(this.label && this.label.endsWith("-Copy")) {
      return this.label;
    }
    return this.label + "-Copy";
  }

  setSaveAsMode(mode: boolean) {
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
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
    }

  }

  toggleCompareChanges() {
    this.compareChanges = !this.compareChanges;
  }

  setLabel(label: string) {
    this.label = label;
  }

  setSpace(space: Space) {
    this.space = toJS(space);
  }

  setDescription(description: string) {
    this.description = description;
  }

  async saveQuery(navigate: React., mode) {
    if (!this.isQueryEmpty && !this.isSaving && !(this.sourceQuery && this.sourceQuery.isDeleting)) {
      this.isSaving = true;
      this.saveError = null;
      if (this.sourceQuery && this.sourceQuery.deleteError) {
        this.sourceQuery.deleteError = null;
      }
      const queryId = this.saveAsMode ? this.queryId : this.sourceQuery.id;
      const query = this.JSONQuery;
      if (!this.space) {
        this.space = toJS(this.rootStore.authStore.privateSpace);
      }
      const spaceName = this.space?this.space.name:"myspace";
      try {
        await this.transportLayer.saveQuery(queryId, query, spaceName);
        runInAction(() => {
          if (this.saveAsMode) {
            this.sourceQuery = {
              id: queryId,
              user: {
                id: this.rootStore.authStore.user.id,
                name: this.rootStore.authStore.user.displayName,
                picture: this.rootStore.authStore.user.picture
              },
              context: query["@context"],
              structure: query.structure,
              properties: getProperties(query),
              meta: query.meta,
              label: query.meta && query.meta.name?query.meta.name:"",
              description: query.meta && query.meta.description?query.meta.description:"",
              space: spaceName,
              isDeleting: false,
              deleteError: null
            };
            this.specifications.push(this.sourceQuery);
            this.saveAsMode = false;
            this.isSaving = false;
            this.fromQueryId = undefined;
            this.fromLabel = "";
            this.fromDescription = "";
            this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
            const path = mode?`/queries/${queryId}/${mode}`:`/queries/${queryId}`;
            navigate(path);
          } else {
            if (this.sourceQuery) {
              this.sourceQuery.label = query.meta && query.meta.name?query.meta.name:"";
              this.sourceQuery.description = query.meta && query.meta.description?query.meta.description:"";
              this.sourceQuery.context = query["@context"];
              this.sourceQuery.structure = query.structure;
              this.sourceQuery.meta = query.meta;
              this.sourceQuery.properties = getProperties(query);
            } else {
              this.sourceQuery = this.findQuery(queryId);
              this.sourceQuery.label = query.meta && query.meta.name?query.meta.name:"";
              this.sourceQuery.description = query.meta && query.meta.description?query.meta.description:"";
              this.sourceQuery.specification = query;
              this.sourceQuery.meta = query.meta;
            }
            this.saveAsMode = false;
            this.isSaving = false;
            this.fromQueryId = undefined;
            this.fromLabel = "";
            this.fromDescription = "";
            this.fromSpace = toJS(this.rootStore.authStore.privateSpace);
          }
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        runInAction(() => {
          this.saveError = `Error while saving query "${queryId}" (${message})`;
          this.isSaving = false;
        });
      }
    }
  }

  cancelSaveQuery() {
    if (!this.isSaving) {
      this.saveError = null;
    }
  }

  async deleteQuery(query, navigate) {
    if (query && !query.isDeleting && !(query === this.sourceQuery && this.isSaving)) {
      query.isDeleting = true;
      query.deleteError = null;
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
          if (navigate) {
            this.clearQueries();
            this.clearQuery();
            navigate("/");
          }
        });
      } catch (e) {
        const error = e as AxiosError;
        const message = error?.message;
        runInAction(() => {
          query.deleteError = `Error while deleting query "${query.id}" (${message})`;
          query.isDeleting = false;
        });
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
      this.queriesFilterValue = "";
      this.isQueriesFetched = false;
      this.fetchQueriesError = undefined;
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
            this.isQueriesFetched = true;
            this.isFetchingQueries = false;
          });
        } catch (e) {
          const error = e as AxiosError;
          runInAction(() => {
            this.specifications = [];
            const message = error?.message;
            this.fetchQueriesError = `Error while fetching saved queries for "${this.rootField.id}" (${message})`;
            this.isQueriesFetched = true;
            this.isFetchingQueries = false;
          });
        }
      }
    }
  }

  clearQueries() {
    this.isQueriesFetched = false;
    this.fetchQueriesError = undefined;
    this.specifications = [];
    this.queriesFilterValue = "";
  }

  async fetchQuery(queryId: string) { 
    if (this.findQuery(queryId) || this.isFetchingQuery) {
      return;
    }
    this.isFetchingQuery = true;
    this.fetchQueryError = undefined;
    try {
      const response = await this.transportLayer.getQuery(queryId);
      const jsonSpecification = response && response.data ? response.data : null;
      try{
        const query = await this.normalizeQuery(jsonSpecification);
        runInAction(() => this.specifications.push(query));
      } catch (e) {
        runInAction(() => this.fetchQueryError = `Error while trying to expand/compact JSON-LD (${e})`);
      }
      runInAction(() => this.isFetchingQuery = false);
    } catch (e) {
      const error = e as AxiosError;
      runInAction(() => {
        const { response } = error;
        const status = response?.status;
        const message = error?.message;
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
          if (this.hasRootSchema) { // it's a new query created from ui
            this.setAsNewQuery(queryId);
          } else {
            this.fetchQueryError = `Query id "${queryId}" does not exist`;
          }
          break;
        }
        default: {
          this.fetchQueryError = `Error while fetching query with id "${queryId}" (${message})`;
        }
        }
      });
    }
  }

  async normalizeQuery(jsonSpec: JSONQuerySpecification): QuerySpecification {
    let queryId = jsonSpec["@id"];
    jsonSpec["@context"] = toJS(defaultContext);
    const expanded = await jsonld.expand(jsonSpec);
    const compacted = await jsonld.compact(expanded, jsonSpec["@context"]);
    return {
      id: queryId,
      user: normalizeUser(jsonSpec["https://core.kg.ebrains.eu/vocab/meta/user"]),
      context: compacted["@context"],
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

  findQuery(id: string) {
    return this.specifications.find(spec => spec.id === id);
  }
}

export default QueryBuilderStore;