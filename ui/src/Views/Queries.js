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

import React, { useEffect } from "react";
import { createUseStyles } from "react-jss";
import {observer} from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useStores } from "../Hooks/UseStores";

import FetchingLoader from "../Components/FetchingLoader";
import BGMessage from "../Components/BGMessage";
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
    padding: "15px",
    background: "var(--bg-color-ui-contrast2)",
    color: "var(--ft-color-normal)",
    border: "1px solid var(--border-color-ui-contrast2)",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
      width: "900px"
    },
    "& > div": {
      transition: "height 0.3s ease",
      "&.show": {
        flex: 1
      },
      "& + div": {
        marginTop: "15px"
      }
    }
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
    if (queryBuilderStore.hasRootSchema) {
      queryBuilderStore.fetchQueries();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryBuilderStore.hasRootSchema]);

  const handleFetchSavedQueries = () => queryBuilderStore.fetchQueries();

  const handleMyQueriesExpandToggle = () => queryBuilderStore.toggleMyQueries();

  const handleOthersQueriesExpandToggle = () => queryBuilderStore.toggleOtherQueries();

  if (!queryBuilderStore.hasRootSchema) {
    return null;
  }

  if (queryBuilderStore.fetchQueriesError) {
    return (
      <div className={classes.error}>
        <BGMessage icon={"ban"}>
          {queryBuilderStore.fetchQueriesError}<br /><br />
          <Button variant="primary" onClick={handleFetchSavedQueries}>
            <FontAwesomeIcon icon={"redo-alt"} /> &nbsp; Refresh
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
        <BGMessage icon={"ban"}>
          No saved queries available yet for {queryBuilderStore.rootSchema.label}<small> - {queryBuilderStore.rootSchema.id}</small><br /><br />
          <Button variant="primary" onClick={handleFetchSavedQueries}>
            <FontAwesomeIcon icon={"redo-alt"} /> &nbsp; Retry
          </Button>
        </BGMessage>
      </div>
    );
  }

  return (
    <div className={classes.panel} >
      {queryBuilderStore.hasMyQueries && (
        <div className={`${queryBuilderStore.showMyQueries?" show":""}`} >
          <SavedQueries
            title={`My saved queries for ${queryBuilderStore.rootSchema.label}`}
            subTitle={queryBuilderStore.rootSchema.id}
            list={queryBuilderStore.myQueries}
            expanded={queryBuilderStore.showMyQueries}
            onExpandToggle={handleMyQueriesExpandToggle}
            enableDelete={true} />
        </div>
      )}
      {queryBuilderStore.hasOthersQueries && (
        <div className={`${queryBuilderStore.showOthersQueries?" show":""}`} >
          <SavedQueries
            title={`Other users queries for ${queryBuilderStore.rootSchema.label}`}
            subTitle={queryBuilderStore.rootSchema.id}
            list={queryBuilderStore.othersQueries}
            expanded={queryBuilderStore.showOthersQueries}
            onExpandToggle={handleOthersQueriesExpandToggle}
            showUser={true} />
        </div>
      )}
    </div>
  );
});
Queries.displayName = "Queries";

export default Queries;