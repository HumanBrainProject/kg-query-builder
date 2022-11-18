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
    name: "ensureOrder",
    value: undefined
  },
  {
    name: "filter",
    value: undefined
  },
  {
    name: "singleValue",
    value: undefined
  }
];

interface Schema {
  id?: string;
  label?: string;
  canBe?: string[];
  simpleAttributeName?: string;
  attribute?: string;
  attributeNamespace?: string;
}

class Field {
  schema?: Schema;
  structure: Field [] = [];
  alias?: string;
  aliasError?: boolean;
  isFlattened: boolean = false;
  isReverse: boolean = false;
  optionsMap: Map<string, boolean | undefined> = new Map();
  isUnknown = null;
  isInvalid: boolean = false;
  isInvalidLeaf: boolean = false;
  typeFilter: string[] = [];
  typeFilterEnabled: boolean = false;
  parent: Field;

  constructor(schema: Schema, parent: Field) {
    makeObservable(this, {
      schema: observable,
      structure: observable,
      alias: observable,
      isFlattened: observable,
      isReverse: observable,
      optionsMap: observable,
      isUnknown: observable,
      isInvalid: observable,
      isInvalidLeaf: observable,
      aliasError: observable,
      setAlias: action,
      options: computed,
      setOption: action,
      setCurrentFieldFlattened: action,
      lookups: computed,
      defaultAlias: computed,
      typeFilterEnabled: observable,
      toggleTypeFilter: action,
      typeFilter: observable,
      filterType: action,
      types: computed
    });

    this.schema = schema;
    this.parent = parent;
    defaultOptions.forEach(option =>
      this.optionsMap.set(option.name, option.value)
    );
  }

  filterType(type: string, selected: boolean) {
    if (selected) {
      if (!this.typeFilter.includes(type)) {
        this.typeFilter.push(type);
      }
    } else {
      this.typeFilter = this.typeFilter.filter(t => t !== type);
    }
  }

  get types() {
    if (
      !this.schema ||
      !Array.isArray(this.schema.canBe) ||
      !this.schema.canBe.length
    ) {
      if (Array.isArray(this.typeFilter) && this.typeFilter.length) {
        return this.typeFilter.map(t => ({
          id: t,
          selected: true,
          isUnknown: true
        }));
      }
      return [];
    }
    const knownTypes = this.schema.canBe.map(t => ({
      id: t,
      selected: this.typeFilter.includes(t),
      isUnknown: false
    }));
    const unknownTypes = this.typeFilter
      .filter(t => this?.schema?.canBe && !this.schema.canBe.includes(t))
      .map(t => ({ id: t, selected: true, isUnknown: true }));
    return [...knownTypes, ...unknownTypes];
  }

  toggleTypeFilter() {
    this.typeFilterEnabled = !this.typeFilterEnabled;
    if (this.typeFilterEnabled) {
      this.typeFilter =
        !this.schema ||
        !Array.isArray(this.schema.canBe) ||
        !this.schema.canBe.length
          ? []
          : [...this.schema.canBe];
    } else {
      this.typeFilter = [];
    }
  }

  setAlias(value: string) {
    this.alias = value;
    this.aliasError = false;
  }

  get options() {
    return Array.from(this.optionsMap).map(([name, value]) => ({
      name: name,
      value: toJS(value)
    }));
  }

  getOption(name: string) {
    return this.optionsMap.has(name) ? this.optionsMap.get(name) : undefined;
  }

  setOption(name: string, value?: boolean, preventRecursivity?: boolean) {
    this.optionsMap.set(name, value);
    if (name === "sort" && value && !preventRecursivity) {
      this.parent.structure.forEach(field => {
        if (field !== this) {
          field.setOption("sort", undefined, true);
        }
      });
    }
  }

  setCurrentFieldFlattened(value: boolean) {
    this.isFlattened = !!value;
  }

  get lookups() {
    return this.schema && this.schema.canBe && !!this.schema.canBe.length
      ? this.schema.canBe
      : [];
  }

  get defaultAlias() {
    let currentField = this;
    while (
      currentField.isFlattened &&
      currentField.structure &&
      currentField.structure[0]?.schema?.canBe
    ) {
      currentField = currentField.structure[0];
    }
    if (!currentField.schema) {
      return "";
    }
    return (
      currentField.schema.simpleAttributeName || currentField.schema.label || ""
    );
  }
}

export default Field;
