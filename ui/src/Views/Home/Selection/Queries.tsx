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

import React, { ChangeEvent, useEffect } from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import { Scrollbars } from "react-custom-scrollbars-2";

import { useStores } from "../../../Hooks/UseStores";

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
  className: string;
}

const Queries = observer(({ className }: QueriesProps) => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  useEffect(() => {
    if (queryBuilderStore.hasRootSchema) {
      queryBuilderStore.fetchQueries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryBuilderStore.hasRootSchema]);

  const handleFetchSavedQueries = () => queryBuilderStore.fetchQueries();

  const handleChange = (value: ChangeEvent<HTMLInputElement>) => queryBuilderStore.setQueriesFilterValue(value);

  if (!queryBuilderStore.hasRootSchema) {
    return null;
  }

  if (queryBuilderStore.fetchQueriesError) {
    return (
      <ErrorPanel>
        {queryBuilderStore.fetchQueriesError}
        <br />
        <br />
        <Button variant="primary" onClick={handleFetchSavedQueries}>
          <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Refresh
        </Button>
      </ErrorPanel>
    );
  }

  if (queryBuilderStore.isFetchingQueries) {
    return (
      <Spinner>
        Fetching queries for {queryBuilderStore.rootSchema.label}...
      </Spinner>
    );
  }

  if (!queryBuilderStore.isQueriesFetched) {
    return null;
  }

  if (!queryBuilderStore.hasQueries) {
    return (
      <ErrorPanel>
        No saved queries available yet for {queryBuilderStore.rootSchema.label}
        <small> - {queryBuilderStore.rootSchema.id}</small>
        <br />
        <br />
        <Button variant="primary" onClick={handleFetchSavedQueries}>
          <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Retry
        </Button>
      </ErrorPanel>
    );
  }

  return (
    <div className={`${classes.panel} ${className ? className : ""}`}>
      <Filter
        className={classes.filter}
        value={queryBuilderStore.queriesFilterValue}
        placeholder="Filter queries"
        onChange={handleChange}
      />
      <div className={classes.body}>
        <Scrollbars autoHide>
          <div className={classes.content}>
            {queryBuilderStore.groupedFilteredQueries.map(group => (
              <List
                key={group.name}
                title={group.label}
                list={group.queries}
                showUser={group.showUser}
                enableDelete={group.permissions.canDelete}
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
