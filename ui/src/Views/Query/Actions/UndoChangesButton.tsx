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

import {faUndoAlt} from '@fortawesome/free-solid-svg-icons/faUndoAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Button from 'react-bootstrap/Button';

import useStores from '../../../Hooks/useStores';

const UndoChangesButton = observer(() => {

  const { queryBuilderStore } = useStores();

  const onClick = () => queryBuilderStore.cancelChanges();

  if (!queryBuilderStore.hasChanged || queryBuilderStore.savedQueryHasInconsistencies) {
    return null;
  }

  return (
    <Button variant={'primary'} onClick={onClick}>
      <FontAwesomeIcon icon={faUndoAlt} />&nbsp;Undo changes
    </Button>
  );
});

export default UndoChangesButton;
