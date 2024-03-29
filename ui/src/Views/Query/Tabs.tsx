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

import {faCode} from '@fortawesome/free-solid-svg-icons/faCode';
import {faPlay} from '@fortawesome/free-solid-svg-icons/faPlay';
import {faTools} from '@fortawesome/free-solid-svg-icons/faTools';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {observer} from 'mobx-react-lite';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router-dom';
import useStores from '../../Hooks/useStores';

import Matomo from '../../Services/Matomo';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';

const useStyles = createUseStyles({
  tabs: {
    borderRight: '1px solid var(--border-color-ui-contrast1)',
    background: 'linear-gradient(180deg, rgba(5,10,20,0.4) 0%, rgba(10,40,50,0.4) 100%)'
  },
  tab: {
    color: 'var(--ft-color-normal)',
    borderLeft: '2px solid transparent',
    opacity: '0.5',
    cursor: 'pointer',
    height: '50px',
    lineHeight: '50px',
    fontSize: '1.75em',
    textAlign: 'center',
    '&:hover': {
      background: 'var(--list-bg-hover)',
      borderColor: 'var(--list-border-hover)',
      color: 'var(--ft-color-loud)',
      opacity: '1'
    },
    '&.active': {
      background: 'var(--list-bg-selected)',
      borderColor: 'var(--list-border-selected)',
      color: 'var(--ft-color-loud)',
      opacity: '1'
    },
    '&.disabled, &.disabled:hover':{
      background: 'transparent',
      color: 'var(--ft-color-normal)',
      opacity: '0.2',
      cursor: 'not-allowed'
    }
  }
});

interface TabProps {
  className: string;
  disabled: boolean;
  active: boolean;
  icon: IconDefinition;
  mode: string;
  title: string;
  onClick: (mode:string) => void;
}

const Tab = ({ className, disabled, active, icon, mode, title, onClick }: TabProps) => {

  const props = (disabled || active) ?
    {
      className: `${className} ${disabled?'disabled':''} ${active?'active':''}`
    }:
    {
      className: className,
      onClick: () => onClick(mode)
    };

  return(
    <div {...props} title={title}>
      <FontAwesomeIcon icon={icon}/>
    </div>
  );
};

interface TabsProps {
  mode: string;
}

const Tabs = observer(({ mode }: TabsProps) => {

  const classes = useStyles();

  const navigate = useNavigate();

  const { queryBuilderStore } = useStores();

  const setMode = (selectedMode: string) => {
    Matomo.trackEvent('Tab', 'ChangeMode', selectedMode);
    const id = (queryBuilderStore.saveAsMode && queryBuilderStore.sourceQuery && queryBuilderStore.queryId !== queryBuilderStore.sourceQuery.id)?queryBuilderStore.sourceQuery.id:queryBuilderStore.queryId;
    const path = (selectedMode === 'build')?`/queries/${id}`:`/queries/${id}/${selectedMode}`;
    navigate(path);
  };

  return (
    <div className={classes.tabs}>
      <Tab className={classes.tab} icon={faTools} mode="build"   active={mode === 'build'}   onClick={setMode} title="build query"   disabled={false} />
      <Tab className={classes.tab} icon={faCode}  mode="edit"    active={mode === 'edit'}    onClick={setMode} title="edit query"    disabled={false} />
      <Tab className={classes.tab} icon={faPlay}  mode="execute" active={mode === 'execute'} onClick={setMode} title="execute query" disabled={queryBuilderStore.isQueryEmpty} />
    </div>
  );
});
Tabs.displayName = 'Tabs';

export default Tabs;