import { observable, action, computed, toJS } from "mobx";

const defaultOptions = [
  {
    name: "required",
    value: undefined
  },
  {
    name: "sort",
    value: undefined
  },
  {
    name: "ensure_order",
    value: undefined
  }
];


class Field {
  @observable schema = null;
  @observable merge = [];
  @observable structure = [];
  @observable alias = null;
  @observable isFlattened = false;
  @observable isMerge = false;
  @observable optionsMap = new Map();
  @observable isUnknown = null;;
  @observable isInvalid = null;
  @observable aliasError = null;

  constructor(schema, parent) {
    this.schema = schema;
    this.parent = parent;
    defaultOptions.forEach(option => this.optionsMap.set(option.name, option.value));
  }

  @action
  setAlias(value) {
    this.alias = value;
    this.aliasError = (value.trim() === "" && this.isRootMerge);
  }

  @computed
  get options() {
    return Array.from(this.optionsMap).map(([name, value]) => ({
      name: name,
      value: toJS(value)
    }));
  }

  getOption(name) {
    return this.optionsMap.has(name) ? this.optionsMap.get(name) : undefined;
  }

  @action
  setOption(name, value, preventRecursivity) {
    this.optionsMap.set(name, value);
    if (name === "sort" && value && !preventRecursivity) {
      this.parent.structure.forEach(field => {
        if (field !== this) {
          field.setOption("sort", undefined, true);
        }
      });
    }
  }

  @computed
  get isRootMerge() {
    return this.isMerge && (!this.parent || !this.parent.isMerge);
  }

  @computed
  get parentIsRootMerge() {
    return !this.isRootMerge && this.parent && this.parent.isRootMerge;
  }

  @computed
  get rootMerge() {
    if (!this.isMerge) {
      return null;
    }
    let field = this;
    while (field && !field.isRootMerge) {
      field = field.parent;
    }
    return field;
  }

  @computed
  get hasMergeChild() {
    return this.isRootMerge ? (this.merge && !!this.merge.length) : (this.structure && !!this.structure.length);
  }

  @computed
  get lookups() {
    if (this.merge && !!this.merge.length) {
      const canBe = [];
      this.merge.forEach(field => {
        let mergeField = field;
        while (mergeField) {
          if (mergeField.structure && !!mergeField.structure.length) {
            mergeField = mergeField.structure[0];
          } else {
            if (mergeField.schema && mergeField.schema.canBe && !!mergeField.schema.canBe.length) {
              mergeField.schema.canBe.forEach(schema => {
                if (!canBe.includes(schema)) {
                  canBe.push(schema);
                }
              });
            }
            mergeField = null;
          }
        }
      });
      return canBe;
    }
    return (this.schema && this.schema.canBe && !!this.schema.canBe) ? this.schema.canBe : [];
  }

  getDefaultAlias() {
    let currentField = this;
    while (currentField.isFlattened && currentField.structure[0] && currentField.structure[0].schema && currentField.structure[0].schema.canBe) {
      currentField = currentField.structure[0];
    }
    if (!currentField.schema) {
      return "";
    }
    return currentField.schema.simpleAttributeName || currentField.schema.simplePropertyName || currentField.schema.label || "";
  }
}

export default Field;