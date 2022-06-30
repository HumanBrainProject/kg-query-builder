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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import _  from "lodash-uuid";
import ReactPiwik from "react-piwik";
import {faSearch} from "@fortawesome/free-solid-svg-icons/faSearch";
import {faFile} from "@fortawesome/free-solid-svg-icons/faFile";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {faTag} from "@fortawesome/free-solid-svg-icons/faTag";

import { useStores } from "../Hooks/UseStores";

import Tab from "./Header/Tab";
import HomeTab from "./Header/HomeTab";
import UserProfileTab from "./UserProfileTab";

const useStyles = createUseStyles({
  container: {
    background: "var(--bg-color-ui-contrast1)",
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto 1fr auto"
  },
  fixedTabsLeft: {
    display: "grid",
    gridTemplateColumns: "auto auto auto auto 1fr"
  },
  fixedTabsRight: {
    display: "grid",
    gridTemplateColumns: "repeat(6, auto)"
  },
  logo: {
    padding: "10px",
    cursor: "pointer",
    "& span": {
      color: "var(--ft-color-loud)",
      display: "inline-block",
      paddingLeft: "10px",
      fontSize: "0.9em",
      borderLeft: "1px solid var(--border-color-ui-contrast5)",
      marginLeft: "10px"
    },
    "&:hover span": {
      color: "var(--ft-color-louder)"
    }
  },
  userProfileTab: {
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    color: "var(--ft-color-normal)",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast2)",
    borderLeft: "none"
  },
  unknownType: {
    background: "var(--bg-color-warn-quiet)"
  }
});

const Header = observer(() => {

  const classes = useStyles();

  const { appStore, authStore, queryBuilderStore } = useStores();

  const location = useLocation();
  const navigate = useNavigate();

  const handleBrowseTypes = () => {
    ReactPiwik.push(["trackEvent", "Tab", "BrowseTypes"]);
    queryBuilderStore.clearRootSchema();
    navigate("/");
  };

  const handleBrowseStoredQueries = () => {
    ReactPiwik.push(["trackEvent", "Tab", "BrowseQueries", queryBuilderStore.rootField.id]);
    queryBuilderStore.resetQuery();
    navigate("/queries");
  };

  const handleBuildNewQuery = () => {
    ReactPiwik.push(["trackEvent", "Tab", "NewQuery", queryBuilderStore.rootField.id]);
    queryBuilderStore.initializeFromRootField();
    const uuid = _.uuid();
    queryBuilderStore.setAsNewQuery(uuid);
    navigate(`/queries/${uuid}${queryBuilderStore.hasSupportedRootSchema?"":"/edit"}`);
  };

  const icon = queryBuilderStore.isSaving?faCircleNotch:faTag; 
  const label = queryBuilderStore.label?queryBuilderStore.label:queryBuilderStore.queryId;

  return (
    <div className={classes.container}>
      <div className={`${classes.logo} layout-logo`}>
        <img src={`${window.rootPath}/assets/ebrains.svg`} alt="" height="30" />
        <span>Knowledge Graph Query Builder</span>
      </div>
      {!appStore.globalError &&
          <React.Fragment>
            <div className={classes.fixedTabsLeft}>
              {authStore.isUserAuthorized && authStore.hasSpaces && (
                queryBuilderStore.hasRootSchema?
                  <React.Fragment>
                    <Tab Component={HomeTab} className={queryBuilderStore.hasSupportedRootSchema?null:classes.unknownType} current={matchPath({ path: "/" }, location.pathname)} onClick={handleBrowseTypes} label={"Select another type"} hideLabel disable={queryBuilderStore.isSaving} />
                    <Tab icon={faSearch} current={matchPath({ path: "/queries" }, location.pathname)} onClick={handleBrowseStoredQueries} hideLabel label={"Browse stored queries"} disable={queryBuilderStore.isSaving} />
                    <Tab icon={faFile} current={false} onClick={handleBuildNewQuery} hideLabel label={"New query"} disabled={queryBuilderStore.isSaving} />
                    {queryBuilderStore.queryId && (
                      <Tab icon={icon} iconSpin={queryBuilderStore.isSaving} current={matchPath({ path: "/queries/:id" }, location.pathname)} onClose={handleBrowseStoredQueries} label={label} />
                    )}
                  </React.Fragment>
                  :
                  <Tab icon={faHome} current={matchPath({ path: "/" }, location.pathname)} onClick={handleBrowseTypes} label={"Select a type"} hideLabel />
              )}
            </div>
            <div className={classes.fixedTabsRight}>
              {authStore.isAuthenticated && authStore.isUserAuthorized && (
                <UserProfileTab className={classes.userProfileTab} size={32} />
              )}
            </div>
          </React.Fragment>
      }
    </div>
  );
});
Header.displayName = "Header";

export default Header;