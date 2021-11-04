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

const API = {
  endpoints: {
    "auth": () => "/service/api/auth/endpoint",
    "user": () => "/service/api/user",
    "spaces": () => "/service/api/spaces",
    "types": () => "/service/api/types",
    "structure": () => "/service/api/structure?withLinks=true",
    "performQuery": (stage, from, size, instanceId, params) => {
      const paramsString = Object.entries(params).reduce((acc, [name, value]) => {
        acc += `&${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        return acc;
      }, "");
      return `/service/api/queries?${
        ""}${size!==undefined && size!==null?`size=${size}&`:""}${
        ""}${from!==undefined && from!==null?`from=${from}&`:""}${
        ""}${instanceId!==undefined && instanceId!==null?`instanceId=${instanceId}&`:""}${
        ""}${stage?`stage=${stage}`:"" }${paramsString}`;
    },
    "getQuery": queryId => `/service/api/queries/${queryId}`,
    "saveQuery": (queryId, space) => `/service/api/queries/${queryId}/${space?`?space=${space}`:"" }`,
    "deleteQuery": queryId => `/service/api/queries/${queryId}`,
    "listQueries": type => `/service/api/queries?type=${encodeURIComponent(type)}`
  }
};

export default API;