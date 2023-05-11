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

import React from "react";
import { observer } from "mobx-react-lite";
import Toggle from "../../../../../Components/Toggle";
import Field from "../../../../../Stores/Field";
import { QuerySpecification } from "../../../../../Types/QuerySpecification";
import { Query } from "../../../../../Types/Query";
import Filter from "./Filter";
import SingleItemStrategy from "./SingleItemStrategy";
import UnsupportedOption from "./UnsupportedOption";

interface OptionProps {
  field: Field;
  rootField?: Field;
  option: Query.Option
  onChange: (name: string, newValue?: QuerySpecification.Value) => void;
}

const Option = observer(({ field, rootField, option, onChange }:OptionProps) => {
  const { name, value } = option;
  const isNotRootField = field !== rootField;
  const hasLeaf = field.lookups.length > 0;
  const isParentFieldFlattened = field?.parent?.isFlattened;

  const showRequired = isNotRootField && !isParentFieldFlattened;
  if (name === "required") {
    return (
      <Toggle
        option={option}
        label="Required"
        comment="only applicable if parent field is not flattened"
        show={showRequired}
        onChange={onChange}
      />
    );
  }

  const showSort = isNotRootField && !hasLeaf && field.isFlattenedToRoot;
  if (name === "sort") {
    return (
      <Toggle
        option={option}
        label="Sort result by this property"
        show={showSort}
        onChange={onChange}
      />
    );
  }

  const showEnsureOrder = isNotRootField && hasLeaf && !isParentFieldFlattened;
  if (name === "ensureOrder") {
    return (
      <Toggle
        option={option}
        label="Ensure original order"
        comment="only applicable if parent field is not flattened"
        show={showEnsureOrder}
        onChange={onChange}
      />
    );
  }

  const showFilter = isNotRootField && !hasLeaf;
  if (name === "filter") {
    return (
      <Filter filter={option.value as QuerySpecification.FilterItem} show={showFilter} onChange={onChange} />
    );
  }

  const showSingleValue = isNotRootField && hasLeaf && !isParentFieldFlattened;
  if (name === "singleValue") {
    return (
      <SingleItemStrategy
        strategy={option.value as string}
        show={showSingleValue}
        onChange={onChange}
      />
    );
  }

  if (value !== undefined) {
    return <UnsupportedOption name={name} value={value as string} onChange={onChange} />;
  }
  return null;
});

export default Option;