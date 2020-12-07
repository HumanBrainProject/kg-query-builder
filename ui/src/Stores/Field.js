/*
*   Copyright (c) 2020, EPFL/Human Brain Project PCO
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

import { observable, action, computed, toJS, makeObservable } from "mobx";

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
  },
  {
    name: "filter",
    value: undefined
  }
];

class Field {
  schema = null;
  merge = [];
  structure = [];
  alias = null;
  isFlattened = false;
  isMerge = false;
  optionsMap = new Map();
  isUnknown = null;;
  isInvalid = null;
  aliasError = null;

  constructor(schema, parent) {
    makeObservable(this, {
      schema: observable,
      merge: observable,
      structure: observable,
      alias: observable,
      isFlattened: observable,
      isMerge: observable,
      optionsMap: observable,
      isUnknown: observable,
      isInvalid: observable,
      aliasError: observable,
      setAlias: action,
      options: computed,
      setOption: action,
      setCurrentFieldFlattened: action,
      isRootMerge: computed,
      parentIsRootMerge: computed,
      rootMerge: computed,
      hasMergeChild: computed,
      lookups: computed,
      defaultAlias: computed
    });

    this.schema = schema;
    this.parent = parent;
    defaultOptions.forEach(option => this.optionsMap.set(option.name, option.value));
  }

  setAlias(value) {
    this.alias = value;
    this.aliasError = (value.trim() === "" && this.isRootMerge);
  }

  get options() {
    return Array.from(this.optionsMap).map(([name, value]) => ({
      name: name,
      value: toJS(value)
    }));
  }

  getOption(name) {
    return this.optionsMap.has(name) ? this.optionsMap.get(name) : undefined;
  }

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

  setCurrentFieldFlattened(value) {
    this.isFlattened = !!value;
  }

  get isRootMerge() {
    return this.isMerge && (!this.parent || !this.parent.isMerge);
  }

  get parentIsRootMerge() {
    return !this.isRootMerge && this.parent && this.parent.isRootMerge;
  }

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

  get hasMergeChild() {
    return this.isRootMerge ? (this.merge && !!this.merge.length) : (this.structure && !!this.structure.length);
  }

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

  get defaultAlias() {
    let currentField = this;
    while (currentField.isFlattened && currentField.structure[0] && currentField.structure[0].schema && currentField.structure[0].schema.canBe) {
      currentField = currentField.structure[0];
    }
    if (!currentField.schema) {
      return "";
    }
    return currentField.schema.simpleAttributeName || currentField.schema.label || "";
  }
}

export default Field;