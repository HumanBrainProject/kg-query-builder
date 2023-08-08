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

import useAuth from '../Hooks/useAuth';
import useStores from '../Hooks/useStores';

import HomeTab from './HomeTab';
import UserProfileTab from './UserProfileTab';

const useStyles = createUseStyles({
  container: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr auto'
  },
  fixedTabsLeft: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr'
  },
  fixedTabsRight: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, auto)'
  },
  userProfileTab: {
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    border1: '1px solid var(--border-color-ui-contrast2)',
    borderLeft: 'none',
    border: 0,
    '& > button': {
      background: 'transparent',
      color: 'rgba(255,255,255,0.6)',
      transition: 'background-color 0.3s ease-in-out',
      '&:hover' : {
        background: 'rgba(0,0,0,0.2)',
        color: 'white'
      }
    }
  }
});

const Nav = observer(() => {
  const classes = useStyles();

  const { isAuthenticated } = useAuth();
  const { appStore, userProfileStore, spacesStore, typeStore } = useStores();

  if (appStore.globalError) {
    return null;
  }

  return (
    <nav className={classes.container}>
      <div className={classes.fixedTabsLeft}>
        {isAuthenticated && spacesStore.hasSpaces && typeStore.hasTypes && (
          <HomeTab />
        )}
      </div>
      <div className={classes.fixedTabsRight}>
        {isAuthenticated && !!userProfileStore.user && (
          <UserProfileTab className={classes.userProfileTab} />
        )}
      </div>
    </nav>
  );
});
Nav.displayName = 'Nav';

export default Nav;

