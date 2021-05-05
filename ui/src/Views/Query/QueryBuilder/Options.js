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

import React  from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

import { useStores } from "../../../Hooks/UseStores";

import Name from "./Options/Name";
import Flatten from "./Options/Flatten";
import AddMergeButton from "./Options/AddMergeButton";
import Option from "./Options/Option";
import TypeFilter from "./Options/TypeFilter";

const useStyles = createUseStyles({
  container: {
    height: "100%",
    color: "var(--ft-color-normal)",
    "& input": {
      color: "black"
    },
    "& hr": {
      margin: "30px auto",
      maxWidth: "500px",
      borderTopColor: "var(--bg-color-ui-contrast4)"
    }
  },
  fieldOptions: {
    position: "relative"
  }
});

const Options = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const field = queryBuilderStore.currentField;


  if (!field) {
    return null;
  }

  const rootField = queryBuilderStore.rootField;

  const handleAddMergeField = e => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addMergeField(field, !e.ctrlKey && !e.metaKey);
  };

  const handleChangeFlatten = value => field.setCurrentFieldFlattened(value);

  const handleChangeOption = (name, value) => field.setOption(name, value);

  return (
    <div className={classes.container}>
      <div className={classes.fieldOptions}>
        <Name field={field} rootField={rootField} />
        {field.options.map(option => (
          <Option key={option.name} field={field} rootField={rootField} option={option} onChange={handleChangeOption} />
        ))}
        <Flatten
          field={field}
          show={field !== rootField
                && !!field.lookups.length
                && field.structure.length === 1
                && !field.isMerge
          }
          onChange={handleChangeFlatten}
        />
      </div>
      <AddMergeButton
        field={field}
        show={!field.isMerge
              && field !== rootField
              && !!field.lookups.length
        }
        onClick={handleAddMergeField}
      />
      <TypeFilter />
    </div>
  );
});
Options.displayName = "Options";

export default Options;