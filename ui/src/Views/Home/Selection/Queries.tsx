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
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import { Scrollbars } from "react-custom-scrollbars-2";

import useStores from "../../../Hooks/useStores";
import useListQueriesQuery from "../../../Hooks/useListQueriesQuery";

import Spinner from "../../../Components/Spinner";
import ErrorPanel from "../../../Components/ErrorPanel";
import Filter from "../../../Components/Filter";
import List from "./Queries/List";

const useStyles = createUseStyles({
  panel: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    color: "var(--ft-color-normal)",
    border: "1px solid var(--border-color-ui-contrast2)",
    overflow: "hidden"
  },
  filter: {
    border: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)"
  },
  body: {
    borderTop: "1px solid var(--border-color-ui-contrast2)",
    padding: "0 0 10px 15px"
  },
  content: {
    paddingRight: "15px"
  }
});

interface QueriesProps {
  className?: string;
}

const Queries = observer(({ className }: QueriesProps) => {

  const classes = useStyles();

  const { queriesStore, queryBuilderStore } = useStores();

  const skip = queryBuilderStore.typeId === queriesStore.type;

  const {
    data: queries,
    error,
    isUninitialized,
    isFetching,
    isError,
    refetch,
  } = useListQueriesQuery(queryBuilderStore.typeId as string, skip);

  useEffect(() => {
    if (queries) {
      queriesStore.setQueries(queryBuilderStore.typeId, queries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  const handleChange = (value: string) => queriesStore.setFilter(value);

  if (!queryBuilderStore.hasType) {
    return null;
  }

  if (isError) {
    return (
      <ErrorPanel>
        {error}
        <br />
        <br />
        <Button variant="primary" onClick={refetch}>
          <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Refresh
        </Button>
      </ErrorPanel>
    );
  }

  if ((isUninitialized && !skip) || isFetching) {
    return (
      <Spinner>
        Fetching queries for {queryBuilderStore?.type?.label}...
      </Spinner>
    );
  }

  if (!queryBuilderStore.typeId || queryBuilderStore.typeId !== queriesStore.type) {
    return null;
  }

  if (!queriesStore.hasQueries) {
    return (
      <ErrorPanel>
        {queryBuilderStore.type ? `No saved queries available yet for ${queryBuilderStore.type.label}`: "No saved queries available"}
        {queryBuilderStore.type && <small> - {queryBuilderStore.type.id}</small>}
        <br />
        <br />
        <Button variant="primary" onClick={refetch}>
          <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Retry
        </Button>
      </ErrorPanel>
    );
  }

  return (
    <div className={`${classes.panel} ${className ? className : ""}`}>
      <Filter
        className={classes.filter}
        value={queriesStore.filter}
        placeholder="Filter queries"
        onChange={handleChange}
      />
      <div className={classes.body}>
        <Scrollbars autoHide>
          <div className={classes.content}>
            {queriesStore.groupedFilteredQueries.map(group => (
              <List
                key={group.name}
                title={group.label}
                list={group.queries}
              />
            ))}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
});
Queries.displayName = "Queries";

export default Queries;
