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
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useStores from '../Hooks/useStores';

const QueryByType = observer(() => {
  const { typeStore, queryBuilderStore, queriesStore, queryRunStore } = useStores();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const typeId = queryParams.get('type');
  const instanceId = queryParams.get('instanceId');
  useEffect(() => {
    const type = typeId && typeStore.types.get(typeId);
    if (type) {
      localStorage.setItem('type', type.id);
      queriesStore.toggleShowSavedQueries(false);
      queriesStore.clearQueries();
      queryBuilderStore.setType(type);
      const uuid = uuidv4();
      if (instanceId) {
        queryRunStore.setInstanceId(instanceId);
      }
      navigate(`/queries/${uuid}`,  { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
});
QueryByType.displayName = 'QueryByType';

export default QueryByType;
