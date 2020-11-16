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

import React, { useEffect} from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { useStores } from "../Hooks/UseStores";

import RootSchema from "./QueryBuilder/RootSchema";
import Query from "./QueryBuilder/Query";
import QueryPanels from "./QueryBuilder/QueryPanels";
import QueriesDrawer from "./QueryBuilder/QueriesDrawer";
import BGMessage from "../Components/BGMessage";
import FetchingLoader from "../Components/FetchingLoader";

const rootPath = window.rootPath || "";

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    color: "var(--ft-color-normal)",
    backgroundImage: `url('${window.location.protocol}//${window.location.host}${rootPath}/assets/graph.png')`,
  },
  fetchingPanel: {
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
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "10px",
    padding: "10px",
    height: "100%"
  }
});

const QueryBuilder = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore, typeStore } = useStores();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchStructure(true), []);

  const fetchStructure = (forceFetch=false) => typeStore.fetch(forceFetch);

  const handleRetryFetchStructure = () => fetchStructure(true);

  if (typeStore.isFetching) {
    return (
      <div className={classes.container}>
        <div className={classes.fetchingPanel}>
          <FetchingLoader>
              Fetching api structure...
          </FetchingLoader>
        </div>
      </div>
    );
  }

  if (typeStore.fetchError) {
    return (
      <div className={classes.container}>
        <BGMessage icon={"ban"}>
          There was a network problem fetching the api structure.<br />
          If the problem persists, please contact the support.<br />
          <small>{typeStore.fetchError}</small><br /><br />
          <Button variant="primary" onClick={handleRetryFetchStructure}>
            <FontAwesomeIcon icon={"redo-alt"} />&nbsp;&nbsp; Retry
          </Button>
        </BGMessage>
      </div>
    );
  }

  if (!typeStore.hasTypes) {
    return (
      <div className={classes.container}>
        <BGMessage icon={"tools"}>
            No types available.<br />
            If the problem persists, please contact the support.<br /><br />
          <Button variant="primary" onClick={handleRetryFetchStructure}>
            <FontAwesomeIcon icon={"redo-alt"} />&nbsp;&nbsp; Retry
          </Button>
        </BGMessage>
      </div>
    );
  }

  if (!queryBuilderStore.hasRootSchema) {
    return (
      <div className={classes.container}>
        <RootSchema />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.layout}>
        <Query />
        <QueryPanels />
        <QueriesDrawer />
      </div>
    </div>
  );

});
QueryBuilder.displayName = "QueryBuilder";

export default QueryBuilder;