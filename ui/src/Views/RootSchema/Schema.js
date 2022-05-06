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

import React, {useEffect, useRef} from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import _  from "lodash-uuid";
import ReactPiwik from "react-piwik";

import Icon from "../../Components/Icon";

import { useStores } from "../../Hooks/UseStores";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    margin: "4px 1px",
    padding: "15px 10px",
    background: "var(--bg-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    fontSize: "1.2em",
    fontWeight: "normal",
    cursor: "pointer",
    transition: "background .3s ease-in-out",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "&:hover": {
      background: "var(--bg-color-ui-contrast4)",
      "& $nextIcon": {
        color: "var(--ft-color-loud)"
      }
    }
  },
  nextIcon: {
    position: "absolute",
    top: "16px",
    right: "15px",
    color: "var(--ft-color-quiet)"
  }
});

const getTypeLabel = type => {
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

const Schema = observer(({ type, enableFocus, onKeyDown }) =>  {

  const classes = useStyles();

  const ref = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (enableFocus && ref.current) {
      ref.current.focus();
    }
  });


  const { queryBuilderStore } = useStores();

  const handleClick = () => {
    ReactPiwik.push(["trackEvent", "Type", "Select", type.id]);
    queryBuilderStore.selectRootSchema(type);
    selectSchema();
  };

  const handleKeyDown= e => {
    if(e.keyCode === 13) {
      queryBuilderStore.selectRootSchema(type);
      selectSchema();
    }
    onKeyDown(e);
  };

  const selectSchema = () => {
    const uuid = _.uuid();
    navigate(`/queries/${uuid}`);
  };

  const label = getTypeLabel(type);

  return (
    <div tabIndex={-1} ref={ref} className={classes.container} onClick={handleClick} onKeyDown={handleKeyDown}>
      <Icon icon={faCircle} color={type.color}/>
      {label} - <small>{type.id}</small>
      <div className={classes.nextIcon} >
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      </div>
    </div>
  );
});
Schema.displayName = "Schema";

export default Schema;