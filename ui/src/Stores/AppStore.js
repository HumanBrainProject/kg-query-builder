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

import { observable, action, computed, runInAction, makeObservable } from "mobx";
import { matchPath } from "react-router-dom";

import DefaultTheme from "../Themes/Default";
import BrightTheme from "../Themes/Bright";

const themes = {};
themes[DefaultTheme.name] = DefaultTheme;
themes[BrightTheme.name] = BrightTheme;

export class AppStore{
  globalError = null;
  _currentThemeName = DefaultTheme.name;
  historySettings = null;
  initializingMessage = null;
  initializationError = null;
  canLogin = true;
  isInitialized = false;

  rootStore = null;

  constructor(rootStore) {
    makeObservable(this, {
      globalError: observable,
      _currentThemeName: observable,
      currentTheme: computed,
      historySettings: observable,
      initializingMessage: observable,
      initializationError: observable,
      canLogin: observable,
      isInitialized: observable,
      initialize: action,
      setGlobalError: action,
      dismissGlobalError: action,
      login: action,
      setTheme: action,
      toggleTheme: action
    });

    this.rootStore = rootStore;
    this.canLogin = !matchPath({ path: "/logout", exact: "true" }, window.location.pathname);
    this.setTheme(localStorage.getItem("theme"));
  }

  async initialize() {
    if (this.canLogin && !this.isInitialized) {
      this.initializingMessage = "Initializing the application...";
      this.initializationError = null;
      if(!this.rootStore.authStore.isAuthenticated) {
        this.initializingMessage = "User authenticating...";
        await this.rootStore.authStore.authenticate();
        if (this.rootStore.authStore.authError) {
          runInAction(() => {
            this.initializationError = this.rootStore.authStore.authError;
            this.initializingMessage = null;
          });
        }
      }
      if(this.rootStore.authStore.isAuthenticated && !this.rootStore.authStore.hasUserProfile) {
        runInAction(() => {
          this.initializingMessage = "Retrieving user profile...";
        });
        await this.rootStore.authStore.retrieveUserProfile();
        runInAction(() => {
          if (this.rootStore.authStore.userProfileError) {
            this.initializationError = this.rootStore.authStore.userProfileError;
            this.initializingMessage = null;
          } else if (!this.rootStore.authStore.isUserAuthorized && !this.rootStore.authStore.isRetrievingUserProfile) {
            this.isInitialized = true;
            this.initializingMessage = null;
          }
        });
      }
      if(this.rootStore.authStore.isAuthenticated && this.rootStore.authStore.isUserAuthorized && !this.rootStore.authStore.areUserSpacesRetrieved) {
        runInAction(() => {
          this.initializingMessage = "Retrieving spaces...";
        });
        await this.rootStore.authStore.retrieveUserSpaces();
        if (this.rootStore.authStore.spacesError) {
          runInAction(() => {
            this.initializationError = this.rootStore.authStore.spacesError;
            this.initializingMessage = null;
          });
        }
      }
      if (this.rootStore.authStore.isAuthenticated && this.rootStore.authStore.isUserAuthorized && this.rootStore.authStore.areUserSpacesRetrieved) {
        runInAction(() => {
          this.initializingMessage = "Retrieving types...";
        });
        await this.rootStore.typeStore.fetch();
        if(this.rootStore.typeStore.fetchError) {
          runInAction(() => {
            this.initializationError = this.rootStore.typeStore.fetchError;
            this.initializingMessage = null;
          });
        }
      }
      if (this.rootStore.authStore.isAuthenticated && this.rootStore.authStore.isUserAuthorized && this.rootStore.authStore.areUserSpacesRetrieved && this.rootStore.typeStore.isFetched) {
        runInAction(() => {
          this.initializingMessage = null;
          this.isInitialized = true;
        });
      }
    }
  }

  setGlobalError(error, info) {
    this.globalError = {error, info};
  }

  dismissGlobalError() {
    this.globalError = null;
  }

  login = () => {
    if (this.canLogin) {
      this.rootStore.authStore.login();
    } else {
      window.history.replaceState(window.history.state, "Knowledge Graph Query Builder", "/");
      this.canLogin = true;
      this.initialize(true);
    }
  };

  get currentTheme() {
    return themes[this._currentThemeName];
  }

  setTheme(name){
    this._currentThemeName = themes[name]? name: DefaultTheme.name;
    localStorage.setItem("theme", this._currentThemeName);
  }

  toggleTheme(){
    if(this._currentThemeName === BrightTheme.name){
      this.setTheme(DefaultTheme.name);
    } else {
      this.setTheme(BrightTheme.name);
    }
  }
}

export default AppStore;