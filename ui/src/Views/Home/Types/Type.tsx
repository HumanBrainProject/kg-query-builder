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

import React, {KeyboardEvent, RefObject, useEffect, useRef} from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";

import API from "../../../Services/API";
import Icon from "../../../Components/Icon";

import { useStores } from "../../../Hooks/UseStores";
import { Type as TypeSpec} from "../../../Stores/Type";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    margin: "4px 1px",
    padding: "15px 10px",
    color: "var(--ft-color-loud)",
    fontSize: "1.2em",
    fontWeight: "normal",
    cursor: "pointer",
    transition: "background .3s ease-in-out",
    background: "rgba(0,0,0,0.4)",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "&:hover, &$selected": {
      background: "linear-gradient(90deg, rgba(30,60,70,0.9) 0%, rgba(20,50,60,0.9) 100%)",
      "& $nextIcon": {
        color: "var(--ft-color-loud)"
      }
    }
  },
  selected: {},
  nextIcon: {
    position: "absolute",
    top: "16px",
    right: "15px",
    color: "var(--ft-color-quiet)"
  }
});

const getTypeLabel = (type: TypeSpec.Type) => {
  if (!type) {
    return "";
  }
  if (type.label) {
    return type.label;
  }
  if (!type.id) {
    return "";
  }
  const parts = type.id.split("/");
  return parts[parts.length-1];
};

interface TypeProps {
  type: TypeSpec.Type;
  enableFocus: boolean; 
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

const Type = observer(({ type, enableFocus, onKeyDown }: TypeProps) =>  {

  const classes = useStyles();

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (enableFocus && ref.current) {
      ref.current.focus();
    }
  });


  const { queryBuilderStore } = useStores();

  const selectType = () => {
    if (type.id !== queryBuilderStore.rootSchemaId) {
      API.trackEvent("Type", "Select", type.id);
      localStorage.setItem("type", type.id);
      queryBuilderStore.selectRootSchema(type);
    }
  };

  const handleClick = () => selectType();

  const handleKeyDown= (e: KeyboardEvent<HTMLDivElement>) => {
    if(e.keyCode === 13) {
      selectType();
    }
    onKeyDown(e);
  };

  const label = getTypeLabel(type);

  return (
    <div tabIndex={-1} ref={ref as RefObject<any>} className={`${classes.container} ${type.id === queryBuilderStore.rootSchemaId?classes.selected:""}`} onClick={handleClick} onKeyDown={handleKeyDown}>
      <Icon icon={faCircle} color={type.color}/>
      {label} - <small>{type.id}</small>
      <div className={classes.nextIcon} >
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      </div>
    </div>
  );
});
Type.displayName = "Type";

export default Type;