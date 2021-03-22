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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useStores } from "../../Hooks/UseStores";

import BGMessage from "../../Components/BGMessage";
import FetchingLoader from "../../Components/FetchingLoader";
import Result from "../Query/QueryExecution/Result";
import ExecutionParams from "../Query/QueryExecution/ExecutionParams";

const useStyles = createUseStyles({
  container:{
    position:"relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    gridGap: "10px",
    height: "100%",
    padding:"10px",
    "& select$input:hover": {
      backgroundColor: "var(--bg-color-ui-contrast2)"
    }
  },
  params: {
    color:"var(--ft-color-loud)",
    background:"var(--bg-color-ui-contrast3)",
    border: "1px solid var(--border-color-ui-contrast1)",
    padding:"10px"

  },
  result: {
    color:"var(--ft-color-loud)",
    background:"var(--bg-color-ui-contrast3)",
    border: "1px solid var(--border-color-ui-contrast1)",
    padding:"10px"
  },
  input: {
    color: "var(--ft-color-loud)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  },
  fetchingPanel: {
    width: "100%",
    height: "100%",
    zIndex: 10000,
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

const QueryExecution = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handlExecuteQuery = () => queryBuilderStore.executeQuery();

  const handlClearError = () => queryBuilderStore.setRunError(null);

  return (
    <div className={classes.container}>
      <div className={classes.params}>
        <ExecutionParams />
      </div>
      <Result />
      {queryBuilderStore.runError && (
        <BGMessage icon={"ban"}>
          There was a network problem fetching the query.<br/>
          If the problem persists, please contact the support.<br/>
          <small>{queryBuilderStore.runError}</small><br/><br/>
          {queryBuilderStore.isQueryEmpty?
            <Button variant="primary" onClick={handlClearError}>
              <FontAwesomeIcon icon={"redo-alt"}/>&nbsp;&nbsp; OK
            </Button>
            :
            <Button variant="primary" onClick={handlExecuteQuery}>
              <FontAwesomeIcon icon={"redo-alt"}/>&nbsp;&nbsp; Retry
            </Button>
          }
        </BGMessage>
      )}
      {queryBuilderStore.isRunning && (
        <div className={classes.fetchingPanel}>
          <FetchingLoader>
              Fetching query...
          </FetchingLoader>
        </div>
      )}
    </div>
  );

});
QueryExecution.displayName = "QueryExecution";

export default QueryExecution;