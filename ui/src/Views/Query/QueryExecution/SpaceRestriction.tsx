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

import {observer} from 'mobx-react-lite';
import React from 'react';
import { createUseStyles } from 'react-jss';

import Toggle from '../../../Components/Toggle';
import useStores from '../../../Hooks/useStores';
import type { ToggleItemValue } from '../../../Components/Toggle/types';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    paddingBottom: '10px'
  },
  panel: {
    display: 'flex',
    padding: '10px 10px 0 10px',
    flexWrap: 'wrap',
    border: '1px solid var(--bg-color-ui-contrast4)',
    marginTop: '4px',
    maxHeight: '160px',
    overflowY: 'auto'
  },
  space: {
    display: 'inline-block',
    border: '1px solid var(--bg-color-ui-contrast4)',
    borderRadius: '20px',
    padding: '7px 4px 7px 10px',
    float: 'left',
    marginRight: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    maxHeight: '40px',
    minHeight: '40px',
    '-webkitTouchCallout': 'none',
    userSelect: 'none',
    transition: 'color .3s ease-in-out, border-color .3s ease-in-out',
    '&.selected, &:hover': {
      color: 'var(--ft-color-loud)',
      borderColor: 'var(--ft-color-loud)'
    }
  },
  toggle: {
    display: 'inline-block',
    paddingLeft: '6px'
  }
});

interface SpaceProps {
  space: {
    name: string;
    selected: boolean
  };
  onClick: (name: string, selected: boolean) => void
}

const Space = ({ space: {name, selected}, onClick }: SpaceProps) => {

  const classes = useStyles();

  const handleOnClick = () => onClick(name, !selected);

  const handleToggleClick = (_?:string, value?:ToggleItemValue) => onClick(name, !!(value as boolean|undefined));

  return(
    <div className={`${classes.space}  ${selected?'selected':''}`} onClick={handleOnClick} >
      {name}
      <div className={classes.toggle}>
        <Toggle
          option={{
            name: name,
            value: selected?true:undefined
          }}
          show={true}
          onChange={handleToggleClick} />
      </div>
    </div>
  );
};

const SpaceRestriction = observer(() => {

  const classes = useStyles();

  const { queryRunStore, spacesStore } = useStores();

  if (!Array.isArray(spacesStore.spaces) || !spacesStore.spaces.length) {
    return null;
  }

  const isRestricted = Array.isArray(queryRunStore.spaces);

  const spaces = isRestricted?spacesStore.spaces.map(space => ({
    name: space.name,
    selected: queryRunStore.spaces?queryRunStore.spaces.includes(space.name):false
  })):[];

  const handleToggleSpaceRestriction = (_?: string, value?: ToggleItemValue) => queryRunStore.setSpaces((value as boolean|undefined)?[]:undefined);

  const toggleSpace = (name: string, selected: boolean) => {
    if (selected) {
      if (queryRunStore.spaces && !queryRunStore.spaces.includes(name)) {
        queryRunStore.setSpaces([...queryRunStore.spaces, name]);
      }
    } else {
      if (queryRunStore.spaces && queryRunStore.spaces.includes(name)) {
        queryRunStore.setSpaces(queryRunStore.spaces.filter(space => space !== name));
      }
    }
  };

  return (
    <div className={classes.container}>
      <div>
        <Toggle
          label="Restrict to space(s)"
          option={{
            name: 'spaceRestriction',
            value: isRestricted?true:undefined
          }}
          show={true}
          onChange={handleToggleSpaceRestriction} />
      </div>
      {isRestricted && (
        <div className={classes.panel}>
          {spaces.map(space =>
            <Space key={space.name} space={space} onClick={toggleSpace} />)}
        </div>
      )}
    </div>
  );
});

export default SpaceRestriction;