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
import { AxiosInstance } from "axios";
import API from "./API";
import { UUID, Stage, Settings, UserProfile, Space, Type, TypesByName, QueryExecutionResult, KGCoreResult } from "../types";
import { QuerySpecification } from "../Types/QuerySpecification";

const RELATIVE_ROOT_PATH = "/service/api";

declare global {
	interface Window {
		rootPath?: string
	}
}

const getSize = (size?: string|null) => {
  if (size !== undefined && size !== null) {
    return `size=${size}&`;
  }
  return "";
};

const getFrom = (from?: string|null) => {
  if (from !== undefined && from !== null) {
    return `from=${from}&`;
  }
  return "";
};

const getInstanceId = (instanceId?: UUID|null) => {
  if (instanceId !== undefined && instanceId !== null) {
    return `instanceId=${instanceId}&`;
  }
  return "";
};

const getStage = (stage?: Stage) => {
  if (stage) {
    return `stage=${stage}`;
  }
  return "";
};

const getSpace = (space?: string) => {
  if(space) {
    return `?space=${space}`;
  }
  return "";
}

const endpoints = {
  settings: () => `${RELATIVE_ROOT_PATH}/settings`,
  user: () => `${RELATIVE_ROOT_PATH}/user`,
  spaces: () => `${RELATIVE_ROOT_PATH}/spaces`,
  types: () => `${RELATIVE_ROOT_PATH}/types`,
  structure: () => `${RELATIVE_ROOT_PATH}/structure?withLinks=true`,
  performQuery: (stage?:Stage, from?:string, size?:string, instanceId?:string, restrictToSpaces?:string[], params?: object) => {
    const restrictToSpacesString =
      Array.isArray(restrictToSpaces) && restrictToSpaces.length
        ? "&restrictToSpaces=" +
          restrictToSpaces.map((space) => encodeURIComponent(space)).join(",")
        : "";
    const paramsString = params?Object.entries(params).reduce(
      (acc, [name, value]) => {
        acc += `&${encodeURIComponent(name)}=${encodeURIComponent(value as string)}`;
        return acc;
      },
      ""
    ):"";
    return `${RELATIVE_ROOT_PATH}/queries?${getSize(size)}${getFrom(from)}${getInstanceId(instanceId)}${getStage(stage)}${paramsString}${restrictToSpacesString}`;
  },
  getQuery: (queryId:UUID) => `${RELATIVE_ROOT_PATH}/queries/${queryId}`,
  saveQuery: (queryId:UUID, space:string) => `${RELATIVE_ROOT_PATH}/queries/${queryId}/${getSpace(space)}`,
  deleteQuery: (queryId:UUID) => `${RELATIVE_ROOT_PATH}/queries/${queryId}`,
  getQueries: (type:string) => `${RELATIVE_ROOT_PATH}/queries?type=${encodeURIComponent(type)}`
};

class APIBackendAdapter implements API {
  private _axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this._axios = axios;
  }

  async getSettings(): Promise<Settings> {
    const { data } = await this._axios.get(endpoints.settings());
    return data?.data as Settings;
  }

  async getUserProfile(): Promise<UserProfile> {
    const { data } = await this._axios.get(endpoints.user());
    return data?.data as UserProfile;
  }

  async getSpaces(): Promise<KGCoreResult<Space[]>> {
    const { data } = await this._axios.get(endpoints.spaces());
    return data;
  }

  async listTypes(): Promise<Type[]> {
    const { data } = await this._axios.get(endpoints.types());
    return data;
  }

  async getTypesByName(types: string[]): Promise<TypesByName> {
    const { data } = await this._axios.post(endpoints.types(), types);
    return data?.data as TypesByName;
  }

  async performQuery(
    query: QuerySpecification.QuerySpecification,
    stage: Stage,
    from: string,
    size: string,
    instanceId: UUID | undefined,
    restrictToSpaces: string[]| undefined,
    params: object
  ): Promise<QueryExecutionResult> {
    const { data } = await this._axios.post(
      endpoints.performQuery(
        stage,
        from,
        size,
        instanceId,
        restrictToSpaces,
        params
      ),
      query
    );
    return data as QueryExecutionResult;
  }

  async getQueries(type: string): Promise<KGCoreResult<QuerySpecification.QuerySpecification[]>> {
    const { data } = await this._axios.get(endpoints.getQueries(type));
    return data;
  }

  async getQuery(queryId: UUID): Promise<QuerySpecification.QuerySpecification> {
    const { data } = await this._axios.get(endpoints.getQuery(queryId));
    return data;
  }

  async saveQuery(
    queryId: UUID,
    query: QuerySpecification.QuerySpecification,
    space: string
  ): Promise<void> {
    await this._axios.put(endpoints.saveQuery(queryId, space), query);
  }

  async deleteQuery(queryId: UUID): Promise<void> {
    await this._axios.delete(endpoints.deleteQuery(queryId));
  }
}

export default APIBackendAdapter;
