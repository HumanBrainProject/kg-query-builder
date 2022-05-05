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
import {observer} from "mobx-react-lite";
import { createUseStyles } from "react-jss";

import { useStores } from "../../../../Hooks/UseStores";
import { Type } from "../../../Types";
import Toggle from "../../../../Components/Toggle";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    paddingTop: "20px",
    paddingBottom: "10px",
    "& > div:first-child > div": {
      marginBottom: 0
    }
  },
  panel: {
    display: "flex",
    padding: "10px 10px 0 10px",
    flexWrap: "wrap",
    border: "1px solid var(--bg-color-ui-contrast4)",
    marginTop: "6px"
  },
  typeFilter: {
    display: "inline-block",
    border: "1px solid var(--bg-color-ui-contrast4)",
    borderRadius: "20px",
    padding: "7px 4px 7px 10px",
    float: "left",
    marginRight: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    maxHeight: "40px",
    minHeight: "40px",
    "-webkitTouchCallout": "none",
    userSelect: "none",
    transition: "color .3s ease-in-out, border-color .3s ease-in-out",
    "&.selected, &:hover": {
      color: "var(--ft-color-loud)",
      borderColor: "var(--ft-color-loud)"
    },
    "&.isUnknown" : {
      borderColor: "var(--bg-color-warn-quiet)"
    },
    "&.isUnknown.selected, &.isUnknown:hover": {
      borderColor: "var(--bg-color-warn-loud)"
    }
  },
  toggle: {
    display: "inline-block",
    paddingLeft: "6px"
  }
});

const TypeFilterItem = ({ type, onClick }) => {

  const classes = useStyles();

  const handleOnClick = () => typeof onClick === "function" && onClick(type.id, !type.selected);

  const handleToggleClick = (name, value) => typeof onClick === "function" && onClick(name, !!value);

  return(
    <div className={`${classes.typeFilter} ${type.isUnknown?"isUnknown":""} ${type.selected?"selected":""}`} onClick={handleOnClick} >
      <Type type={type.id} />
      <div className={classes.toggle}>
        <Toggle
          option={{
            name: type.id,
            value: type.selected?true:undefined
          }}
          show={true}
          onChange={handleToggleClick} />
      </div>
    </div>
  );
};

const TypeFilter = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleToggleTypeFilter = () => queryBuilderStore.currentField.toggleTypeFilter();

  const toggleTypeFilter = (type, selected) => queryBuilderStore.currentField.filterType(type, selected);

  if (!queryBuilderStore.currentField || !queryBuilderStore.currentField.types.length || queryBuilderStore.currentField === queryBuilderStore.rootField) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div>
        <Toggle
          label="Type Filter"
          option={{
            name: "Type Filter",
            value: queryBuilderStore.currentField.typeFilterEnabled?true:undefined
          }}
          show={true}
          onChange={handleToggleTypeFilter} />
      </div>
      {queryBuilderStore.currentField.typeFilterEnabled && (
        <div className={classes.panel}>
          {queryBuilderStore.currentField.types.map((type, index) =>
            <TypeFilterItem key={type.id?type.id:index} type={type} onClick={toggleTypeFilter} />)}
        </div>
      )}
    </div>
  );
});
TypeFilter.displayName = "TypeFilter";

export default TypeFilter;