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

import { observer } from 'mobx-react-lite';
import React from 'react';
import { createUseStyles } from 'react-jss';

import useStores from '../../../Hooks/useStores';
import Links from './Links';
import SpaceForm from './SpaceForm';
import Vocab from './Vocab';

import type { ChangeEvent } from 'react';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    background:
      'linear-gradient(135deg, rgba(5,25,35,0.4) 0%, rgba(5,20,35,0.6) 100%)',
    border: '1px solid var(--border-color-ui-contrast1)',
    color: 'var(--ft-color-loud)',
    padding: '10px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    '& h5': {
      margin: 0
    },
    '& $input': {
      flex: 1,
      marginLeft: '3px'
    }
  },
  description: {
    marginTop: '20px',
    '& h5': {
      display: 'inline-block',
      marginTop: 0,
      marginBottom: '8px'
    },
    '& $input': {
      minWidth: '100%',
      maxWidth: '100%',
      minHeight: '10rem'
    }
  },
  space: {
    marginTop: '20px'
  },
  input: {
    borderRadius: '2px',
    backgroundColor: 'var(--bg-color-blend-contrast1)',
    color: 'var(--ft-color-loud)',
    width: '100%',
    border: '1px solid transparent',
    '&:focus': {
      color: 'var(--ft-color-loud)',
      borderColor: 'rgba(64, 169, 243, 0.5)',
      backgroundColor: 'transparent'
    },
    '&.disabled,&:disabled': {
      backgroundColor: 'var(--bg-color-blend-contrast1)',
      color: 'var(--ft-color-normal)',
      cursor: 'text'
    }
  },
  vocab: {
    '&:not(:first-child)': {
      marginTop: '20px'
    }
  },
  author: {
    marginTop: '6px',
    color: 'var(--ft-color-normal)'
  },
  links: {
    marginTop: '10px',
    color: 'var(--ft-color-normal)',
    '& a, & a:visited, &a:active': {
      color: 'var(--ft-color-loud)',
      '&:hover': {
        color: 'var(--ft-color-louder)'
      }
    }
  }
});

interface QueryFormProps {
  className: string;
}

const QueryForm = observer(({ className }: QueryFormProps) => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => queryBuilderStore.setLabel(e.target.value);

  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) =>
    queryBuilderStore.setDescription(e.target.value);

  const handleChangeVocab = (value?:string) => value && queryBuilderStore.setResponseVocab(value);

  return (
    <div className={`${classes.container} ${className ? className : ''}`}>
      {(queryBuilderStore.isQuerySaved || queryBuilderStore.saveAsMode) && (
        <React.Fragment>
          <div className={classes.label}>
            <h5>Label :</h5>
            <input
              className={`form-control ${classes.input}`}
              disabled={
                !(
                  queryBuilderStore.saveAsMode || queryBuilderStore.canSaveQuery
                )
              }
              placeholder={''}
              type="text"
              value={queryBuilderStore.label}
              onChange={handleChangeLabel}
            />
          </div>
          <div className={classes.description}>
            <h5>Description :</h5>
            <textarea
              className={`form-control ${classes.input}`}
              disabled={
                !(
                  queryBuilderStore.saveAsMode || queryBuilderStore.canSaveQuery
                )
              }
              placeholder={''}
              value={queryBuilderStore.description}
              onChange={handleChangeDescription}
            />
          </div>
          <SpaceForm className={classes.space} />
        </React.Fragment>
      )}
      <div className={classes.vocab}>
        <Vocab
          defaultValue={queryBuilderStore.defaultResponseVocab}
          value={!!queryBuilderStore.responseVocab}
          onChange={handleChangeVocab}
        />
      </div>
      <Links />
    </div>
  );
});
QueryForm.displayName = 'QueryForm';

export default QueryForm;
