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

import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { matchPath } from "react-router-dom";
import _  from "lodash-uuid";
import ReactPiwik from "react-piwik";

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
  }
});

const Header = observer(() => {

  const classes = useStyles();

  const { appStore, history, authStore, queryBuilderStore } = useStores();

  const [currentLocationPathname, setCurrentLocationPathname] = useState(history.location.pathname);

  useEffect(() => {
    const unlisten = history.listen(location => {
      setCurrentLocationPathname(location.pathname);
    });
    return unlisten;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBrowseTypes = () => {
    ReactPiwik.push(["trackEvent", "Tab", "BrowseTypes"]);
    queryBuilderStore.clearRootSchema();
    history.push("/");
  };

  const handleBrowseStoredQueries = () => {
    ReactPiwik.push(["trackEvent", "Tab", "BrowseQueries", queryBuilderStore.rootField.id]);
    queryBuilderStore.resetRootSchema();
    history.push("/queries");
  };

  const handleBuildNewQuery = () => {
    ReactPiwik.push(["trackEvent", "Tab", "NewQuery", queryBuilderStore.rootField.id]);
    queryBuilderStore.resetRootSchema();
    const uuid = _.uuid();
    queryBuilderStore.setAsNewQuery(uuid);
    history.push(`/queries/${uuid}`);
  };

  return (
    <div className={classes.container}>
      <div className={`${classes.logo} layout-logo`}>
        <img src={`${window.rootPath}/assets/ebrains.svg`} alt="" width="30" height="30" />
        <span>Knowledge Graph Query Builder</span>
      </div>
      {!appStore.globalError &&
          <React.Fragment>
            <div className={classes.fixedTabsLeft}>
              {authStore.isUserAuthorized && authStore.hasUserSpaces && (
                queryBuilderStore.hasRootSchema?
                  <React.Fragment>
                    <Tab Component={HomeTab} current={matchPath(currentLocationPathname, { path: "/", exact: "true" })} onClick={handleBrowseTypes} label={"Select another type"} hideLabel disable={queryBuilderStore.isSaving} />
                    <Tab icon={"search"} current={matchPath(currentLocationPathname, { path: "/queries", exact: "true" })} onClick={handleBrowseStoredQueries} hideLabel label={"Browse stored queries"} disable={queryBuilderStore.isSaving} />
                    <Tab icon={"file"} current={false} onClick={handleBuildNewQuery} hideLabel label={"New query"} disable={queryBuilderStore.isSaving} />
                    {queryBuilderStore.queryId && (
                      <Tab icon={queryBuilderStore.isSaving?"circle-notch":"tag"} iconSpin={queryBuilderStore.isSaving} current={matchPath(currentLocationPathname, { path: "/queries/:id", exact: "true" })} onClose={handleBrowseStoredQueries} label={queryBuilderStore.label?queryBuilderStore.label:queryBuilderStore.queryId} />
                    )}
                  </React.Fragment>
                  :
                  <Tab icon={"home"} current={matchPath(currentLocationPathname, { path: "/", exact: "true" })} onClick={handleBrowseTypes} label={"Select a type"} hideLabel />
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