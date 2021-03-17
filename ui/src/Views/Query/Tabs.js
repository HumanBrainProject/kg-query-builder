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

const useStyles = createUseStyles({
  tabs: {
    borderRight: "1px solid var(--border-color-ui-contrast1)",
    background: "var(--bg-color-ui-contrast2)"
  },
  tab: {
    color: "var(--ft-color-normal)",
    borderLeft: "2px solid transparent",
    opacity: "0.5",
    cursor: "pointer",
    height: "50px",
    lineHeight: "50px",
    fontSize: "1.75em",
    textAlign: "center",
    "&:hover": {
      background: "var(--list-bg-hover)",
      borderColor: "var(--list-border-hover)",
      color: "var(--ft-color-loud)",
      opacity: "1"
    },
    "&.active": {
      background: "var(--list-bg-selected)",
      borderColor: "var(--list-border-selected)",
      color: "var(--ft-color-loud)",
      opacity: "1"
    },
    "&.disabled, &.disabled:hover":{
      color: "var(--ft-color-normal)",
      opacity: "0.2",
      cursor: "not-allowed"
    }
  }
});

const Tab = ({ className, disabled, active, icon, mode, title, onClick }) => {

  const props = disabled || active ?
    {
      className: `${className} ${disabled?"disabled":""} ${active?"active":""}`
    }:
    {
      className: className,
      onClick: () => typeof onClick === "function" && onClick(mode)
    };

  return(
    <div {...props} title={title}>
      <FontAwesomeIcon icon={icon}/>
    </div>
  );
};

const Tabs = observer(({ mode, onClick }) => {

  const classes = useStyles();

  return (
    <div className={classes.tabs}>
      <Tab className={classes.tab} icon="pencil-alt"  mode="build"    active={mode === "build"}   onClick={onClick} title="build query" />
      <Tab className={classes.tab} icon="eye"         mode="view"     active={mode === "view"}    onClick={onClick} title="view query" />
      <Tab className={classes.tab} icon="play"         mode="execute"  active={mode === "execute"} onClick={onClick} title="execute query" disable={false} />
    </div>
  );
});
Tabs.displayName = "Tabs";

export default Tabs;