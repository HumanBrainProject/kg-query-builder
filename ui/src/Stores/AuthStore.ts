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

import { observable, computed, action, runInAction, makeObservable } from "mobx";
import API from "../Services/API";
import { Keycloak, KeycloakSettings, KeycloakError} from "../Services/Keycloak";
import { TransportLayer } from "../Services/TransportLayer";
import { AxiosError } from "axios";


declare global {
	interface Window {
		rootPath?: string,
    Keycloak: (settings: KeycloakSettings) => Keycloak
	}
}

const rootPath =  window.rootPath || "";

export interface User {
  id?: string,
  username?: string,
  email?: string,
  displayName?: string,
  givenName?: string,
  familyName?: string,
  picture?: string
}
export interface Permission {
  canCreate: boolean,
  canWrite: boolean,
  canDelete: boolean
}

export interface Space {
  isPrivate: boolean,
  name: string,
  permissions: Permission
}

export class AuthStore {
  isUserAuthorized = false;
  isUserAuthorizationInitialized = false;
  isSpacesInitialized = false;
  isSpacesFetched = false;
  user?:User;
  spaces:Space[] = [];
  isRetrievingUserProfile = false;
  userProfileError?: string;
  isRetrievingSpaces = false;
  spacesError?: string;
  authError?: string;
  authSuccess = false;
  isTokenExpired = false;
  isInitializing = false;
  initializationError?: string;
  isLogout = false;
  keycloak?: Keycloak;
  commit = null;

  transportLayer: TransportLayer;

  constructor(transportLayer: TransportLayer) {
    makeObservable(this, {
      isUserAuthorized: observable,
      isUserAuthorizationInitialized: observable,
      user: observable,
      spaces: observable,
      privateSpace: computed,
      sharedSpaces: computed,
      allowedSharedSpacesToCreateQueries: computed, 
      commit: observable,
      isRetrievingUserProfile: observable,
      userProfileError: observable,
      isRetrievingSpaces: observable,
      isSpacesInitialized: observable,
      isSpacesFetched: observable,
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
      logout: action,
      retrieveUserProfile: action,
      retrieveSpaces: action,
      initializeKeycloak: action,
      login: action,
      authenticate: action,
      firstName: computed
    });

    this.transportLayer = transportLayer;

  }

  get accessToken() {
    return (this.isAuthenticated && this.keycloak?.token) ? this.keycloak.token: "";
  }

  get isAuthenticated() {
    return this.authSuccess;
  }

  get hasUserProfile() {
    return !!this.user;
  }

  get hasSpaces() {
    return !!this.spaces.length;
  }

  getSpace(name: string) {
    return this.spaces.find(s => s.name === name);
  }

  get privateSpace() {
    return this.spaces.find(s => s.isPrivate);
  }

  get sharedSpaces() {
    return this.spaces.filter(s => !s.isPrivate);
  }

  get allowedSharedSpacesToCreateQueries() {
    return this.sharedSpaces.filter(s => s.permissions && s.permissions.canCreate);
  }

  get firstName(): string {
    const firstNameReg = /^([^ ]+) .*$/;
    if (this.user) {
      if (this.user.givenName) {
        return this.user.givenName;
      }
      if (this.user.displayName) {
        if (firstNameReg.test(this.user.displayName)) {
          const match = this.user.displayName.match(firstNameReg);
          if(match && match.length) {
            return match[1];
          }  
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
    this.user = undefined;
    this.spaces = [];
    this.isUserAuthorizationInitialized = false;
    this.isSpacesInitialized = false;
    this.keycloak && this.keycloak.logout({redirectUri: `${window.location.protocol}//${window.location.host}${rootPath}/logout`});
    this.isLogout = true;
  }

  async retrieveUserProfile() {
    if (this.isAuthenticated && !this.isRetrievingUserProfile && !this.user) {
      this.userProfileError = undefined;
      this.isRetrievingUserProfile = true;
      this.isUserAuthorizationInitialized = true;
      try {
        const { data } = await this.transportLayer.getUserProfile();
        runInAction(() => {
          this.isUserAuthorized = true;
          this.user = data?.data;
          this.isRetrievingUserProfile = false;
        });
      } catch (e) {
        const axiosError = e as AxiosError;
        runInAction(() => {
          if (axiosError.response && axiosError.response.status === 403) {
            this.isUserAuthorized = false;
            this.isRetrievingUserProfile = false;
            this.isUserAuthorizationInitialized = false;
          } else {
            this.isUserAuthorized = false;
            this.userProfileError = axiosError?.message;
            this.isRetrievingUserProfile = false;
            this.isUserAuthorizationInitialized = false;
          }
        });
      }
    }
  }

  async retrieveSpaces() {
    if(this.isAuthenticated && this.isUserAuthorized && !this.isSpacesFetched && !this.isRetrievingSpaces) {
      try {
        this.spacesError = undefined;
        this.isRetrievingSpaces = true;
        this.isSpacesInitialized = true;
        const { data } = await this.transportLayer.getSpaces();
        runInAction(() => {
          this.spaces = data && Array.isArray(data.data)? data.data: [];
          this.isSpacesFetched = true;
          this.isRetrievingSpaces = false;
        });
      } catch(e) {
        const axiosError = e as AxiosError;
        runInAction(() => {
          if (axiosError.response && axiosError.response.status === 403) {
            this.spaces = [];
            this.isSpacesFetched = true;
            this.isRetrievingSpaces = false;
            this.isSpacesInitialized = false;
          } else {
            this.spacesError = axiosError?.message;
            this.isRetrievingSpaces = false;
            this.isSpacesInitialized = false;
          }
        });
      }
    }
  }

  login() {
    if(!this.isAuthenticated && this.keycloak) {
      this.keycloak.login();
    }
  }

  initializeKeycloak(keycloakSettings: KeycloakSettings, onSuccess: () => void) {
    try {
      const keycloak = window.Keycloak(keycloakSettings);
      runInAction(() => {
        this.keycloak = keycloak;
      });
      keycloak.onAuthSuccess = () => {
        runInAction(() => {
          this.authSuccess = true;
          this.isInitializing = false;
        });
        onSuccess();
      };
      keycloak.onAuthError = (error: KeycloakError) => {
        const message = (error && error.error_description)?error.error_description:"Failed to authenticate";
        runInAction(() => {
          this.authError = message;
        });
      };
      keycloak.onTokenExpired = () => {
        keycloak
          .updateToken(30)
          .catch(() => runInAction(() => {
            this.authSuccess = false;
            this.isTokenExpired = true;
          }));
      };
      keycloak.init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: !window.location.host.startsWith("localhost") // avoid CORS error with UI running on localhost with Firefox
      }).catch(() => {
        runInAction(() => {
          this.isInitializing = false;
          this.authError = "Failed to initialize authentication";
        });
      });
    } catch (e) { // if keycloak script url return unexpected content
      runInAction(() => {
        this.isInitializing = false;
        this.authError = "Failed to initialize authentication";
      });
    }
  }

  async authenticate() {
    if (this.isInitializing || this.authSuccess) {
      return;
    }
    this.isLogout = false;
    this.isInitializing = true;
    this.authError = undefined;
    try {
      const { data } = await this.transportLayer.getSettings();
      const commit = data?.data.commit;
      const keycloakSettings =  data?.data?.keycloak;
      const sentrySettings = data?.data?.sentry;
      const matomoSettings = data?.data?.matomo;
      runInAction(() => {
        this.commit = commit;
      });
      if(keycloakSettings) {
        const keycloakScript = document.createElement("script");
        keycloakScript.src = `${keycloakSettings.url}/js/keycloak.js`;
        keycloakScript.async = true;
        document.head.appendChild(keycloakScript);
        keycloakScript.onload = () => {
          this.initializeKeycloak(keycloakSettings, () => {
            API.setSentry(sentrySettings);
            API.setMatomo(matomoSettings);
          });
        };
        keycloakScript.onerror = () => {
          document.head.removeChild(keycloakScript);
          runInAction(() => {
            this.isInitializing = false;
            this.authError = `Failed to load resource! (${keycloakScript.src})`;
          });
        };
      } else {
        runInAction(() => {
          this.isInitializing = false;
          this.authError = "The service is temporary unavailable. Please retry in a moment. (failed to load keycloak settings)";
        });
      }
    } catch (e) {
      const axiosError = e as AxiosError;
      runInAction(() => {
        this.isInitializing = false;
        this.authError = `The service is temporary unavailable. Please retry in a moment. (${axiosError.message?axiosError.message:e})`;
      });
    }
  }
}

export default AuthStore;