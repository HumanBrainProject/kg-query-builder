import { observable, action, runInAction } from "mobx";

import DefaultTheme from "../Themes/Default";
import BrightTheme from "../Themes/Bright";
import authStore from "./AuthStore";

class AppStore{
  @observable globalError = null;
  @observable currentTheme;
  @observable historySettings;
  @observable initializingMessage = "Initializing the application...";
  @observable initializationError = null;
  @observable currentWorkspace = null;
  @observable isInitialized = false;


  availableThemes = {
    "default": DefaultTheme,
    "bright": BrightTheme
  }

  constructor(){
    let savedTheme = localStorage.getItem("currentTheme");
    this.currentTheme = savedTheme === "bright"? "bright": "default";
  }

  @action
  async initialize() {
    if (!this.isInitialized) {
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
          this.initializingMessage = "Retrieving workspaces...";
        });
        await authStore.retrieveUserWorkspaces();
        if (authStore.userProfileError) {
          runInAction(() => {
            this.initializationError = authStore.userProfileError;
            this.initializingMessage = null;
          });
        }
      }
      if(authStore.isFullyAuthenticated) {
        await this.initializeWorkspace();
        runInAction(() => {
          this.initializingMessage = null;
          // this.isInitialized = !!this.currentWorkspace; //TODO: Check if this one applies here, why cast the currentWorkspace?
          this.isInitialized = true;
        });
      }
    }
  }

  @action
  async initializeWorkspace() {
    let workspace = null;
    workspace = localStorage.getItem("currentWorkspace");
    this.setCurrentWorkspace(workspace);
    return this.currentWorkspace;
  }

  @action
  setCurrentWorkspace = workspace => {
    if (!workspace || !authStore.workspaces.includes(workspace)) {
      if (authStore.hasWorkspaces && authStore.workspaces.length === 1) {
        workspace = authStore.workspaces[0];
      } else {
        workspace = null;
      }
    }
    if(this.currentWorkspace !== workspace) {
      this.currentWorkspace = workspace;
      localStorage.setItem("currentWorkspace", workspace);
      // typesStore.fetch(true);
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