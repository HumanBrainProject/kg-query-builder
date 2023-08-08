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

import {
  observable,
  action,
  computed,
  toJS,
  makeObservable
} from "mobx";
import isEqual from "lodash/isEqual";
import remove from "lodash/remove";
import { v4 as uuidv4 } from "uuid";
import * as Diff from "diff";

import { buildFieldTreeFromQuery } from "./QueryBuilderStore/QueryToFieldTree";
import { buildQueryStructureFromFieldTree } from "./QueryBuilderStore/FieldTreeToQuery";
import RootStore from "./RootStore";
import Field from "./Field";
import { DEFAULT_RESPONSE_VOCAB, defaultContext, getProperties } from "../Helpers/QueryHelpers";
import { QuerySpecification } from "../Types/QuerySpecification";
import { Query } from "../Types/Query";
import { Space, Type, Property, PropertyGroup } from "../types";

interface Counter {
  [index: string]: {
    property: Property;
    count: number;
  };
}

const isChildOfField = (
  node: Field,
  parent: Field | undefined,
  root: Field
): boolean => {
  let field: Field|undefined = node;
  while (field && field !== parent && field !== root) {
    field = field.parent;
  }
  return field === parent;
};

class QueryBuilderStore {
  meta?: QuerySpecification.Meta;
  defaultResponseVocab = DEFAULT_RESPONSE_VOCAB;
  responseVocab?: string = DEFAULT_RESPONSE_VOCAB;
  type?: Type;
  queryId?: string;
  label = "";
  space?: Space;
  description = "";
  sourceQuery?: Query.Query;
  context?: QuerySpecification.Context;
  rootField?: Field;
  savedQueryHasInconsistencies = false;
  saveAsMode = false;
  childrenFilterValue = "";
  fromQueryId?: string;
  fromLabel = "";
  fromDescription = "";
  fromSpace?: Space;
  includeAdvancedAttributes = false;

  currentField?: Field;

  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      type: observable,
      queryId: observable,
      label: observable,
      space: observable,
      description: observable,
      sourceQuery: observable,
      context: observable,
      meta: observable,
      defaultResponseVocab: observable,
      responseVocab: observable,
      rootField: observable,
      savedQueryHasInconsistencies: observable,
      saveAsMode: observable,
      currentField: observable,
      currentFieldLookups: computed,
      currentFieldFilteredPropertiesGroups: computed,
      currentFieldFilteredCommonProperties: computed,
      currentFieldLookupsAttributes: computed,
      currentFieldLookupsLinks: computed,
      currentFieldLookupsCommonAttributes: computed,
      currentFieldLookupsCommonLinks: computed,
      setType: action,
      clearType: action,
      clearQuery: action,
      setAsNewQuery: action,
      typeId: computed,
      hasType: computed,
      isKnownType: computed,
      isQuerySaved: computed,
      canSaveQuery: computed,
      canDeleteQuery: computed,
      isQueryEmpty: computed,
      hasQueryChanged: computed,
      hasChanged: computed,
      childrenFilterValue: observable,
      setChildrenFilterValue: action,
      addField: action,
      removeField: action,
      setResponseVocab: action,
      selectField: action,
      queryParametersNames: computed,
      querySpecificationStructure: computed,
      querySpecificationMeta: computed,
      querySpecification: computed,
      sourceQuerySpecification: computed,
      querySpecificationDiff: computed,
      selectQuery: action,
      cancelChanges: action,
      setSaveAsMode: action,
      setLabel: action,
      setSpace: action,
      setQuerySaved: action,
      setSourceQuery: action,
      updateSourceQuery: action,
      setDescription: action,
      fromQueryId: observable,
      fromLabel: observable,
      fromDescription: observable,
      fromSpace: observable,
      includeAdvancedAttributes: observable,
      toggleIncludeAdvancedAttributes: action,
      saveLabel: computed,
      resetQuery: action
    });

    this.rootStore = rootStore;
  }

  setSourceQuery(query: Query.Query | undefined) {
    this.sourceQuery = query
  }

  updateSourceQuery(querySpecification: QuerySpecification.QuerySpecification) {
    if (this.sourceQuery) {
      this.sourceQuery.label = (querySpecification.meta?.name)?querySpecification.meta.name:"";
      this.sourceQuery.description = (querySpecification.meta?.description)?querySpecification.meta.description:"";
      if (querySpecification["@context"]) {
        this.sourceQuery.context = querySpecification["@context"];
      }
      if (querySpecification.structure) {
        this.sourceQuery.structure = querySpecification.structure;
      }
      this.sourceQuery.meta = querySpecification.meta;
      this.sourceQuery.properties = getProperties(querySpecification);
    }
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

  setChildrenFilterValue(value: string) {
    this.childrenFilterValue = value;
  }

  get currentFieldFilteredPropertiesGroups(): Type[] {
    const field = this.currentField;
    const lookups =
      field && field.typeFilterEnabled
        ? this.currentFieldLookups.filter(type =>
            field.typeFilter.includes(type)
          )
        : this.currentFieldLookups;

    if (!lookups.length) {
      return [];
    }

    const filter =
      this.childrenFilterValue && this.childrenFilterValue.toLowerCase();

    return lookups.reduce((acc, id) => {
      const reg = /^https?:\/\/.+\/(.+)$/; //NOSONAR
      const type = this.rootStore.typeStore.types.get(id);
      if (type) {
        const properties = type.properties.filter(
          prop =>
            (this.includeAdvancedAttributes ||
              !prop.attribute.startsWith(
                "https://core.kg.ebrains.eu/vocab/meta"
              )) &&
            (!filter ||
              (prop.label && prop.label.toLowerCase().includes(filter)) ||
              (Array.isArray(prop.canBe) &&
                prop.canBe.some(t => {
                  const m = t.match(reg);
                  if (!m) {
                    return false;
                  }
                  return m[1].toLowerCase().includes(filter);
                })))
        );
        if (properties.length) {
          acc.push({
            id: type.id,
            label: type.label,
            color: type.color,
            properties: properties
          } as Type);
        }
      }
      return acc;
    }, [] as Type[]);
  }

  get currentFieldFilteredCommonProperties(): Property[] {
    const counters = {} as Counter;

    const addPropToNewCounter = (key: string, prop: Property) => {
      if (Array.isArray(prop.canBe)) {
        counters[key] = {
          property: { ...prop, canBe: [...prop.canBe].sort() },
          count: 1
        };
      } else {
        counters[key] = {
          property: prop,
          count: 1
        };
      }
    };

    const addPropToCounter = (key: string, prop: Property) => {
      const property = counters[key].property;
      if (Array.isArray(prop.canBe)) {
        if (Array.isArray(property.canBe)) {
          const toAdd = prop.canBe.filter(p => !property.canBe?.includes(p));
          property.canBe = [...property.canBe, ...toAdd].sort();
        } else {
          property.canBe = [...prop.canBe].sort();
        }
      }
      counters[key].count += 1;
    };

    const addPropToCounters = (prop: Property) => {
      const key = `${prop.attribute}${prop.reverse ? ":is-reverse" : ""}`;
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
      .filter(({ count }) => count > 1 || groups.length === 1)
      .map(({ property }) => property)
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  isACurrentFieldFilteredCommonProperty(property: Property) {
    return this.currentFieldFilteredCommonProperties.some(
      prop =>
        prop.simpleAttributeName === property.simpleAttributeName &&
        prop.reverse === property.reverse
    );
  }

  get currentFieldLookupsAttributes() {
    const groups = this.currentFieldFilteredPropertiesGroups;

    if (!groups.length) {
      return [];
    }

    return groups.reduce((acc, group) => {
      const properties = group.properties.filter(
        prop =>
          (!prop.canBe?.length) &&
          !this.isACurrentFieldFilteredCommonProperty(prop)
      );
      if (properties.length) {
        acc.push({ ...group, properties: properties });
      }
      return acc;
    }, [] as PropertyGroup[]);
  }

  get currentFieldLookupsLinks() {
    const groups: Type[] = this.currentFieldFilteredPropertiesGroups;

    if (!groups.length) {
      return [];
    }

    return groups.reduce((acc, group) => {
      const properties = group.properties.filter(
        prop =>
          prop.canBe &&
          !!prop.canBe.length &&
          !this.isACurrentFieldFilteredCommonProperty(prop)
      );
      if (properties.length) {
        acc.push({ ...group, properties: properties });
      }
      return acc;
    }, [] as PropertyGroup[]);
  }

  get currentFieldLookupsCommonAttributes() {
    return this.currentFieldFilteredCommonProperties.filter(
      prop => !prop.canBe?.length
    );
  }

  get currentFieldLookupsCommonLinks() {
    return this.currentFieldFilteredCommonProperties.filter(
      prop => prop.canBe && !!prop.canBe.length
    );
  }

  setType(type: Type) {
    this.type = type;
    this.queryId = undefined;
    this.label = "";
    this.description = "";
    this.context = defaultContext();
    this.meta = undefined;
    this.defaultResponseVocab = DEFAULT_RESPONSE_VOCAB;
    this.responseVocab = DEFAULT_RESPONSE_VOCAB;
    this.sourceQuery = undefined;
    this.savedQueryHasInconsistencies = false;
    this.rootField = new Field({
      label: type.label,
      canBe: [type.id]
    } as QuerySpecification.Schema);
    this.rootField.isInvalidLeaf = true;
    this.saveAsMode = false;
    this.childrenFilterValue = "";
    this.fromQueryId = undefined;
    this.fromLabel = "";
    this.fromDescription = "";
    this.fromSpace = toJS(this.rootStore.spacesStore.privateSpace);
    this.space = toJS(this.rootStore.spacesStore.privateSpace);
    this.selectField(this.rootField);
  }

  clearType() {
    this.rootField = undefined;
    this.clearQuery();
  }

  resetQuery() {
    const queryId = this.queryId;
    this.clearQuery();
    this.queryId = queryId;
  }

  clearQuery() {
    const rootField = this.rootField;
    if (rootField) {
      this.rootField = new Field(toJS(rootField.schema));
      this.selectField(this.rootField);
      this.rootField.isInvalidLeaf = true;
    }
    this.queryId = undefined;
    this.label = "";
    this.description = "";
    this.context = defaultContext();
    this.meta = undefined;
    this.defaultResponseVocab = DEFAULT_RESPONSE_VOCAB;
    this.responseVocab = DEFAULT_RESPONSE_VOCAB;
    this.sourceQuery = undefined;
    this.savedQueryHasInconsistencies = false;
    this.saveAsMode = false;
    this.childrenFilterValue = "";
    this.fromQueryId = undefined;
    this.fromLabel = "";
    this.fromDescription = "";
    this.fromSpace = toJS(this.rootStore.spacesStore.privateSpace);
    this.space = toJS(this.rootStore.spacesStore.privateSpace);
  }

  setAsNewQuery(queryId: string) {
    this.queryId = queryId;
    this.label = "";
    this.description = "";
    this.sourceQuery = undefined;
    this.savedQueryHasInconsistencies = false;
    this.saveAsMode = false;
    this.childrenFilterValue = "";
    this.fromQueryId = undefined;
    this.fromLabel = "";
    this.fromDescription = "";
    this.fromSpace = toJS(this.rootStore.spacesStore.privateSpace);
    this.space = toJS(this.rootStore.spacesStore.privateSpace);
    if (this.rootField) {
      this.selectField(this.rootField);
    }
  }

  get typeId() {
    return this.type?.id;
  }

  get hasType(): boolean {
    return !!this.type;
  }

  get isKnownType(): boolean {
    if (!this.hasType) {
      return false;
    }
    const type = this.typeId && this.rootStore.typeStore.types.get(this.typeId);
    return !!type;
  }

  get isQuerySaved(): boolean {
    return this.sourceQuery !== undefined;
  }

  get canSaveQuery(): boolean {
    return !!this.space?.permissions?.canWrite;
  }

  get canDeleteQuery(): boolean {
    return !!this.space?.permissions?.canDelete;
  }

  get isQueryEmpty(): boolean {
    return (
      !this.rootField?.structure?.length
    );
  }

  get hasQueryChanged(): boolean {
    return !isEqual(this.querySpecification, this.sourceQuerySpecification);
  }

  get hasChanged(): boolean {
    return (
      (!this.isQueryEmpty &&
        (this.sourceQuery === undefined ||
          (this.saveAsMode && this.queryId !== this.sourceQuery.id) ||
          this.hasQueryChanged)) ||
      (this.isQueryEmpty && !!this.sourceQuery)
    );
  }

  addField(
    schema: QuerySpecification.Schema,
    parent: Field,
    gotoField = true
  ) {
    if (this.context) {
      if (!this.context["@vocab"]) {
        this.context["@vocab"] = defaultContext()["@vocab"];
      }
      if (!this.context.query) {
        this.context.query = this.responseVocab;
      }
      if (!this.context.propertyName) {
        this.context.propertyName = defaultContext().propertyName;
      }
      if (!this.context.path) {
        this.context.path = defaultContext().path;
      }
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

  moveUpField(field: Field) {
    const fieldIndex = field.parent
      ? field.parent.structure.findIndex(f => f === field)
      : -1;
    if (fieldIndex >= 1) {
      if (field.parent) {
        field.parent.structure.splice(fieldIndex, 1);
        field.parent.structure.splice(fieldIndex - 1, 0, field);
      }
    }
  }

  moveDownField(field: Field) {
    const fieldIndex = field.parent
      ? field.parent.structure.findIndex(f => f === field)
      : -1;
    if (field.parent) {
      if (
        fieldIndex === -1
          ? false
          : fieldIndex < field.parent.structure.length - 1
      ) {
        field.parent.structure.splice(fieldIndex, 1);
        field.parent.structure.splice(fieldIndex + 1, 0, field);
      }
    }
  }

  removeField(field: Field) {
    const currentField = this.currentField;
    const parentField = field.parent;
    this.childrenFilterValue = "";
    if (this.currentField && parentField && this.rootField) {
      if (isChildOfField(this.currentField, field, this.rootField)) {
        this.selectField(parentField);
      }
    }
    if (field.parent) {
      remove(
        field.parent.structure,
        (childField: Field) => field === childField
      );
      if (!field.parent.structure.length) {
        field.parent.isInvalidLeaf = true;
        field.parent.isFlattened = false;
      }
    }
    if (field === currentField && parentField) {
      this.selectField(parentField);
    }
  }

  setResponseVocab(vocab: string | undefined) {
    this.responseVocab = vocab;
    if (this.context) {
      if (vocab) {
        this.context.query = vocab;
      } else {
        this.context.query = this.defaultResponseVocab;
      }
    }
  }

  selectField(field: Field) {
    this.currentField = field;
    this.childrenFilterValue = "";
    this.rootStore.typeStore.addTypesToFetch(this.currentField.lookups);
  }

  getParametersFromField(field: Field) {
    const parameters = [];
    if (field.optionsMap?.has("filter")) {
      const filter = field.optionsMap.get("filter") as QuerySpecification.FilterItem;
      if (filter?.parameter && typeof filter.parameter === "string") {
        const parameter = filter.parameter.trim();
        if (parameter) {
          parameters.push(parameter);
        }
      }
    }
    if (Array.isArray(field.structure) && field.structure.length) {
      field.structure.forEach(f => {
        parameters.push(...this.getParametersFromField(f));
      });
    }
    return parameters;
  }

  get queryParametersNames() {
    if (this.rootField) {
      return Array.from(
        new Set(
          this.getParametersFromField(this.rootField)
            .filter(p => !["scope", "size", "start", "instanceId"].includes(p))
            .sort()
        )
      );
    }
    return [];
  }

  get querySpecificationStructure() {
    if (this.rootField) {
      return buildQueryStructureFromFieldTree(this.rootField);
    }
    return undefined;
  }

  get querySpecificationMeta() {
    //TODO: trootField and schema should always be available after we split QueryBuilderStore
    const meta: QuerySpecification.Meta =
      this.rootField?.schema
        ? {
            ...this.meta,
            type: this.typeId
          }
        : { ...this.meta };
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

  get querySpecification(): QuerySpecification.QuerySpecification {
    const query: QuerySpecification.QuerySpecification = {
      "@context": toJS(this.context),
      meta: this.querySpecificationMeta
    };
    if (this.querySpecificationStructure) {
      query.structure = this.querySpecificationStructure;
    }
    return query;
  }

  get sourceQuerySpecification() {
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

  get querySpecificationDiff() {
    if(this.sourceQuerySpecification) {
      return Diff.diffJson(this.sourceQuerySpecification, this.querySpecification);
    }
    return undefined;
  }

  selectQuery(query: Query.Query) {
    if (this.typeId) {
      this.queryId = query.id;
      this.space = query.space
        ? toJS(this.rootStore.spacesStore.getSpace(query.space))
        : undefined;
      this.sourceQuery = query;
      this.updateQuery(query);
      this.saveAsMode = false;
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = query.space
        ? toJS(this.rootStore.spacesStore.getSpace(query.space))
        : undefined;
      this.savedQueryHasInconsistencies = this.hasQueryChanged;
    }
  }

  updateQuery(query: Query.Query) {
    this.context = toJS(query.context);
    if (!this.context) {
      this.context = defaultContext();
    }
    if (this.context && !this.context?.query) {
      this.context.query = defaultContext().query;
    }
    this.meta = toJS(query.meta);
    if (this.meta) {
      this.label = this.meta.name ? this.meta.name : "";
      this.description = this.meta.description ? this.meta.description : "";
      if (this.meta.responseVocab) {
        this.defaultResponseVocab = this.meta.responseVocab;
      } else if (this.context?.query) {
        this.defaultResponseVocab = this.context?.query;
      } else {
        this.defaultResponseVocab = DEFAULT_RESPONSE_VOCAB
      }
      if (this.meta.responseVocab) {
        this.responseVocab = this.meta.responseVocab;
      }
    } else {
      if (this.context?.query) {
        this.defaultResponseVocab = this.context?.query;
      } else {
        this.defaultResponseVocab = DEFAULT_RESPONSE_VOCAB
      }
      this.responseVocab = this.context?.query;
    }
    const typeName = query?.meta?.type;
    const type = typeName && this.rootStore.typeStore.types.get(typeName);
    if (type) {
      this.rootField = buildFieldTreeFromQuery(
        this.rootStore.typeStore.types,
        this.context,
        type,
        toJS(query)
      );
    } else {
      const typeId = typeName??"<undefined>";
      const unknownType = {
        id: typeId,
        label: typeId,
        color: "black",
        description: "",
        properties: []
      } as Type;
      this.rootField = buildFieldTreeFromQuery(
        this.rootStore.typeStore.types,
        this.context,
        unknownType,
        toJS(query)
      );
      if (this.rootField) {
        this.rootField.isUnknown = true;
      }
    }
    if (this.rootField) {
      this.selectField(this.rootField);
    }
  }

  cancelChanges() {
    if (this.sourceQuery) {
      this.selectQuery(this.sourceQuery);
      this.fromQueryId = this.queryId;
      this.fromLabel = this.label;
      this.fromDescription = this.description;
      this.fromSpace = toJS(this.space);
    } else {
      if (this.rootField) {
        this.rootField.structure = [];
      }
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.spacesStore.privateSpace);
    }
  }

  get saveLabel() {
    if (!this.label) {
      return this.label;
    }
    if (this.label?.endsWith("-Copy")) {
      return this.label;
    }
    return this.label + "-Copy";
  }

  setQuerySaved() {
    this.saveAsMode = false;
    this.fromQueryId = undefined;
    this.fromLabel = "";
    this.fromDescription = "";
    this.fromSpace = toJS(this.space);
  }

  setSaveAsMode(mode: boolean) {
    this.saveAsMode = mode;
    if (mode) {
      this.fromQueryId = this.queryId;
      this.fromLabel = this.label;
      this.fromDescription = this.description;
      this.fromSpace = toJS(this.space);
      this.queryId = uuidv4();
      this.label = this.saveLabel;
      this.space =
        this.space?.permissions?.canCreate
          ? toJS(this.space)
          : toJS(this.rootStore.spacesStore.privateSpace);
    } else {
      this.queryId = this.fromQueryId;
      this.label = this.fromLabel;
      this.description = this.fromDescription;
      this.space = toJS(this.fromSpace);
      this.fromQueryId = undefined;
      this.fromLabel = "";
      this.fromDescription = "";
      this.fromSpace = toJS(this.rootStore.spacesStore.privateSpace);
    }
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

}

export default QueryBuilderStore;