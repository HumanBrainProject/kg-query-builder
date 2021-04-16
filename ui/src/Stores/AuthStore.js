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

import { observable, computed, action, runInAction, makeObservable } from "mobx";

const rootPath = window.rootPath || "";

const userKeys = {
  id: "https://schema.hbp.eu/users/nativeId",
  username: "http://schema.org/alternateName",
  email: "http://schema.org/email",
  displayName: "http://schema.org/name",
  givenName: "http://schema.org/givenName",
  familyName: "http://schema.org/familyName",
  picture: "https://schema.hbp.eu/users/picture"
};

const mapUserProfile = data => {
  const user = {};
  if (data && data.data) {
    Object.entries(userKeys).forEach(([name, fullyQualifiedName]) => {
      if (data.data[fullyQualifiedName]) {
        user[name] = data.data[fullyQualifiedName];
      }
    });
  }
  return user;
};

export class AuthStore {
  isUserAuthorized = false;
  user = null;
  spaces = null;
  isRetrievingUserProfile = false;
  userProfileError = null;
  isRetrievingSpaces = false;
  spacesError = null;
  authError = null;
  authSuccess = false;
  isTokenExpired = false;
  isInitializing = true;
  initializationError = null;
  isLogout = false;
  keycloak = null;
  endpoint = null;

  transportLayer = null;

  constructor(transportLayer) {
    makeObservable(this, {
      isUserAuthorized: observable,
      user: observable,
      spaces: observable,
      isRetrievingUserProfile: observable,
      userProfileError: observable,
      isRetrievingSpaces: observable,
      spacesError: observable,
      authError: observable,
      authSuccess: observable,
      isTokenExpired: observable,
      isInitializing: observable,
      initializationError: observable,
      isLogout: observable,
      accessToken: computed,
      isAuthenticated: computed,
      hasSpaces: computed,
      hasUserSpaces: computed,
      areUserSpacesRetrieved: computed,
      logout: action,
      retrieveUserProfile: action,
      retrieveUserSpaces: action,
      initializeKeycloak: action,
      login: action,
      authenticate: action,
      firstName: computed
    });

    this.transportLayer = transportLayer;

    if (Storage === undefined) {
      throw new Error("The browser must support WebStorage API");
    }
  }

  get accessToken() {
    return this.isAuthenticated ? this.keycloak.token: "";
  }

  get isAuthenticated() {
    return this.authSuccess;
  }

  get hasUserProfile() {
    return !!this.user;
  }

  get hasSpaces() {
    return !!this.spaces;
  }

  get hasUserSpaces() {
    return this.areUserSpacesRetrieved && !!this.spaces.length;
  }

  get areUserSpacesRetrieved() {
    return this.spaces instanceof Array;
  }

  get firstName() {
    const firstNameReg = /^([^ ]+) .*$/;
    if (this.user) {
      if (this.user.givenName) {
        return this.user.givenName;
      }
      if (this.user.displayName) {
        if (firstNameReg.test(this.user.displayName)) {
          return this.user.displayName.match(firstNameReg)[1];
        }
        return this.user.displayName;
      }
      if (this.user.username) {
        return this.user.username;
      }
    }
    return "";
  }

  logout() {
    this.authSuccess = false;
    this.isTokenExpired = true;
    this.isUserAuthorized = false;
    this.user = null;
    this.spaces = null;
    this.keycloak.logout({redirectUri: `${window.location.protocol}//${window.location.host}${rootPath}/logout`});
    this.isLogout = true;
  }

  async retrieveUserProfile() {
    if (this.isAuthenticated && !this.user) {
      this.userProfileError = null;
      this.isRetrievingUserProfile = true;
      try {
        const { data } = await this.transportLayer.getUserProfile();
        //throw {response: { status: 403}};
        runInAction(() => {
          this.isUserAuthorized = true;
          this.user = mapUserProfile(data);
          this.isRetrievingUserProfile = false;
        });
      } catch (e) {
        runInAction(() => {
          if (e.response && e.response.status === 403) {
            this.isUserAuthorized = false;
            this.isRetrievingUserProfile = false;
          } else {
            this.isUserAuthorized = false;
            this.userProfileError = e.message ? e.message : e;
            this.isRetrievingUserProfile = false;
          }
        });
        this.transportLayer.captureException(e);
      }
    }
  }

  async retrieveUserSpaces() {
    if(this.isAuthenticated && this.isUserAuthorized && !this.isRetrievingSpaces) {
      try {
        this.spacesError = null;
        this.isRetrievingSpaces = true;
        const { data } = await this.transportLayer.getSpaces();
        //throw {response: { status: 403}};
        runInAction(() => {
          this.spaces = data && data.data ? data.data.map(space => space["http://schema.org/name"]).sort() : [];
          this.isRetrievingSpaces = false;
        });
      } catch(e) {
        runInAction(() => {
          if (e.response && e.response.status === 403) {
            this.spaces = [];
            this.isRetrievingSpaces = false;
          } else {
            this.spacesError = e.message ? e.message : e;
            this.isRetrievingSpaces = false;
          }
        });
        this.transportLayer.captureException(e);
      }
    }
  }

  initializeKeycloak(resolve, reject) {
    const keycloak = window.Keycloak({
      "realm": "hbp",
      "url":  this.endpoint,
      "clientId": "kg"
    });
    runInAction(() => this.keycloak = keycloak);
    keycloak.onAuthSuccess = () => {
      runInAction(() => {
        this.authSuccess = true;
        this.isInitializing = false;
      });
      resolve(true);
    };
    keycloak.onAuthError = error => {
      runInAction(() => {
        this.authError = error.error_description;
      });
      reject(error.error_description);
    };
    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(30)
        .catch(() => runInAction(() => {
          this.authSuccess = false;
          this.isTokenExpired = true;
        }));
    };
    keycloak.init({ onLoad: "login-required", pkceMethod: "S256"});
  }

  login() {
    if(!this.isAuthenticated && this.keycloak) {
      this.keycloak.login();
    }
  }

  async authenticate() {
    this.isLogout = false;
    this.isInitializing = true;
    this.authError = null;
    try {
      const { data } = await this.transportLayer.getAuthEndpoint();
      runInAction(() => {
        this.endpoint =  data && data.data? data.data.endpoint :null;
      });
      if(this.endpoint) {
        try {
          await new Promise((resolve, reject) => {
            const keycloakScript = document.createElement("script");
            keycloakScript.src = this.endpoint + "/js/keycloak.js";
            keycloakScript.async = true;

            document.head.appendChild(keycloakScript);
            keycloakScript.onload = () => {
              this.initializeKeycloak(resolve, reject);
            };
            keycloakScript.onerror = () => {
              document.head.removeChild(keycloakScript);
              runInAction(() => {
                this.isInitializing = false;
                this.authError = `Failed to load resource! (${keycloakScript.src})`;
              });
              reject(this.authError);
            };
          });
        } catch (e) {
          // error are already set in the store so no need to do anything here
          // window.console.log(e);
          this.transportLayer.captureException(e);
        }
      } else {
        runInAction(() => {
          this.isInitializing = false;
          this.authError = "service endpoints configuration is not correctly set";
        });
      }
    } catch (e) {
      runInAction(() => {
        this.isInitializing = false;
        this.authError = `Failed to load service endpoints configuration (${e && e.message?e.message:e})`;
      });
    }
  }
}

export default AuthStore;
