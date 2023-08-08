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

import {faBan} from '@fortawesome/free-solid-svg-icons/faBan';
import {faRedoAlt} from '@fortawesome/free-solid-svg-icons/faRedoAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { createUseStyles } from 'react-jss';


import BGMessage from '../../Components/BGMessage';
import SpinnerPanel from '../../Components/SpinnerPanel';
import useAPI from '../../Hooks/useAPI';
import useStores from '../../Hooks/useStores';
import Matomo from '../../Services/Matomo';
import ExecutionParams from './QueryExecution/ExecutionParams';
import ExecutionResult from './QueryExecution/ExecutionResult';
import type { APIError } from '../../Services/API';
import type { QueryExecutionResult } from '../../types';
import type jsonld from 'jsonld';

const useStyles = createUseStyles({
  container:{
    position:'relative',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridGap: '10px',
    height: '100%',
    padding:'10px',
    '& select$input:hover': {
      backgroundColor: 'var(--bg-color-ui-contrast2)'
    }
  },
  params: {
    color:'var(--ft-color-loud)',
    background: 'linear-gradient(90deg, rgba(5,25,35,0.4) 0%, rgba(5,20,35,0.8) 100%)',
    border: '1px solid var(--border-color-ui-contrast1)',
    padding:'10px'

  },
  result: {
    color:'var(--ft-color-loud)',
    background:'var(--bg-color-ui-contrast3)',
    border: '1px solid var(--border-color-ui-contrast1)',
    padding:'10px'
  },
  input: {
    color: 'var(--ft-color-loud)',
    border: '1px solid transparent',
    borderRadius: '2px',
    backgroundColor: 'var(--bg-color-blend-contrast1)',
    '&:focus': {
      color: 'var(--ft-color-loud)',
      borderColor: 'rgba(64, 169, 243, 0.5)',
      backgroundColor: 'transparent'
    }
  },
  fetchingPanel: {
    width: '100%',
    height: '100%',
    zIndex: 10000,
    '& .fetchingPanel': {
      width: 'auto',
      padding: '30px',
      border: '1px solid var(--border-color-ui-contrast1)',
      borderRadius: '4px',
      color: 'var(--ft-color-loud)',
      background: 'var(--list-bg-hover)'
    }
  }
});

const QueryExecution = observer(() => {

  const classes = useStyles();

  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string|undefined>();
  const [result, setResult] = useState<QueryExecutionResult|undefined>();

  const API = useAPI();

  const { queryBuilderStore, queryRunStore } = useStores();

  const executeQuery = async () => {
    if (!queryBuilderStore.isQueryEmpty && !isRunning) {
      setIsRunning(true);
      setError(undefined);
      setResult(undefined);
      Matomo.trackEvent('Query', 'Execute', queryBuilderStore.isQuerySaved?queryBuilderStore.queryId:'unsaved query');
      try {
        const query = queryBuilderStore.querySpecification;
        const instanceId =
          typeof queryRunStore.instanceId === 'string'
            ? queryRunStore.instanceId.trim()
            : null;
        const params = queryBuilderStore.queryParametersNames.reduce((acc, name) => {
          if (typeof queryRunStore.parameters[name]?.value === 'string' && queryRunStore.parameters[name].value) {
            acc[name] = queryRunStore.parameters[name].value;
          }
          return acc;
        }, {} as jsonld.NodeObject);
        const data = await API.performQuery(
          query,
          queryRunStore.stage,
          queryRunStore.start,
          queryRunStore.size,
          instanceId ? instanceId : undefined,
          queryRunStore.spaces,
          params
        );
        setResult(data);
        setIsRunning(false);
      } catch (e) {
        const error = e as APIError;
        const message = error?.message;
        setResult(undefined);
        setError(`Error while executing query (${message})`);
        setIsRunning(false);
      }
    }
  };

  const handlClearError = () => setError(undefined);

  return (
    <div className={classes.container}>
      <div className={classes.params}>
        <ExecutionParams onExecute={executeQuery} />
      </div>
      <ExecutionResult data={result} />
      {error && (
        <BGMessage icon={faBan}>
          There was a network problem fetching the query.<br/>
          If the problem persists, please contact the support.<br/>
          <small>{error}</small><br/><br/>
          {queryBuilderStore.isQueryEmpty?
            <Button variant={'primary'} onClick={handlClearError}>
              <FontAwesomeIcon icon={faRedoAlt}/>&nbsp;&nbsp; OK
            </Button>
            :
            <Button variant={'primary'} onClick={executeQuery}>
              <FontAwesomeIcon icon={faRedoAlt}/>&nbsp;&nbsp; Retry
            </Button>
          }
        </BGMessage>
      )}
      {isRunning && (
        <SpinnerPanel text="Fetching query..." />
      )}
    </div>
  );

});
QueryExecution.displayName = 'QueryExecution';

export default QueryExecution;