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

import { useMemo, useState } from 'react';
import { normalizeQuery } from '../Helpers/QueryHelpers';
import useAPI from './useAPI';
import useGenericQuery from './useGenericQuery';
import type { GenericQuery } from './useGenericQuery';
import type { APIError } from '../Services/API';
import type { Query } from '../Types/Query';
import type { UUID } from '../types';

export interface GetQueryQuery extends GenericQuery<Query.Query|undefined> {
  isAvailable?: boolean;
}

const useGetQueryQuery = (queryId: UUID, skip: boolean): GetQueryQuery => {

  const [isAvailable, setAvailability] = useState<boolean|undefined>(undefined);

  const API = useAPI();

  const fetch = useMemo(() => async () => {
    setAvailability(undefined);
    try {
      const data = await API.getQuery(queryId);
      setAvailability(false);
      try {
        const query = await normalizeQuery(data);
        return query;
      } catch (e) {
        throw new Error(`Error while trying to expand/compact JSON-LD (${e})`);
      }
    } catch (e) {
      const error = e as APIError;
      const { response } = error;
      const status = response?.status;
      const message = error?.message;
      switch (status) {
      case 401: // Unauthorized
      case 403: { // Forbidden
        setAvailability(undefined);
        throw new Error(`You do not have permission to access the query with id "${queryId}"`);
      }
      case 404: {
        setAvailability(true);
        return undefined;
      }
      default: {
        setAvailability(undefined);
        throw new Error(`Error while fetching query with id "${queryId}" (${message})`);
      }
      }
    }
  }, [API, queryId]);

  const genericQuery = useGenericQuery<Query.Query|undefined>(fetch, skip);

  return {
    ...genericQuery,
    isAvailable: isAvailable
  };
};

export default useGetQueryQuery;