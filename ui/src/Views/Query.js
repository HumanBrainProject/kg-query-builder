/*
*   Copyright (c) 2021, EPFL/Human Brain Project PCO
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
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useStores } from "../Hooks/UseStores";

import Tabs from "./Query/Tabs";
import QueryBuilder from "./Query/QueryBuilder";
import QueryEditor from "./Query/QueryEditor";
import QueryExecution from "./Query/QueryExecution";
import FetchingLoader from "../Components/FetchingLoader";
import BGMessage from "../Components/BGMessage";
import CompareChangesModal from "./Query/CompareChangesModal";
import SaveError from "./Query/SaveError";
import SavingMessage from "./Query/SavingMessage";

const useStyles = createUseStyles({
  container: {
    display: "grid",
    height: "100%",
    gridTemplateRows: "100%",
    gridTemplateColumns: "50px 1fr"
  },
  body: {
    position: "relative",
    overflow: "hidden"
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
  }
});

const View = ({mode}) => {
  switch (mode) {
  case "edit":
    return(
      <QueryEditor />
    );
  case "execute":
    return(
      <QueryExecution />
    );
  case "build":
  default:
    return(
      <QueryBuilder />
    );
  }
};

const Query = observer(({id, mode}) => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => queryBuilderStore.selectQueryById(id, mode), [id]);

  const handleRetry = () => queryBuilderStore.selectQueryById(id, mode);

  if (queryBuilderStore.isFetchingQuery) {
    return (
      <div className={classes.loader}>
        <FetchingLoader>
              Fetching query with id {id} ...
        </FetchingLoader>
      </div>
    );
  }

  if (queryBuilderStore.fetchQueryError) {
    return (
      <BGMessage icon={"ban"}>
        {queryBuilderStore.fetchQueryError}
        <Button variant="primary" onClick={handleRetry}>
          <FontAwesomeIcon icon={"redo-alt"} />&nbsp;&nbsp; Retry
        </Button>
      </BGMessage>
    );
  }

  if(queryBuilderStore.hasRootSchema) {
    return (
      <div className={classes.container}>
        <Tabs />
        <div className={classes.body}>
          <View mode={queryBuilderStore.mode} />
        </div>
        <SavingMessage />
        <SaveError />
        <CompareChangesModal />
      </div>
    );
  }

  return null;
});

export default Query;