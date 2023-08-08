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

import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { createUseStyles } from 'react-jss';
import type { QuerySpecification } from '../../../../../Types/QuerySpecification';
import type { ChangeEvent } from 'react';

const useStyles = createUseStyles({
  container: {
    paddingTop: '10px',
    marginBottom: '20px',
    '&:last-child': {
      marginTop: '10px',
      marginBottom: '10px'
    }
  },
  panel: {
    position: 'relative',
    padding: '10px',
    border: '1px solid rgb(108, 117, 125)',
    '&:after': {
      content: '"Filter"',
      position: 'absolute',
      top: '-11px',
      left: '5px',
      backgroundColor: '#282828',
      padding: '0 5px'
    }
  },
  select: {
    display: 'inline-block',
    minWidth: '180px',
    padding: '0.25rem 20px 0.25rem 6px',
    borderRadius: '4px',
    backgroundColor: 'rgb(108, 117, 125)',
    borderColor: 'transparent',
    color: 'white',
    '-webkit-appearance': 'none',
    '&:hover': {
      outline: 0,
      backgroundColor: '#5a6268',
      borderColor: 'rgba(64, 169, 243, 0.5)',
      boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
    }
  },
  selectBox: {
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      right: '10px',
      width: 0,
      height: 0,
      marginTop: '-3px',
      borderTop: '6px solid white',
      borderRight: '6px solid transparent',
      borderLeft: '6px solid transparent',
      pointerEvents: 'none'
    }
  },
  inputRow: {
    display: 'flex',
    marginTop: '10px'
  },
  label: {
    width: '75px',
    lineHeight: '2.2rem',
    textAlign: 'right'
  },
  input: {
    flex: 1,
    color: 'var(--ft-color-loud) !important',
    width: 'calc(100% - 20px)',
    border: '1px solid transparent',
    borderRadius: '2px',
    backgroundColor: 'var(--bg-color-blend-contrast1)',
    marginRight: '4px',
    '&:focus': {
      color: 'var(--ft-color-loud)',
      borderColor: 'rgba(64, 169, 243, 0.5)',
      backgroundColor: 'transparent'
    }
  },
  addButton: {
    display: 'block',
    marginLeft: '15px',
    borderRadius: '15px',
    padding: '3px 9px'
  },
  addFilterButton: {
    display: 'block',
    borderRadius: '15px',
    padding: '3px 9px'
  },
  deleteButton: {
    '-webkit-appearance': 'none',
    backgroundColor: 'rgb(108, 117, 125)',
    borderColor: 'transparent',
    borderRadius: '50%',
    color: 'white',
    padding: '3px 9px',
    transform: 'scale(0.8)',
    '&:hover': {
      backgroundColor: '#5a6268',
      borderColor: '#5a6268'
    }
  },
  warning: {
    color: 'var(--ft-color-error)',
    marginRight: '35px'
  }
});

interface FilterProps {
  filter?: QuerySpecification.FilterItem;
  show: boolean;
  onChange: (op: string, value?: QuerySpecification.FilterItem) => void;
}

const Filter = observer(({ filter, show, onChange }: FilterProps) => {
  const classes = useStyles();

  const handleAddFilter = () => {
    const value = {
      op: 'CONTAINS',
      value: ''
    };
    onChange('filter', value);
  };

  const handleChangeOp = (e: ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
    case 'NONE': {
      onChange('filter', undefined);
      break;
    }
    case 'IS_EMPTY': {
      const value = {
        op: e.target.value
      };
      onChange('filter', value);
      break;
    }
    default: {
      const f = filter as QuerySpecification.FilterItem;
      const value = {
        op: e.target.value,
        parameter: f.parameter,
        value: f.op === 'IS_EMPTY' ? '' : f.value
      };
      onChange('filter', value);
    }
    }
  };

  const handleAddValue = () => {
    const f = filter as QuerySpecification.FilterItem;
    const value = {
      op: f.op,
      parameter: f.parameter,
      value: ''
    };
    onChange('filter', value);
  };

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const f = filter as QuerySpecification.FilterItem;
    const value = {
      op: f.op,
      parameter: f.parameter,
      value: e.target.value
    };
    onChange('filter', value);
  };

  const handleDeleteValue = () => {
    const f = filter as QuerySpecification.FilterItem;
    const value =
      f.parameter !== undefined
        ? {
          op: f.op,
          parameter: f.parameter
        }
        : undefined;
    onChange('filter', value);
  };

  const handleAddParameter = () => {
    const f = filter as QuerySpecification.FilterItem;
    const value = {
      op: f.op,
      parameter: '',
      value: f.value
    };
    onChange('filter', value);
  };

  const handleChangeParameter = (e: ChangeEvent<HTMLInputElement>) => {
    const f = filter as QuerySpecification.FilterItem;
    const value = {
      op: f.op,
      parameter: e.target.value,
      value: f.value
    };
    onChange('filter', value);
  };

  const handleDeleteParameter = () => {
    const f = filter as QuerySpecification.FilterItem;
    const value =
      f.value !== undefined
        ? {
          op: f.op,
          value: f.value
        }
        : undefined;
    onChange('filter', value);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={classes.container}>
      {!filter || filter.op === 'NONE' ? (
        <Button
          variant="secondary"
          className={classes.addFilterButton}
          onClick={handleAddFilter}
        >
          <FontAwesomeIcon icon={faPlus} />&nbsp;add filter
        </Button>
      ) : (
        <div className={classes.panel}>
          <div className={classes.inputRow}>
            <div className={classes.selectBox}>
              <select
                title="comparison operator"
                className={classes.select}
                value={filter.op}
                onChange={handleChangeOp}
              >
                <option value="NONE">None</option>
                <option value="IS_EMPTY">Is empty</option>
                <option value="CONTAINS">Contains</option>
                <option value="EQUALS">Equals</option>
                <option value="STARTS_WITH">Starts with</option>
                <option value="ENDS_WITH">Ends with</option>
                <option value="REGEX">Regex</option>
              </select>
            </div>
            {filter.parameter === undefined && filter.op !== 'IS_EMPTY' && (
              <Button
                variant="secondary"
                className={classes.addButton}
                onClick={handleAddParameter}
              >
                <FontAwesomeIcon icon={faPlus} />&nbsp;add
                parameter
              </Button>
            )}
            {filter.value === undefined && filter.op !== 'IS_EMPTY' && (
              <Button
                variant="secondary"
                className={classes.addButton}
                onClick={handleAddValue}
              >
                <FontAwesomeIcon icon={faPlus} />&nbsp;add value
              </Button>
            )}
          </div>
          {filter.parameter !== undefined && (
            <>
              <div className={classes.inputRow}>
                <span className={classes.label}>Parameter:&nbsp;</span>
                <Form.Control
                  className={classes.input}
                  type="text"
                  value={filter.parameter}
                  placeholder=""
                  onChange={handleChangeParameter}
                />
                <button
                  className={classes.deleteButton}
                  onClick={handleDeleteParameter}
                  title="delete parameter"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              {['scope', 'size', 'start', 'instanceId'].includes(
                filter.parameter
              ) && (
                <div className={classes.inputRow}>
                  <span className={classes.label} />
                  <span className={classes.warning}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    &nbsp;&quot;{filter.parameter}&quot; is a reserved parameter
                    name and should not be used!
                  </span>
                </div>
              )}
            </>
          )}
          {filter.value !== undefined && (
            <div className={classes.inputRow}>
              <span className={classes.label}>Value:&nbsp;</span>
              <Form.Control
                className={classes.input}
                type="text"
                value={filter.value}
                placeholder=""
                onChange={handleChangeValue}
              />
              <button
                className={classes.deleteButton}
                onClick={handleDeleteValue}
                title="delete value"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
Filter.displayName = 'Filter';

export default Filter;
