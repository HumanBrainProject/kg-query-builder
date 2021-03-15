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
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";


import { useStores } from "../Hooks/UseStores";

import Types from "./QueryBuilder/Types";
import Query from "./QueryBuilder/Query";
import QueryPanels from "./QueryBuilder/QueryPanels";

const useStyles = createUseStyles({
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
  panel: {
    position: "absolute",
    width: "100%",
    height: "100%",
    transition: "transform 0.5s cubic-bezier(.34,1.06,.63,.93)"
  },
  layout: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100%",
    padding: "10px"
  },
  header: {
    position: "relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    fontSize: "1.2em",
    marginBottom: "10px",
    padding: "15px 10px",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    }
  },
  title: {
    marginLeft: "35px"
  },
  closeQueryButton: {
    "-webkit-appearance": "none",
    position: "absolute",
    top: "14px",
    left: "9px",
    background: "transparent",
    border: 0,
    boxShadow: "none",
    color: "var(--ft-color-quiet)",
    outline: "none",
    "&:hover": {
      color: "var(--ft-color-loud)"
    },
    "&:focus": {
      outline: "none"
    }
  },
  body: {
    position: "relative",
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "10px",
    height: "100%"
  }
});

const QueryBuilder = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  return (
    <div className={classes.panel}>
      <div className={classes.layout}>
        <div className={classes.header}>
          <div className={classes.title}>
            <Types types={queryBuilderStore.rootSchema.canBe} /> - <small>{queryBuilderStore.rootSchema.id}</small>
          </div>
        </div>
        <div className={classes.body}>
          <Query />
          <QueryPanels />
        </div>
      </div>
    </div>
  );
});
QueryBuilder.displayName = "QueryBuilder";

export default QueryBuilder;