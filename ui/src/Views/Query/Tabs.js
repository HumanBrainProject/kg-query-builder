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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactPiwik from "react-piwik";

import { useStores } from "../../Hooks/UseStores";

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
      background: "transparent",
      color: "var(--ft-color-normal)",
      opacity: "0.2",
      cursor: "not-allowed"
    }
  }
});

const Tab = ({ className, disabled, active, icon, mode, title, onClick }) => {

  const props = (disabled || active) ?
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

const Tabs = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const setMode = mode => {
    ReactPiwik.push(["trackEvent", "Type", "ChangeMode", mode]);
    queryBuilderStore.setMode(mode);
  }

  return (
    <div className={classes.tabs}>
      <Tab className={classes.tab} icon="tools"  mode="build"    active={queryBuilderStore.mode === "build"}   onClick={setMode} title="build query" disabled={queryBuilderStore.isSaving} />
      <Tab className={classes.tab} icon="code"   mode="edit"     active={queryBuilderStore.mode === "edit"}    onClick={setMode} title="edit query" disabled={queryBuilderStore.isSaving} />
      <Tab className={classes.tab} icon="play"   mode="execute"  active={queryBuilderStore.mode === "execute"} onClick={setMode} title="execute query" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} />
    </div>
  );
});
Tabs.displayName = "Tabs";

export default Tabs;