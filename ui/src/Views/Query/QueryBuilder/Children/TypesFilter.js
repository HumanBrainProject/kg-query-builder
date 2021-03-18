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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import { useStores } from "../../../../Hooks/UseStores";
import { Type } from "../../../Types";
import Toggle from "../../../../Components/Toggle";

const useStyles = createUseStyles({
  container: {
    display: "block",
    padding: "10px"
  },
  typeFilter: {
    display: "inline-block",
    border: "1px solid gray",
    borderRadius: "10px",
    padding: "10px"
  },
  toggle: {
    display: "inline-block",
    paddingLeft: "4px"
  }
});

const TypeFilter = ({ type, isSelected, onClick }) => {

  const classes = useStyles();

  return(
    <div className={classes.typeFilter}>
      <Type type={type} />
      <div className={classes.toggle}>
        <Toggle
          option={{
            name: type,
            value: isSelected
          }}
          show={true}
          onChange={onClick} />
      </div>
    </div>
  );
};

const TypesFilter = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const toggleTypeFilter = (type, isSelected) => queryBuilderStore.toggleTypeFilter(type, !!isSelected);

  if (!queryBuilderStore.currentField || !queryBuilderStore.currentField.schema || !Array.isArray(queryBuilderStore.currentField.schema.canBe)) {
    return null;
  }

  return (
    <div className={classes.container}>
      {queryBuilderStore.currentField.schema.canBe.map(type =>
        <TypeFilter key={type} type={type} isSelected={true} onClick={toggleTypeFilter} />)}
    </div>
  );
});
TypesFilter.displayName = "TypesFilter";

export default TypesFilter;