import axios from "axios";
import authStore from "../Stores/AuthStore";

const endpoints = {
  "user": () => "/editor/api/user",
  "structure": () => "/editor/api/structure?withLinks=true",
  "performQuery": function(instancePath, vocab, size, start, databaseScope){
    return `/editor/api/query/${instancePath}/instances${arguments.length > 1?"?":""}${
      ""}${vocab!==undefined && vocab!==null?`vocab=${encodeURIComponent(vocab)}&`:""}${
      ""}${size!==undefined && size!==null?`size=${encodeURIComponent(size)}&`:""}${
      ""}${start!==undefined && start!==null?`start=${encodeURIComponent(start)}&`:""}${
      ""}${databaseScope?`databaseScope=${databaseScope}`:"" }`;},
  "query": (instancePath, queryId) => `/editor/api/query/${instancePath}/${encodeURIComponent(queryId)}`,
  "listQueries": () => "/editor/api/query"
};

class API {
  constructor() {
    this._axios = axios.create({});
    this._axios.interceptors.response.use(null, (error) => {
      if (error.response && error.response.status === 401 && !error.config._isRetry) {
        return authStore.logout(true).then(()=>{
          error.config.headers.Authorization = "Bearer " + authStore.accessToken;
          error.config._isRetry = true;
          return this.axios.request(error.config);
        });
      } else {
        return Promise.reject(error);
      }
    });
  }

  get axios() {
    this.reloadToken();
    return this._axios;
  }

  reloadToken() {
    Object.assign(this._axios.defaults, {
      headers: { Authorization: "Bearer " + authStore.accessToken },
      withCredentials: true
    });
  }

  get endpoints() {
    return endpoints;
  }
}

export default new API();