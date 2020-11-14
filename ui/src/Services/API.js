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
import authStore from "../Stores/AuthStore";
import appStore from "../Stores/AppStore";

const endpoints = {
  "auth": () => "/service/api/auth/endpoint",
  "user": () => "/service/api/user",
  "workspaces": () => "/service/api/workspaces",
  "workspaceTypes": () => `/service/api/workspaces/${appStore.currentWorkspace}/types`,
  "types": () => "/service/api/types",
  "structure": () => "/service/api/structure?withLinks=true",
  "performQuery": (vocab, size, from, stage) => `/service/api/query?${
    ""}${vocab!==undefined && vocab!==null?`vocab=${encodeURIComponent(vocab)}&`:""}${
    ""}${size!==undefined && size!==null?`size=${encodeURIComponent(size)}&`:""}${
    ""}${from!==undefined && from!==null?`from=${encodeURIComponent(from)}&`:""}${
    ""}${stage?`stage=${stage}`:"" }`,
  "query": uuid => `/service/api/query/${appStore.currentWorkspace}/${encodeURIComponent(uuid)}`,
  "listQueries": type => `/service/api/query?type=${encodeURIComponent(type)}`
};

class API {
  constructor() {
    this._axios = axios.create({});
    this._axios.interceptors.request.use(config => {
      if(authStore.keycloak) {
        config.headers.Authorization = "Bearer " + authStore.keycloak.token;
      }
      return Promise.resolve(config);
    });
    this._axios.interceptors.response.use(null, (error) => {
      if (error.response && error.response.status === 401 && !error.config._isRetry) {
        authStore.logout();
        return this.axios.request(error.config);
      } else {
        return Promise.reject(error);
      }
    });
  }

  get axios() {
    return this._axios;
  }

  get endpoints() {
    return endpoints;
  }
}

export default new API();