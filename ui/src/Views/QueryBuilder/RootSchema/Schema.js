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

import React, {useEffect, useRef} from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Icon from "../../../Components/Icon";

import { useStores } from "../../../Hooks/UseStores";

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

const Schema = observer(({ type, enableFocus, onKeyDown }) =>  {

  const classes = useStyles();

  const ref = useRef();

  useEffect(() => {
    if (enableFocus && ref.current) {
      ref.current.focus();
    }
  });


  const { queryBuilderStore } = useStores();

  const handleClick = () => queryBuilderStore.selectRootSchema(type);

  const handleKeyDown= e => {
    if(e.keyCode === 13) {
      queryBuilderStore.selectRootSchema(type);
    }
    onKeyDown(e);
  };


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

  const label = getTypeLabel(type);

  return (
    <div tabIndex={-1} ref={ref} className={classes.container} onClick={handleClick} onKeyDown={handleKeyDown}>
      <Icon icon="circle" color={type.color}/>
      {label} - <small>{type.id}</small>
      <div className={classes.nextIcon} >
        <FontAwesomeIcon icon={"chevron-right"} size="lg" />
      </div>
    </div>
  );
});
Schema.displayName = "Schema";

export default Schema;