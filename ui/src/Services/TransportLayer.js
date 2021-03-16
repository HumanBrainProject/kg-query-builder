/*
*   Copyright (c) 2020, EPFL/Human Brain Project PCO
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
*/

import axios from "axios";
import * as Sentry from "@sentry/browser";

import API from "./API";

export class TransportLayer {
  _axios = null

  constructor() {
    this._axios = axios.create({});
  }

  captureException = e => {
    if (e && e.response && e.response.status && e.response.status) {
      switch (e.response.status) {
      case 500:
      {
        Sentry.captureException(e);
        break;
      }
      }
    }
  }

  setAuthStore = authStore => {
    this.authStore = authStore;
    this._axios = axios.create({});
    this._axios.interceptors.request.use(config => {
      if(this.authStore.keycloak) {
        config.headers.Authorization = "Bearer " + this.authStore.keycloak.token;
      }
      return Promise.resolve(config);
    });
    this._axios.interceptors.response.use(null, (error) => {
      if (error.response && error.response.status === 401 && !error.config._isRetry) {
        this.authStore.logout();
        return this.axios.request(error.config);
      } else {
        return Promise.reject(error);
      }
    });
  }

  async getAuthEndpoint() {
    return this._axios.get(API.endpoints.auth());
  }

  async getUserProfile() {
    return this._axios.get(API.endpoints.user());
  }

  async getWorkspaces() {
    return this._axios.get(API.endpoints.workspaces());
  }

  async getTypes() {
    return this._axios.get(API.endpoints.types());
  }

  async getTypesByName(types) {
    return this._axios.post(API.endpoints.types(), types);
  }

  async performQuery(query, stage, from, size) {
    return this._axios.post(API.endpoints.performQuery(stage, from, size), query);
  }

  async listQueries(type) {
    return this._axios.get(API.endpoints.listQueries(type));
  }

  async getQuery(queryId) {
    return this._axios.get(API.endpoints.getQuery(queryId));
  }

  async saveQuery(queryId, query, workspace) {
    return this._axios.put(API.endpoints.saveQuery(queryId, workspace), query);
  }

  async deleteQuery(queryId) {
    return this._axios.delete(API.endpoints.deleteQuery(queryId));
  }
}