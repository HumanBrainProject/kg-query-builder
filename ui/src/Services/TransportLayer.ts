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
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import AuthStore from "../Stores/AuthStore";
import API from "./API";

export class TransportLayer {
  _axios: AxiosInstance;
  authStore?: AuthStore;

  constructor() {
    this._axios = axios.create({});
  }

  setAuthStore = (authStore: AuthStore): void => {
    this.authStore = authStore;
    this._axios = axios.create({});
    this._axios.interceptors.request.use((config: AxiosRequestConfig) => {
      if (this.authStore?.keycloak && config.headers) {
        config.headers.Authorization = `Bearer ${this.authStore.keycloak.token}`;
      }
      return Promise.resolve(config);
    });
    this._axios.interceptors.response.use(undefined, error => {
      if (error.response && error.response.status === 401) {
        this.authStore?.logout();
        return this._axios.request(error.config);
      } else {
        return Promise.reject(error);
      }
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSettings(): Promise<AxiosResponse<any, any>> {
    return this._axios.get(API.endpoints.settings());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getUserProfile(): Promise<AxiosResponse<any, any>> {
    return this._axios.get(API.endpoints.user());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSpaces(): Promise<AxiosResponse<any, any>> {
    return this._axios.get(API.endpoints.spaces());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getTypes(): Promise<AxiosResponse<any, any>> {
    return this._axios.get(API.endpoints.types());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getTypesByName(types: string[]): Promise<AxiosResponse<any, any>> {
    return this._axios.post(API.endpoints.types(), types);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async performQuery(
    query: any,
    stage: string,
    from: string,
    size: string,
    instanceId: string | undefined,
    restrictToSpaces: string[]| undefined,
    params: any
  ): Promise<AxiosResponse<any, any>> {
    return this._axios.post(
      API.endpoints.performQuery(
        stage,
        from,
        size,
        instanceId,
        restrictToSpaces,
        params
      ),
      query
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async listQueries(type: string): Promise<AxiosResponse<any, any>> {
    return this._axios.get(API.endpoints.listQueries(type));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getQuery(queryId: string): Promise<AxiosResponse<any, any>> {
    return this._axios.get(API.endpoints.getQuery(queryId));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveQuery(
    queryId: string,
    query: any,
    space: string
  ): Promise<AxiosResponse<any, any>> {
    return this._axios.put(API.endpoints.saveQuery(queryId, space), query);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteQuery(queryId: string): Promise<AxiosResponse<any, any>> {
    return this._axios.delete(API.endpoints.deleteQuery(queryId));
  }
}
