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

import {faRedoAlt} from '@fortawesome/free-solid-svg-icons/faRedoAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';

import ErrorPanel from '../Components/ErrorPanel';
import SpinnerPanel from '../Components/SpinnerPanel';
import useAuth from '../Hooks/useAuth';
import useListSpacesQuery from '../Hooks/useListSpacesQuery';
import useStores from '../Hooks/useStores';
import type { JSX} from 'react';

interface SpacesProps {
  children?: string|JSX.Element|(null|undefined|string|JSX.Element)[];
}

const Spaces = observer(({ children }: SpacesProps) => {

  const { logout } = useAuth();

  const {
    data: spaces,
    error,
    isUninitialized,
    isFetching,
    isError,
    refetch,
  } = useListSpacesQuery();

  const { userProfileStore, spacesStore } = useStores();

  useEffect(() => {
    if (spaces) {
      spacesStore.setSpaces(spaces);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaces]);

  if (isError) {
    return (
      <ErrorPanel>
        There was a problem retrieving the spaces ({error}).
          If the problem persists, please contact the support.<br /><br />
        <Button variant={'primary'} onClick={refetch}>
          <FontAwesomeIcon icon={faRedoAlt} /> &nbsp; Retry
        </Button>
      </ErrorPanel>
    );
  }

  if (isUninitialized || isFetching) {
    return (
      <SpinnerPanel text="Retrieving spaces..." />
    );
  }

  if (!spaces?.length) {
    return (
      <ErrorPanel>
        <h1>Welcome <span title={userProfileStore.user?.givenName}>{userProfileStore.user?.givenName}</span></h1>
        <p>You are currently not granted permission to acccess any spaces.</p>
        <p>Please contact our team by email at : <a href="mailto:kg@ebrains.eu">kg@ebrains.eu</a></p>
        <Button onClick={logout}>Logout</Button>
      </ErrorPanel>
    );
  }

  return (
    <>
      {children}
    </>
  );

});
Spaces.displayName = 'Spaces';

export default Spaces;