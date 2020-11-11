import { observable, action, computed, runInAction, makeObservable } from "mobx";
import { matchPath } from "react-router-dom";

import DefaultTheme from "../Themes/Default";
import BrightTheme from "../Themes/Bright";
import authStore from "./AuthStore";
import typesStore from "./TypesStore";

const themes = {};
themes[DefaultTheme.name] = DefaultTheme;
themes[BrightTheme.name] = BrightTheme;

class AppStore{
  globalError = null;
  _currentThemeName = DefaultTheme.name;
  historySettings;
  initializingMessage = null;
  initializationError = null;
  canLogin = true;
  currentWorkspace = null;
  isInitialized = false;

  constructor(){
    makeObservable(this, {
      globalError: observable,
      _currentThemeName: observable,
      currentTheme: computed,
      historySettings: observable,
      initializingMessage: observable,
      initializationError: observable,
      canLogin: observable,
      currentWorkspace: observable,
      isInitialized: observable,
      initialize: action,
      initializeWorkspace: action,
      setCurrentWorkspace: action,
      setGlobalError: action,
      dismissGlobalError: action,
      login: action,
      setTheme: action,
      toggleTheme: action,
      handleGlobalShortcuts: action
    });

    this.canLogin = !matchPath(window.location.pathname, { path: "/logout", exact: "true" });
    this.setTheme(localStorage.getItem("theme"));
  }

  async initialize() {
    if (this.canLogin && !this.isInitialized) {
      this.initializingMessage = "Initializing the application...";
      this.initializationError = null;
      if(!authStore.isAuthenticated) {
        this.initializingMessage = "User authenticating...";
        await authStore.authenticate();
        if (authStore.authError) {
          runInAction(() => {
            this.initializationError = authStore.authError;
            this.initializingMessage = null;
          });
        }
      }
      if(authStore.isAuthenticated && !authStore.hasUserProfile) {
        runInAction(() => {
          this.initializingMessage = "Retrieving user profile...";
        });
        await authStore.retrieveUserProfile();
        runInAction(() => {
          if (authStore.userProfileError) {
            this.initializationError = authStore.userProfileError;
            this.initializingMessage = null;
          } else if (!authStore.isUserAuthorized && !authStore.isRetrievingUserProfile) {
            this.isInitialized = true;
            this.initializingMessage = null;
          }
        });
      }
      if(authStore.isAuthenticated && authStore.isUserAuthorized && !authStore.hasUserWorkspaces) {
        runInAction(() => {
          this.initializingMessage = "Retrieving workspaces...";
        });
        await authStore.retrieveUserWorkspaces();
        if (authStore.workspacesError) {
          runInAction(() => {
            this.initializationError = authStore.workspacesError;
            this.initializingMessage = null;
          });
        }
      }
      if (authStore.isAuthenticated && authStore.isUserAuthorized && authStore.hasUserWorkspaces) {
        this.initializeWorkspace();
        runInAction(() => {
          this.initializingMessage = null;
          this.isInitialized = true;
        });
      }
    }
  }

  initializeWorkspace() {
    const workspace = localStorage.getItem("workspace");
    this.setCurrentWorkspace(workspace);
  }

  setCurrentWorkspace = workspace => {
    if (!workspace || !authStore.hasWorkspaces || !authStore.workspaces.includes(workspace)) {
      if (authStore.hasUserWorkspaces && authStore.workspaces.length === 1) {
        workspace = authStore.workspaces[0];
      } else {
        workspace = null;
      }
    }
    if(this.currentWorkspace !== workspace) {
      this.currentWorkspace = workspace;
      localStorage.setItem("workspace", workspace);
      typesStore.fetch(true);
    }
  };

  setGlobalError(error, info) {
    this.globalError = {error, info};
  }

  dismissGlobalError() {
    this.globalError = null;
  }

  login = () => {
    if (this.canLogin) {
      authStore.login();
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
    if(this.currentThemeName === BrightTheme.name){
      this.setTheme(DefaultTheme.name);
    } else {
      this.setTheme(BrightTheme.name);
    }
  }

  handleGlobalShortcuts = e => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.keyCode === 84) {
      this.toggleTheme();
    }
  };
}

export default new AppStore();