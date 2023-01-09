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

import React, { useState, useEffect, useRef } from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { AxiosError } from "axios";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRedoAlt} from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import { useNavigate, useParams } from "react-router-dom";

import { useStores } from "../Hooks/UseStores";

import Tabs from "./Query/Tabs";
import QueryBuilder from "./Query/QueryBuilder";
import QueryEditor from "./Query/QueryEditor";
import QueryExecution from "./Query/QueryExecution";
import SpinnerPanel from "../Components/SpinnerPanel";
import ErrorPanel from "../Components/ErrorPanel";

import API from "../Services/API";
import { Type } from "../Stores/Type";
import { Query as QuerySpecs } from "../Stores/Query";

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

  const queryIdRef = useRef<string|undefined>(undefined);

  const classes = useStyles();
  
  const params = useParams();
  const { id } = params;

  const navigate = useNavigate();

  const { queryBuilderStore, queriesStore, typeStore, transportLayer } = useStores();

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string|undefined>(undefined);

  const fetchQuery = async (queryId: string) => {
    if (queriesStore.findQuery(queryId) || isFetching) {
      return;
    }
    setIsFetching(true);
    setError(undefined);
    try {
      const response = await transportLayer.getQuery(queryId);
      const jsonSpecification =
        response && response.data ? response.data : null;
      try {
        const query = await QuerySpecs.normalizeQuery(jsonSpecification);
        queriesStore.addQuery(query);
      } catch (e) {
        setError(`Error while trying to expand/compact JSON-LD (${e})`);
      }
      setIsFetching(false);
    } catch (e) {
      const error = e as AxiosError;
      const { response } = error;
      const status = response?.status;
      const message = error?.message;
      setIsFetching(false);
      switch (status) {
        case 401: // Unauthorized
        case 403: {
          // Forbidden
          setError(`You do not have permission to access the query with id "${queryId}"`);
          break;
        }
        case 404: {
          if (queryBuilderStore.hasType) {
            // it's a new query created from ui
            queryBuilderStore.setAsNewQuery(queryId);
          } else {
            setError(`Query id "${queryId}" does not exist`);
          }
          break;
        }
        default: {
          setError(`Error while fetching query with id "${queryId}" (${message})`);
        }
      }
    }
  };

  const selectQuery = async () => {
    if (id && queryBuilderStore && id != queryBuilderStore.queryId) {
      let query = queriesStore.findQuery(id);
      if(!query) {
        await fetchQuery(id);
        query = queriesStore.findQuery(id);
      }
      if(query) {
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
          } as Type.Type;
          queryBuilderStore.setType(unknownType);
          queryBuilderStore.selectQuery(query);
          if (mode !== "edit") {
            navigate(`/queries/${id}/edit`)
          }
        }
      }
    }
  };

  useEffect(() => {
    if (!queryIdRef.current || queryIdRef.current !== id) {
      queryIdRef.current = id;
      API.setCustomUrl(window.location.href);
      API.trackPageView();
      selectQuery();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleContinue = () => {
    queryBuilderStore.clearQuery();
    navigate("/");
  };

  if (isFetching) {
    return (
      <SpinnerPanel text={`Fetching query with id ${id} ... `} />
    );
  }

  if (error) {
    return (
      <ErrorPanel>
        {error}<br /><br />
        <Button variant="primary" onClick={selectQuery}>
          <FontAwesomeIcon icon={faRedoAlt} />&nbsp;&nbsp; Retry
        </Button>
        <Button variant={"primary"} onClick={handleContinue}>Continue</Button>
      </ErrorPanel>
    );
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