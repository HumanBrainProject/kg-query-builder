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

const API = {
  endpoints: {
    "auth": () => "/service/api/auth/endpoint",
    "user": () => "/service/api/user",
    "workspaces": () => "/service/api/workspaces",
    "types": () => "/service/api/types",
    "structure": () => "/service/api/structure?withLinks=true",
    "performQuery": (stage, from, size) => `/service/api/queries?${
      ""}${size!==undefined && size!==null?`size=${size}&`:""}${
      ""}${from!==undefined && from!==null?`from=${from}&`:""}${
      ""}${stage?`stage=${stage}`:"" }`,
    "getQuery": queryId => `/service/api/queries/${queryId}`,
    "saveQuery": (queryId, workspace) => `/service/api/queries/${queryId}/${workspace?`?workspace=${workspace}`:"" }`,
    "deleteQuery": queryId => `/service/api/queries/${queryId}`,
    "listQueries": type => `/service/api/queries?type=${encodeURIComponent(type)}`
  }
};

export default API;