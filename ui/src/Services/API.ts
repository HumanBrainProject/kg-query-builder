/*  Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0.
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  This open source software code was developed in part or in whole in the
 *  Human Brain Project, funded from the European Union's Horizon 2020
 *  Framework Programme for Research and Innovation under
 *  Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 *  (Human Brain Project SGA1, SGA2 and SGA3).
 *
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import type { QuerySpecification } from '../Types/QuerySpecification';
import type { UUID, Stage, Settings, UserProfile, Space, Type, TypesByName, QueryExecutionResult, KGCoreResult } from '../types';

interface APIErrorResponse {
  status: number;
  data: unknown;
}

export interface APIError {
  message?: string;
  code?: string;
  response?: APIErrorResponse;
}

interface API {

  getSettings(): Promise<Settings>;

  getUserProfile(): Promise<UserProfile>;

  getSpaces(): Promise<KGCoreResult<Space[]>>;

  listTypes(): Promise<Type[]>

  getTypesByName(types: string[]): Promise<TypesByName>;

  performQuery(
    query: QuerySpecification.QuerySpecification,
    stage: Stage,
    from: string,
    size: string,
    instanceId: UUID | undefined,
    restrictToSpaces: string[]| undefined,
    params: object
  ): Promise<QueryExecutionResult>;

  getQueries(type: string): Promise<KGCoreResult<QuerySpecification.QuerySpecification[]>>;

  getQuery(queryId: UUID): Promise<QuerySpecification.QuerySpecification>;

  saveQuery(
    queryId: UUID,
    query: QuerySpecification.QuerySpecification,
    space: string
  ): Promise<void>;

  deleteQuery(queryId: UUID): Promise<void>;
}

export default API;