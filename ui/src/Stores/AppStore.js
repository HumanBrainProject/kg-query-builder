import { observable, action, runInAction } from "mobx";
import { matchPath } from "react-router-dom";

import DefaultTheme from "../Themes/Default";
import BrightTheme from "../Themes/Bright";
import authStore from "./AuthStore";
import typesStore from "./TypesStore";

class AppStore{
  @observable globalError = null;
  @observable currentTheme;
  @observable historySettings;
  @observable initializingMessage = null;
  @observable initializationError = null;
  @observable canLogin = true;
  @observable currentWorkspace = null;
  @observable isInitialized = false;


  availableThemes = {
    "default": DefaultTheme,
    "bright": BrightTheme
  }

  constructor(){
    this.canLogin = !matchPath(window.location.pathname, { path: "/logout", exact: "true" });
    let savedTheme = localStorage.getItem("currentTheme");
    this.currentTheme = savedTheme === "bright"? "bright": "default";
  }

  @action
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
        if (authStore.userProfileError) {
          runInAction(() => {
            this.initializationError = authStore.userProfileError;
            this.initializingMessage = null;
          });
        }
      }
      if(authStore.isAuthenticated && authStore.hasUserProfile && !authStore.hasUserWorkspaces) {
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
      if(authStore.isFullyAuthenticated) {
        this.initializeWorkspace();
        runInAction(() => {
          this.initializingMessage = null;
          this.isInitialized = true;
        });
      }
    }
  }

  @action
  initializeWorkspace() {
    let workspace = null;
    workspace = localStorage.getItem("currentWorkspace");
    this.setCurrentWorkspace(workspace);
    return this.currentWorkspace;
  }

  @action
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
      localStorage.setItem("currentWorkspace", workspace);
      typesStore.fetch(true);
    }
  }

  @action
  setGlobalError(error, info){
    this.globalError = {error, info};
  }

  @action
  dismissGlobalError(){
    this.globalError = null;
  }

  @action
  login = () => {
    if (this.canLogin) {
      authStore.login();
    } else {
      window.history.replaceState(window.history.state, "Knowledge Graph Query Builder", "/");
      this.canLogin = true;
      this.initialize(true);
    }
  }

  setTheme(theme){
    this.currentTheme = this.availableThemes[theme]? theme: "default";
    localStorage.setItem("currentTheme", this.currentTheme);
  }

  toggleTheme(){
    if(this.currentTheme === "bright"){
      this.setTheme("default");
    } else {
      this.setTheme("bright");
    }
  }

  handleGlobalShortcuts = e => {
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.keyCode === 84) {
      this.toggleTheme();
    }
  }
}

export default new AppStore();