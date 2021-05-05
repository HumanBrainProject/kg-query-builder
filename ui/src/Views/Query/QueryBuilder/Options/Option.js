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
import Toggle from "../../../../Components/Toggle";
import Filter from "./Filter";
import SingleItemStrategy from "./SingleItemStrategy";
import UnsupportedOption from "./UnsupportedOption";

const Option = ({ field, rootField, option, onChange }) => {

  const { name, value } = option;

  if (name === "required") {
    return (
      <Toggle
        option={option}
        label="Required"
        comment="only applicable if parent field is not flattened"
        show={field !== rootField
          && !field.parent.isFlattened
          && (!field.isMerge || field.isRootMerge)
        }
        onChange={onChange}
      />
    );
  }

  if (name === "sort") {
    return (
      <Toggle
        option={option}
        label="Sort"
        comment="enabling sort on this field will disable sort on other fields"
        show={field !== rootField
              && !field.lookups.length
        }
        onChange={onChange}
      />
    );
  }

  if (name === "ensureOrder") {
    return (
      <Toggle
        option={option}
        label="Ensure original order"
        comment="only applicable if parent field is not flattened"
        show={field !== rootField
          && !!field.lookups.length
          && !field.parent.isFlattened
          && (!field.isMerge || field.isRootMerge)
        }
        onChange={onChange}
      />
    );
  }

  if (name === "filter") {
    return (
      <Filter
        filter={option.value}
        show={field !== rootField
          && !field.lookups.length
        }
        onChange={onChange}
      />
    );
  }

  if (name === "singleValue") {
    return (
      <SingleItemStrategy
        strategy={option.value}
        show={field !== rootField
          && !!field.lookups.length
          && !field.parent.isFlattened
          && (!field.isMerge || field.isRootMerge)
        }
        onChange={onChange}
      />
    );
  }

  if (value !== undefined && (!field.isMerge || field.isRootMerge)) {
    return (
      <UnsupportedOption name={name} value={value} onChange={onChange} />
    );
  }
  return null;
};

export default Option;