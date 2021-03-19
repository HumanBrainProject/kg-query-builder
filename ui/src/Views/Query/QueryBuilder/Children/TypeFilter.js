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

import React from "react";
import {observer} from "mobx-react-lite";
import { createUseStyles } from "react-jss";

import { useStores } from "../../../../Hooks/UseStores";
import { Type } from "../../../Types";
import Toggle from "../../../../Components/Toggle";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    padding: "5px 15px 15px 15px"
  },
  panel: {
    display: "flex",
    padding: "10px 10px 0 10px",
    flexWrap: "wrap",
    border: "1px solid var(--bg-color-ui-contrast4)",
    borderRadius: "4px",
    marginTop: "4px"
  },
  typeFilter: {
    display: "inline-block",
    border: "1px solid var(--bg-color-ui-contrast4)",
    borderRadius: "20px",
    padding: "4px 10px 8px 10px",
    float: "left",
    marginRight: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    maxHeight: "44px",
    minHeight: "44px",
    "-webkitTouchCallout": "none",
    userSelect: "none",
    transition: "color .3s ease-in-out, border-color .3s ease-in-out",
    "&.selected, &:hover": {
      color: "var(--ft-color-loud)",
      borderColor: "var(--ft-color-loud)"
    }
  },
  toggle: {
    display: "inline-block",
    paddingLeft: "6px"
  },
  toggleTypeFilter: {
    display: "inline-block",
    paddingRight: "10px",
    transform: "translateY(-1px)",
    "& + span": {
      fontWeight: "bold"
    }
  }
});

const TypeFilterItem = ({ type, isSelected, onClick }) => {

  const classes = useStyles();

  const handleOnClick = () => typeof onClick === "function" && onClick(type, !isSelected);

  const handleToggleClick = (name, value) => typeof onClick === "function" && onClick(name, !!value);

  return(
    <div className={`${classes.typeFilter} ${isSelected?"selected":""}`} onClick={handleOnClick} >
      <Type type={type} />
      <div className={classes.toggle}>
        <Toggle
          option={{
            name: type,
            value: isSelected?true:undefined
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

  const toggleTypeFilter = (type, isSelected) => queryBuilderStore.currentField.filterType(type, isSelected);

  if (!queryBuilderStore.currentField || queryBuilderStore.currentField.types.length <= 1) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.toggleTypeFilter}>
        <Toggle
          option={{
            name: "Type Filter",
            value: queryBuilderStore.currentField.typeFilterEnabled?true:undefined
          }}
          show={true}
          onChange={handleToggleTypeFilter} />
      </div>
      <span>Type Filter</span>
      {queryBuilderStore.currentField.typeFilterEnabled && (
        <div className={classes.panel}>
          {queryBuilderStore.currentField.types.map(type =>
            <TypeFilterItem key={type.id} type={type.id} isSelected={type.selected} onClick={toggleTypeFilter} />)}
        </div>
      )}
    </div>
  );
});
TypeFilter.displayName = "TypeFilter";

export default TypeFilter;