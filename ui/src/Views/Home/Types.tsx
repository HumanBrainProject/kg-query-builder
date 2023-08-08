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
import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { createUseStyles } from 'react-jss';

import Filter from '../../Components/Filter';
import useStores from '../../Hooks/useStores';

import List from './Types/List';
import type { KeyboardEvent} from 'react';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    height: '100%',
    width: '100%',
    background: 'transparent',
    color: 'var(--ft-color-normal)',
    border: '1px solid var(--border-color-ui-contrast2)',
    overflow: 'hidden'
  },
  filter: {
    border: 0,
    background:
      'linear-gradient(90deg, rgba(20,50,60,0.2) 0%, rgba(20,50,60,0.4) 100%)'
  },
  body: {
    borderTop: '1px solid var(--border-color-ui-contrast2)',
    padding: '10px 0',
    background:
      'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
  },
  content: {
    padding: '0 10px'
  }
});

const Types = observer(() => {
  const [cursor, setCursor] = useState<number>();

  const classes = useStyles();

  const { typeStore } = useStores();

  const handleChange = (value: string) => {
    typeStore.setFilterValue(value);
    setCursor(undefined);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (cursor === undefined && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      setCursor(0);
    }
    if (e.key === 'ArrowUp' && cursor !== undefined && cursor > 0) {
      setCursor(prevCursor =>
        prevCursor !== undefined ? prevCursor - 1 : prevCursor
      );
    } else if (
      e.key === 'ArrowDown' &&
      cursor !== undefined &&
      cursor < typeStore.filteredTypeList.length - 1
    ) {
      setCursor(prevCursor =>
        prevCursor !== undefined ? prevCursor + 1 : prevCursor
      );
    }
  };

  return (
    <div className={classes.container}>
      <Filter
        className={classes.filter}
        value={typeStore.filterValue}
        placeholder="Filter types"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className={classes.body}>
        <Scrollbars autoHide>
          <div className={classes.content}>
            <List cursor={cursor} onKeyDown={handleKeyDown} />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
});
Types.displayName = 'Types';

export default Types;
