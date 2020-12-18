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
  historySettings;
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

    this.canLogin = !matchPath(window.location.pathname, { path: "/logout", exact: "true" });
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
      if(this.rootStore.authStore.isAuthenticated && this.rootStore.authStore.isUserAuthorized && !this.rootStore.authStore.areUserWorkspacesRetrieved) {
        runInAction(() => {
          this.initializingMessage = "Retrieving workspaces...";
        });
        await this.rootStore.authStore.retrieveUserWorkspaces();
        if (this.rootStore.authStore.workspacesError) {
          runInAction(() => {
            this.initializationError = this.rootStore.authStore.workspacesError;
            this.initializingMessage = null;
          });
        }
      }
      if (this.rootStore.authStore.isAuthenticated && this.rootStore.authStore.isUserAuthorized && this.rootStore.authStore.areUserWorkspacesRetrieved) {
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