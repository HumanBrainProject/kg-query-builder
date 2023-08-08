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

import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import {faCircle} from '@fortawesome/free-solid-svg-icons/faCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef} from 'react';
import { createUseStyles } from 'react-jss';

import Icon from '../../../Components/Icon';

import useStores from '../../../Hooks/useStores';
import Matomo from '../../../Services/Matomo';
import type { Type as TypeType} from '../../../types';
import type {KeyboardEvent, RefObject} from 'react';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    margin: '4px 1px',
    padding: '15px 10px',
    color: 'var(--ft-color-loud)',
    fontSize: '1.2em',
    fontWeight: 'normal',
    cursor: 'pointer',
    transition: 'background .3s ease-in-out',
    background: 'rgba(0,0,0,0.4)',
    '& small': {
      color: 'var(--ft-color-quiet)',
      fontStyle: 'italic'
    },
    '&:hover, &$selected': {
      background: 'linear-gradient(90deg, rgba(30,60,70,0.9) 0%, rgba(20,50,60,0.9) 100%)',
      '& $nextIcon': {
        color: 'var(--ft-color-loud)'
      }
    }
  },
  selected: {},
  nextIcon: {
    position: 'absolute',
    top: '16px',
    right: '15px',
    color: 'var(--ft-color-quiet)'
  }
});

const getTypeLabel = (type: TypeType) => {
  if (!type) {
    return '';
  }
  if (type.label) {
    return type.label;
  }
  if (!type.id) {
    return '';
  }
  const parts = type.id.split('/');
  return parts[parts.length-1];
};

interface TypeProps {
  type: TypeType;
  enableFocus: boolean;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void
}

const Type = observer(({ type, enableFocus, onKeyDown }: TypeProps) =>  {

  const classes = useStyles();

  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (enableFocus && ref.current) {
      ref.current.focus();
    }
  });


  const { queryBuilderStore, queriesStore } = useStores();

  const selectType = () => {
    if (type.id !== queryBuilderStore.typeId) {
      Matomo.trackEvent('Type', 'Select', type.id);
      localStorage.setItem('type', type.id);
      queriesStore.toggleShowSavedQueries(false);
      queriesStore.clearQueries();
      queryBuilderStore.setType(type);
    }
  };

  const handleClick = () => selectType();

  const handleKeyDown= (e: KeyboardEvent<HTMLDivElement>) => {
    if(e.key === 'Enter') {
      selectType();
    }
    onKeyDown(e);
  };

  const label = getTypeLabel(type);

  return (
    <div tabIndex={-1} ref={ref as RefObject<HTMLDivElement>} className={`${classes.container} ${type.id === queryBuilderStore.typeId?classes.selected:''}`} onClick={handleClick} onKeyDown={handleKeyDown}>
      <Icon icon={faCircle} color={type.color}/>
      {label} - <small>{type.id}</small>
      <div className={classes.nextIcon} >
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      </div>
    </div>
  );
});
Type.displayName = 'Type';

export default Type;