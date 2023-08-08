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
import type { ChangeEvent } from 'react';

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: '20px',
    '&:last-child': {
      marginBottom: 0
    }
  },
  select: {
    display: 'inline-block',
    minWidth: '140px',
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
  label: {
    lineHeight: '1.7rem',
    marginRight: '6px'
  }
});

interface SingleItemStrategyProps {
  strategy: string;
  show: boolean;
  onChange: (name: string, value?: string) => void;
}

const SingleItemStrategy = observer(
  ({ strategy, show, onChange }: SingleItemStrategyProps) => {
    const classes = useStyles();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === 'NONE' ? undefined : e.target.value;
      onChange('singleValue', value);
    };

    if (!show) {
      return null;
    }

    const selectedValue = strategy === undefined ? 'NONE' : strategy;

    return (
      <div className={classes.container}>
        <span className={classes.label}>Single item strategy:&nbsp;</span>
        <div className={classes.selectBox}>
          <select
            title="Single item strategy"
            className={classes.select}
            value={selectedValue}
            onChange={handleChange}
          >
            <option value="NONE">None</option>
            <option value="FIRST">First</option>
            <option value="CONCAT">Concat</option>
          </select>
        </div>
      </div>
    );
  }
);
SingleItemStrategy.displayName = 'SingleItemStrategy';

export default SingleItemStrategy;
