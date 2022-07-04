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
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRedoAlt} from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import ReactPiwik from "react-piwik";
import { useNavigate, useParams } from "react-router-dom";

import { useStores } from "../Hooks/UseStores";

import Tabs from "./Query/Tabs";
import QueryBuilder from "./Query/QueryBuilder";
import QueryEditor from "./Query/QueryEditor";
import QueryExecution from "./Query/QueryExecution";
import CompareChangesModal from "./Query/CompareChangesModal";
import SaveError from "./Query/SaveError";
import SavingMessage from "./Query/SavingMessage";
import DeleteError from "./Query/DeleteError";
import DeletingMessage from "./Query/DeletingMessage";
import SpinnerPanel from "../Components/SpinnerPanel";
import ErrorPanel from "../Components/ErrorPanel";

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

const Query = observer(({ mode }) => {

  const classes = useStyles();
  
  const params = useParams();
  const { id } = params;

  const navigate = useNavigate();

  const { queryBuilderStore, typeStore } = useStores();

  const selectQuery = async () => {
    if (id != queryBuilderStore.queryId) {
      let query = queryBuilderStore.findQuery(id);
      if(!query) {
        await queryBuilderStore.fetchQuery(id);
        query = queryBuilderStore.findQuery(id);
      }
      if(query) {
        const typeName = query.meta.type;
        if (localStorage.getItem("type")) {
          localStorage.setItem("type", typeName);
        }
        const type = typeStore.types[typeName];
        if(type) {
          queryBuilderStore.selectRootSchema(type);
          queryBuilderStore.selectQuery(query);
        } else {
          const unknownType = typeName?typeName:"<undefined>";
          const unknownSchema = {
            id: unknownType,
            label: unknownType,
            canBe: typeName?[typeName]:[]
          };
          queryBuilderStore.selectRootSchema(unknownSchema);
          queryBuilderStore.selectQuery(query);
          if (mode !== "edit") {
            navigate(`/queries/${id}/edit`)
          }
        }
      }
    }
  };

  useEffect(() => {
    ReactPiwik.push(["setCustomUrl", window.location.href]);
    ReactPiwik.push(["trackPageView"]);
    selectQuery();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleContinue = () => {
    queryBuilderStore.clearQuery();
    navigate("/");
  };

  if (queryBuilderStore.isFetchingQuery) {
    return (
      <SpinnerPanel text={`Fetching query with id ${id} ... `} />
    );
  }

  if (queryBuilderStore.fetchQueryError) {
    return (
      <ErrorPanel>
        {queryBuilderStore.fetchQueryError}<br /><br />
        <Button variant="primary" onClick={selectQuery}>
          <FontAwesomeIcon icon={faRedoAlt} />&nbsp;&nbsp; Retry
        </Button>
        <Button variant={"primary"} onClick={handleContinue}>Continue</Button>
      </ErrorPanel>
    );
  }

  if(queryBuilderStore.hasRootSchema && queryBuilderStore.queryId) {
    return (
      <div className={classes.container}>
        <Tabs mode={mode} />
        <div className={classes.body}>
          <View mode={mode} />
        </div>
        <SavingMessage />
        <SaveError />
        <DeletingMessage />
        <DeleteError />
        <CompareChangesModal />
      </div>
    );
  }

  return null;
});

export default Query;