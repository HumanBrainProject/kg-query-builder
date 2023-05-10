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

import React, { useEffect, useMemo, useState } from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRedoAlt} from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import { useNavigate, useParams } from "react-router-dom";

import useStores from "../Hooks/useStores";
import Matomo from "../Services/Matomo";
import { Type } from "../types";
import useGetQueryQuery from "../Hooks/useGetQueryQuery";

import Tabs from "./Query/Tabs";
import QueryBuilder from "./Query/QueryBuilder";
import QueryEditor from "./Query/QueryEditor";
import QueryExecution from "./Query/QueryExecution";
import SpinnerPanel from "../Components/SpinnerPanel";
import ErrorPanel from "../Components/ErrorPanel";


const useStyles = createUseStyles({
  container: {
    display: "grid",
    height: "100%",
    gridTemplateRows: "100%",
    gridTemplateColumns: "50px 1fr",
    "& .spinnerPanel": {
      background: "#0a2332"
    }
  },
  body: {
    position: "relative",
    overflow: "hidden"
  }
});

interface ModeProps {
  mode: string;
}

const View = ({mode}:ModeProps) => {
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

const Query = observer(({ mode }:ModeProps) => {

  const classes = useStyles();
  
  const params = useParams();
  const { id } = params;
  const queryId = id as string;

  const navigate = useNavigate();

  const { queryBuilderStore, queriesStore, typeStore } = useStores();

  const cachedQueries = useMemo(() => toJS(queriesStore.queries), [queriesStore.queries]);

  const {
    data: query,
    error,
    isUninitialized,
    isFetching,
    isError,
    isAvailable,
    refetch,
  } = useGetQueryQuery(queryId, cachedQueries);


  const [isNotFound, setNotFound] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    if (isFetching) {
      setNotFound(undefined);
    } else if (isAvailable) {
      if (queryBuilderStore.typeId) {
        Matomo.setCustomUrl(window.location.href);
        Matomo.trackPageView();
        setNotFound(false);
        queryBuilderStore.setAsNewQuery(queryId);
      } else {
        setNotFound(true);
      }
    } else if (query) {
      Matomo.setCustomUrl(window.location.href);
      Matomo.trackPageView();
      const typeName = query.meta.type;
        if (localStorage.getItem("type")) {
          localStorage.setItem("type", typeName?typeName:"");
        }
        const type = typeName && typeStore.types.get(typeName);
        if(type) {
          queryBuilderStore.setType(type);
          queryBuilderStore.selectQuery(query);
        } else {
          const typeId = typeName?typeName:"<undefined>";
          const unknownType = {
            id: typeId,
            label: typeId,
            color: "black",
            description: "",
            properties: []
          } as Type;
          queryBuilderStore.setType(unknownType);
          queryBuilderStore.selectQuery(query);
          if (mode !== "edit") {
            navigate(`/queries/${id}/edit`)
          }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId, query, isAvailable]);

  const handleContinue = () => {
    queryBuilderStore.clearQuery();
    navigate("/");
  };

  if (isUninitialized || isFetching) {
    return (
      <SpinnerPanel text={`Fetching query with id ${id} ... `} />
    );
  }

  if (isError || isNotFound) {
    return (
      <ErrorPanel>
        {isError?error:`Query id "${queryId}" does not exist`}<br /><br />
        <Button variant="primary" onClick={refetch}>
          <FontAwesomeIcon icon={faRedoAlt} />&nbsp;&nbsp; Retry
        </Button>
        <Button variant={"primary"} onClick={handleContinue}>Continue</Button>
      </ErrorPanel>
    );
  }

  if (isAvailable && isNotFound === undefined) {
    return null;
  }

  if(queryBuilderStore.hasType && queryBuilderStore.queryId) {
    return (
      <div className={classes.container}>
        <Tabs mode={mode} />
        <div className={classes.body}>
          <View mode={mode} />
        </div>
      </div>
    );
  }

  return null;
});

export default Query;