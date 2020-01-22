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
  "performQuery": function(vocab, size, start, databaseScope){
    return `/service/api/query/${appStore.currentWorkspace}/instances${arguments.length > 1?"?":""}${
      ""}${vocab!==undefined && vocab!==null?`vocab=${encodeURIComponent(vocab)}&`:""}${
      ""}${size!==undefined && size!==null?`size=${encodeURIComponent(size)}&`:""}${
      ""}${start!==undefined && start!==null?`start=${encodeURIComponent(start)}&`:""}${
      ""}${databaseScope?`databaseScope=${databaseScope}`:"" }`;},
  "query": uuid => `/service/api/query/${appStore.currentWorkspace}/${encodeURIComponent(uuid)}`,
  "listQueries": type => `/service/api/query?type=${encodeURIComponent(type)}`
};

class API {
  constructor() {
    this._axios = axios.create({});
    this._axios.interceptors.request.use(config => {
      if(authStore.keycloak) {
        config.headers.Authorization = "Bearer " + authStore.accessToken;
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