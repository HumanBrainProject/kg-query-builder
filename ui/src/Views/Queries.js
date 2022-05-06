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

import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import {observer} from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRedoAlt} from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import {faBan} from "@fortawesome/free-solid-svg-icons/faBan";
import { Scrollbars } from "react-custom-scrollbars";
import ReactPiwik from "react-piwik";

import { useStores } from "../Hooks/UseStores";

import FetchingLoader from "../Components/FetchingLoader";
import BGMessage from "../Components/BGMessage";
import Filter from "../Components/Filter";
import SavedQueries from "./Queries/SavedQueries";

const useStyles = createUseStyles({
  panel: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    height: "85vh",
    width: "90%",
    margin: "auto",
    marginTop: "5vh",
    background: "var(--bg-color-ui-contrast2)",
    color: "var(--ft-color-normal)",
    border: "1px solid var(--border-color-ui-contrast2)",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
      width: "900px"
    }
  },
  filter: {
    border: 0
  },
  body: {
    borderTop: "1px solid var(--border-color-ui-contrast2)",
    padding: "0 0 10px 15px",
    background: "var(--bg-color-ui-contrast2)"
  },
  content: {
    paddingRight: "15px"
  },
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10000,
    background: "var(--bg-color-blend-contrast1)",
    "& .fetchingPanel": {
      width: "auto",
      padding: "30px",
      border: "1px solid var(--border-color-ui-contrast1)",
      borderRadius: "4px",
      color: "var(--ft-color-loud)",
      background: "var(--list-bg-hover)"
    }
  },
  error: {
    color: "var(--ft-color-loud)",
    "& button + button": {
      marginLeft: "60px"
    }
  }
});

const Queries = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  useEffect(() => {
    ReactPiwik.push(["setCustomUrl", window.location.href]);
    ReactPiwik.push(["trackPageView"]);
    if (queryBuilderStore.hasRootSchema) {
      queryBuilderStore.fetchQueries();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryBuilderStore.hasRootSchema]);

  const handleFetchSavedQueries = () => queryBuilderStore.fetchQueries();

  const handleChange = value => queryBuilderStore.setQueriesFilterValue(value);

  if (!queryBuilderStore.hasRootSchema) {
    return null;
  }

  if (queryBuilderStore.fetchQueriesError) {
    return (
      <div className={classes.error}>
        <BGMessage icon={faBan}>
          {queryBuilderStore.fetchQueriesError}<br /><br />
          <Button variant="primary" onClick={handleFetchSavedQueries}>
            <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Refresh
          </Button>
        </BGMessage>
      </div>
    );
  }

  if (queryBuilderStore.isFetchingQueries) {
    return (
      <div className={classes.loader}>
        <FetchingLoader>{`Fetching saved queries for ${queryBuilderStore.rootSchema.id}...`}</FetchingLoader>
      </div>
    );
  }

  if (!queryBuilderStore.hasQueries) {
    return (
      <div className={classes.error}>
        <BGMessage icon={faBan}>
          No saved queries available yet for {queryBuilderStore.rootSchema.label}<small> - {queryBuilderStore.rootSchema.id}</small><br /><br />
          <Button variant="primary" onClick={handleFetchSavedQueries}>
            <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Retry
          </Button>
        </BGMessage>
      </div>
    );
  }

  return (
    <div className={classes.panel} >
      <Filter className={classes.filter} value={queryBuilderStore.queriesFilterValue} placeholder="Filter queries" onChange={handleChange} />
      <div className={classes.body}>
        <Scrollbars autoHide>
          <div className={classes.content}>
            {queryBuilderStore.groupedFilteredQueries.map(group => (
              <SavedQueries
                key={group.name}
                title={group.label}
                list={group.queries}
                showUser={group.showUser}
                enableDelete={group.permissions.canDelete} />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
});
Queries.displayName = "Queries";

export default Queries;