import { observable, action, computed, runInAction, toJS } from "mobx";
import { uniqueId, isEqual } from "lodash";
import API from "../Services/API";
import { remove } from "lodash";
import _  from "lodash-uuid";
import jsonld from "jsonld";
import Field from "./Field";

import authStore from "./AuthStore";
import typesStore from "./TypesStore";

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

const rootFieldReservedProperties = ["root_schema", "schema:root_schema", "http://schema.org/root_schema", "identifier", "schema:identifier", "http://schema.org/identifier", "@id", "@type", "https://core.kg.ebrains.eu/vocab/meta/revision", "https://core.kg.ebrains.eu/vocab/meta/space", "https://core.kg.ebrains.eu/vocab/meta/user", "@context", "structure", "merge", "label", "description"];
const fieldReservedProperties = ["propertyName", "path", "merge", "structure"];

const namespaceReg = /^(.+):(.+)$/;
const attributeReg = /^https?:\/\/.+\/(.+)$/;
const modelReg = /^\/?((.+)\/(.+)\/(.+)\/(.+))$/;

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

class QueryBuilderStore {
  @observable queryId = "";
  @observable label = "";
  @observable description = "";
  @observable stage = "RELEASED";
  @observable sourceQuery = null;
  @observable context = null;
  @observable rootField = null;
  @observable fetchQueriesError = null;
  @observable isFetchingQueries = false;
  @observable isSaving = false;
  @observable saveError = null;
  @observable isRunning = false;
  @observable runError = null;
  @observable saveAsMode = false;
  @observable showHeader = true;
  @observable showQueries = false;
  @observable showMyQueries = true;
  @observable showOthersQueries = true;
  @observable saveAsMode = false;
  @observable compareChanges = false;

  @observable specifications = [];

  @observable runStripVocab = true;
  @observable resultSize = 20;
  @observable resultStart = 0;
  @observable.shallow result = null;
  @observable tableViewRoot = ["data"];

  @observable currentTab = "query";
  @observable currentField = null;

  getLookupsAttributes(lookups, advanced=false) {
    if (!lookups || !lookups.length) {
      return [];
    }
    return lookups.reduce((acc, id) => {
      const type = typesStore.types[id];
      if (type) {
        const properties = type.properties.filter(prop => (!prop.canBe || !prop.canBe.length) && ((advanced && prop.attribute.startsWith("https://core.kg.ebrains.eu/vocab/meta")) || (!advanced && !prop.attribute.startsWith("https://core.kg.ebrains.eu/vocab/meta"))));
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

  getLookupsLinks(lookups) {
    if (!lookups || !lookups.length) {
      return [];
    }
    return lookups.reduce((acc, id) => {
      const type = typesStore.types[id];
      if (type) {
        const properties = type.properties.filter(prop => prop.canBe && !!prop.canBe.length);
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

  @action
  setQueryId = () => this.queryId = _.uuid();

  @computed
  get currentFieldLookups() {
    return this.currentField?this.currentField.lookups:[];
  }

  @computed
  get currentFieldLookupsAttributes() {
    return this.getLookupsAttributes(this.currentFieldLookups, false);
  }

  @computed
  get currentFieldLookupsAdvancedAttributes() {
    return this.getLookupsAttributes(this.currentFieldLookups, true);
  }

  @computed
  get currentFieldLookupsLinks() {
    return this.getLookupsLinks(this.currentFieldLookups);
  }

  @computed
  get currentFieldParentLookups() {
    if (!this.currentField || !this.currentField.parent) {
      return [];
    }
    return this.currentField.parent.lookups;
  }

  @computed
  get currentFieldParentLookupsAttributes() {
    return this.getLookupsAttributes(this.currentFieldParentLookups, false);
  }

  @computed
  get currentFieldParentLookupsLinks() {
    return this.getLookupsLinks(this.currentFieldParentLookups);
  }

  @action
  selectRootSchema(schema) {
    if (!this.isSaving) {
      this.queryId = "";
      this.label = "";
      this.description = "";
      this.context = toJS(defaultContext);
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
      this.showHeader = true;
      this.showQueries = false;
      this.showMyQueries = true;
      this.showOthersQueries = true;
      this.result = null;
      this.selectField(this.rootField);
      this.fetchQueries();
    }
  }

  @action
  resetRootSchema() {
    if (!this.isSaving) {
      this.queryId = "";
      this.label = "";
      this.description = "";
      this.context = toJS(defaultContext);
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.rootField = new Field(this.rootField.schema);
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.showHeader = true;
      this.showQueries = false;
      this.showMyQueries = true;
      this.showOthersQueries = true;
      this.result = null;
      this.selectField(this.rootField);
    }
  }

  @action
  setAsNewQuery() {
    if (!this.isSaving) {
      this.queryId = "";
      this.label = "";
      this.description = "";
      this.sourceQuery = null;
      this.savedQueryHasInconsistencies = false;
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.showHeader = true;
      this.saveAsMode = false;
      this.showQueries = false;
      this.showMyQueries = true;
      this.showOthersQueries = true;
    }
  }

  @computed
  get hasRootSchema() {
    return !!this.rootField && !!this.rootField.schema;
  }

  @computed
  get rootSchema() {
    return this.rootField && this.rootField.schema;
  }

  @computed
  get isQuerySaved() {
    return this.sourceQuery !== null;
  }

  @computed
  get isOneOfMySavedQueries() {
    return this.sourceQuery !== null && this.sourceQuery.user.id === authStore.user.id;
  }

  @computed
  get isQueryEmpty() {
    return !this.rootField || !this.rootField.structure || !this.rootField.structure.length;
  }


  @computed
  get hasQueryChanged() {
    return !isEqual(this.JSONQuery, this.JSONSourceQuery);
  }

  @computed
  get hasChanged() {
    return (!this.isQueryEmpty && (this.sourceQuery === null
      || (this.saveAsMode && this.queryId !== this.sourceQuery.id)
      || this.hasQueryChanged))
      || (this.isQueryEmpty && this.sourceQuery);
  }

  @computed
  get hasQueries() {
    return this.specifications.length > 0;
  }

  @computed
  get hasMyQueries() {
    return this.myQueries.length > 0;
  }

  @computed
  get hasOthersQueries() {
    return this.othersQueries.length > 0;
  }

  @computed
  get myQueries() {
    if (authStore.user) {
      return this.specifications.filter(spec => spec.user && (spec.user.id === authStore.user.id)).sort((a, b) => a.label - b.label);
    }
    return [];
  }

  @computed
  get othersQueries() {
    if (authStore.user) {
      return this.specifications.filter(spec =>  !spec.user || (spec.user.id !== authStore.user.id)).sort((a, b) => a.label - b.label);
    }
    return this.specifications.sort((a, b) => a.label - b.label);
  }

  @action
  addField(schema, parent, gotoField = true) {
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

  @action
  addMergeField(parent, gotoField = true) {
    if (parent === undefined) {
      parent = this.showModalFieldChoice || this.rootField;
      this.showModalFieldChoice = null;
    }
    if (!parent.isRootMerge && parent !== this.rootFields) {
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
          const type = typesStore.types[id];
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

  @action
  addMergeChildField(schema, parent, gotoField = true) {
    if (parent === undefined) {
      parent = this.showModalFieldChoice || this.rootField;
      this.showModalFieldChoice = null;
    }
    if (parent.isRootMerge) {
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

  @action
  removeField(field) {
    if (field === this.rootField) {
      this.rootField = null;
      this.queryId = "";
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
      this.closeFieldOptions();
    } else {
      if (field === this.currentField) {
        this.closeFieldOptions();
      }
      if (field.isMerge && field.parentIsRootMerge) {
        remove(field.parent.merge, parentField => field === parentField);
        field.parent.isInvalid = (field.parent.merge.length < 2);
        this.checkMergeFields(field.parent);
      } else {
        remove(field.parent.structure, parentField => field === parentField);
        const rootMerge = field.rootMerge;
        if (rootMerge) {
          this.checkMergeFields(rootMerge);
        }
      }
    }
  }

  @action toggleRunStripVocab(state) {
    this.runStripVocab = state !== undefined ? !!state : !this.runStripVocab;
  }

  @action selectTab(tab) {
    this.currentTab = tab;
  }

  @action selectField(field) {
    this.currentField = field;
    this.currentTab = "fieldOptions";
    typesStore.addTypesToTetch(this.currentField.lookups);
  }

  @action closeFieldOptions() {
    this.currentField = null;
    this.currentTab = "query";
  }

  @computed
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

  @computed
  get JSONQueryProperties() {
    const json = {};
    this.rootField.options.forEach(({ name, value }) => {
      const cleanValue = toJS(value);
      if (cleanValue !== undefined) {
        json[name] = cleanValue;
      }
    });
    const label = this.label ? this.label.trim() : "";
    const description = this.description ? this.description.trim() : "";
    if (label) {
      json["label"] = label;
    }
    if (description) {
      json["description"] = description;
    }
    return json;
  }

  @computed
  get JSONMetaProperties() {
    return {
      name: this.rootField.schema.label,
      alias: this.rootField.alias,
      type: this.rootField.schema.id
    };
  }

  @computed
  get JSONQuery() {
    return Object.assign({}, { "@context": toJS(this.context) }, {"meta": this.JSONMetaProperties }, this.JSONQueryProperties, this.JSONQueryFields ? { structure: this.JSONQueryFields } : {});
  }

  @computed
  get JSONSourceQuery() {
    if (!this.sourceQuery) {
      return null;
    }
    const json = toJS(this.sourceQuery.properties);
    if (this.sourceQuery.label) {
      json["label"] = this.sourceQuery.label;
    }
    if (this.sourceQuery.description) {
      json["description"] = this.sourceQuery.description;
    }
    json["@context"] = toJS(this.sourceQuery.context);
    if (this.sourceQuery.structure) {
      json.structure = toJS(this.sourceQuery.structure);
    }
    return json;
  }

  _processMergeFields(json, merge) {
    const jsonMerge = [];
    merge && !!merge.length && merge.forEach(field => {
      let jsonMergeFields = [];
      let mergeField = field;
      while (mergeField) {
        if (mergeField.schema.attribute) {
          const attribute = (!attributeReg.test(mergeField.schema.attribute) && modelReg.test(mergeField.schema.attribute)) ? mergeField.schema.attribute.match(modelReg)[1] : mergeField.schema.attribute;
          const relativePath = mergeField.schema.attributeNamespace && (mergeField.schema.simpleAttributeName || mergeField.schema.simplePropertyName) ? (mergeField.schema.attributeNamespace + ":" + (mergeField.schema.simpleAttributeName || mergeField.schema.simplePropertyName)) : attribute;
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
      jsonField.propertyName = {"@id": (field.namespace ? field.namespace : "query") + ":" + ((field.alias && field.alias.trim()) || field.schema.simpleAttributeName || field.schema.simplePropertyName || field.schema.label || uniqueId("field"))};
      if (field.schema.attribute) {
        const attribute = (!attributeReg.test(field.schema.attribute) && modelReg.test(field.schema.attribute)) ? field.schema.attribute.match(modelReg)[1] : field.schema.attribute;
        const relativePath = field.schema.attributeNamespace && (field.schema.simpleAttributeName || field.schema.simplePropertyName) ? (field.schema.attributeNamespace + ":" + (field.schema.simpleAttributeName || field.schema.simplePropertyName)) : attribute;
        if (field.schema.reverse) {
          jsonField.path = {
            "@id": relativePath,
            "reverse": true
          };
        } else {
          jsonField.path = relativePath;
        }
      }
      field.options.forEach(({ name, value }) => jsonField[name] = toJS(value));
      if (field.merge) {
        this._processMergeFields(jsonField, field.merge);
      }
      if (field.isFlattened) {
        const topField = field;
        jsonField.path = [jsonField.path];
        while (field.isFlattened && field.structure[0]) {
          field = field.structure[0];
          const relativePath = field.schema.attributeNamespace && (field.schema.simpleAttributeName || field.schema.simplePropertyName) ? (field.schema.attributeNamespace + ":" + (field.schema.simpleAttributeName || field.schema.simplePropertyName)) : field.schema.attribute;
          if (field.schema.reverse) {
            jsonField.path.push(
              {
                "@id": relativePath,
                "reverse": true
              }
            );
          } else {
            jsonField.path.push(relativePath);
          }
          if (field.structure && field.structure.length) {
            jsonField.propertyName = {"@id":(topField.namespace ? topField.namespace : "query") + ":" + (topField.alias || field.schema.simpleAttributeName || field.schema.simplePropertyName || field.schema.label)};
          }
          if (field.optionsMap.get("sort")) {
            jsonField["sort"] = true;
          }
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
              const type = typesStore.types[id];
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
        if (propertyName && propertyName !== field.schema.simpleAttributeName && propertyName !== field.schema.simplePropertyName && propertyName !== field.schema.label) {
          field.alias = propertyName;
        }
        Object.entries(jsonField).forEach(([name, value]) => {
          if (!fieldReservedProperties.includes(name) && !(field.isFlattened && name === "sort")) {
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
          if (jsonField.sort) {
            childrenJsonFields[0].sort = true;
          }
          this._processJsonSpecificationFields(field, childrenJsonFields);
          if (flattenRelativePath.length || field.structure && field.structure.length === 1) {
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
              const type = typesStore.types[id];
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
          if (flattenRelativePath.length || field.mergeFields && field.mergeFields.length === 1) {
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

  @action
  selectQuery(query) {
    if (!this.isSaving
      && this.rootField && this.rootField.schema && this.rootField.schema.id
      && query && !query.isDeleting) {
      this.queryId = query.id + "-Copy";
      this.label = query.label;
      this.description = query.description;
      if (this.sourceQuery !== query) { // reset
        this.showHeader = true;
      }
      this.sourceQuery = query;
      this.context = toJS(query.context);
      this.rootField = this._processJsonSpecification(toJS(this.rootField.schema), toJS(query.merge), toJS(query.structure), toJS(query.properties));
      this.isSaving = false;
      this.saveError = null;
      this.isRunning = false;
      this.runError = null;
      this.saveAsMode = false;
      this.showQueries = false;
      this.result = null;
      this.selectField(this.rootField);
      this.savedQueryHasInconsistencies = this.hasQueryChanged;
    }
  }

  @action
  async executeQuery() {
    if (!this.isQueryEmpty && !this.isRunning) {
      this.isRunning = true;
      this.runError = false;
      this.result = null;
      try {
        const payload = this.JSONQuery;
        const response = await API.axios.post(API.endpoints.performQuery(this.runStripVocab ? "https://schema.hbp.eu/myQuery/" : undefined, this.resultSize, this.resultStart, this.stage), payload);
        runInAction(() => {
          this.tableViewRoot = ["data"];
          this.result = response.data;
          this.isRunning = false;
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        this.result = null;
        this.runError = `Error while executing query (${message})`;
        this.isRunning = false;
      }
    }
  }

  @action
  setResultSize(size) {
    this.resultSize = size;
  }

  @action
  setResultStart(start) {
    this.resultStart = start;
  }

  @action
  setStage(scope) {
    this.stage = scope;
  }

  @action
  returnToTableViewRoot(index) {
    this.tableViewRoot = this.tableViewRoot.slice(0, index + 1);
  }

  @action
  appendTableViewRoot(index, key) {
    this.tableViewRoot.push(index);
    this.tableViewRoot.push(key);
  }

  @action
  cancelChanges() {
    if (this.sourceQuery) {
      this.selectQuery(this.sourceQuery);
    } else if (!this.isSaving) {
      this.rootField.structure = [];
    }
  }

  @action
  async saveQuery() {
    if (!this.isQueryEmpty && !this.isSaving && !this.saveError && !(this.sourceQuery && this.sourceQuery.isDeleting)) {
      this.isSaving = true;
      if (this.sourceQuery && this.sourceQuery.deleteError) {
        this.sourceQuery.deleteError = null;
      }
      const queryId = this.saveAsMode ? this.queryId : this.sourceQuery.id;

      const payload = this.JSONQuery;
      try {
        await API.axios.put(API.endpoints.query(queryId), payload);
        runInAction(() => {
          if (!this.saveAsMode && this.sourceQuery && this.sourceQuery.user.id === authStore.user.id) {
            this.sourceQuery.label = payload.label;
            this.sourceQuery.description = payload.description;
            this.sourceQuery.context = payload["@context"];
            this.sourceQuery.merge = payload.merge,
            this.sourceQuery.structure = payload.structure;
            this.sourceQuery.properties = getProperties(payload);
          } else if (!this.saveAsMode) {
            this.sourceQuery = this.specifications.find(spec => spec.id === queryId);
            this.sourceQuery.label = payload.label;
            this.sourceQuery.description = payload.description;
            this.sourceQuery.specification = payload;
          } else {
            this.sourceQuery = {
              id: queryId,
              user: {
                id: authStore.user.id,
                name:authStore.user.displayName,
                picture:authStore.user.picture
              },
              context: payload["@context"],
              merge: payload.merge,
              structure: payload.structure,
              properties: getProperties(payload),
              label: payload.label,
              description: payload.description,
              isDeleting: false,
              deleteError: null
            };
            this.specifications.push(this.sourceQuery);
          }
          this.saveAsMode = false;
          this.isSaving = false;
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        this.saveError = `Error while saving query "${queryId}" (${message})`;
        this.isSaving = false;
      }
    }
  }

  @action
  cancelSaveQuery() {
    if (!this.isSaving) {
      this.saveError = null;
    }
  }

  @action
  async deleteQuery(query) {
    if (query && !query.isDeleting && !query.deleteError && !(query === this.sourceQuery && this.isSaving)) {
      query.isDeleting = true;
      try {
        await API.axios.delete(API.endpoints.query(query.id));
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
      }
    }
  }

  @action
  cancelDeleteQuery(query) {
    if (query && !query.isDeleting) {
      query.deleteError = null;
    }
  }

  @action
  async fetchQueries() {
    if (!this.isFetchingQueries) {
      this.specifications = [];
      this.fetchQueriesError = null;
      if (this.rootField && this.rootField.schema && this.rootField.schema.id) {
        this.isFetchingQueries = true;
        try {
          const response = await API.axios.get(API.endpoints.listQueries(this.rootField.schema.id));
          runInAction(() => {
            this.specifications = [];
            this.showMyQueries = true;
            this.showOthersQueries = true;
            const jsonSpecifications = response && response.data && response.data.data && response.data.data.length ? response.data.data : [];
            jsonSpecifications.forEach(jsonSpec => {
              let queryId = jsonSpec["@id"];
              const label = jsonSpec["https://core.kg.ebrains.eu/vocab/query/label"] ? jsonSpec["https://core.kg.ebrains.eu/vocab/query/label"] : "";
              jsonSpec["@context"] = toJS(defaultContext);
              jsonld.expand(jsonSpec, (expandErr, expanded) => {
                if (!expandErr) {
                  jsonld.compact(expanded, jsonSpec["@context"], (compactErr, compacted) => {
                    if (!compactErr) {
                      this.specifications.push({
                        id: queryId,
                        user: normalizeUser(jsonSpec["https://core.kg.ebrains.eu/vocab/meta/user"]),
                        context: compacted["@context"],
                        merge: compacted.merge,
                        structure: compacted.structure,
                        properties: getProperties(compacted),
                        label: label,
                        description: jsonSpec["https://core.kg.ebrains.eu/vocab/query/description"] ? jsonSpec["https://core.kg.ebrains.eu/vocab/query/description"] : "",
                        isDeleting: false,
                        deleteError: null
                      });
                    }
                    else {
                      this.fetchQueriesError = `Error while trying to compact JSON-LD (${compactErr})`;
                    }
                  });
                }
                else {
                  this.fetchQueriesError = `Error while trying to expand JSON-LD (${expandErr})`;
                }
              });

            });
            if (this.sourceQuery) {
              const query = this.specifications.find(spec => spec.id === this.sourceQuery.id);
              if (query) {
                this.sourceQuery = query;
              } else {
                this.sourceQuery = null;
              }
            }
            this.isFetchingQueries = false;
          });
        } catch (e) {
          this.specifications = [];
          const message = e.message ? e.message : e;
          this.fetchQueriesError = `Error while fetching saved queries for "${this.rootField.id}" (${message})`;
          this.isFetchingQueries = false;
        }
      }
    }
  }
}

export default new QueryBuilderStore();