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
import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';

import useStores from '../Hooks/useStores';
import Matomo from '../Services/Matomo';

import Selection from './Home/Selection';
import Types from './Home/Types';

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '10px',
    height: '100%',
    padding: '10px',
    background: 'transparent',
    color: 'var(--ft-color-normal)',
    overflow: 'hidden'
  }
});

const Home = observer(() => {

  const classes = useStyles();

  const { typeStore, queryBuilderStore } = useStores();

  useEffect(() => {
    Matomo.setCustomUrl(window.location.href);
    Matomo.trackPageView();
    if (!queryBuilderStore.hasType) {
      const typeId = localStorage.getItem('type');
      const type = typeId && typeStore.types.get(typeId);
      if (type) {
        queryBuilderStore.setType(type);
      } else {
        localStorage.removeItem('type');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.container}>
      <Types />
      <Selection />
    </div>
  );
});
Home.displayName = 'Home';

export default Home;