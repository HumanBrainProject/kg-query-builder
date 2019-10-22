import { observable, computed, action, runInAction } from "mobx";
import API from "../Services/API";

const userKeys = {
  id: "@id",
  username: "http://schema.org/alternateName",
  email: "http://schema.org/email",
  displayName: "http://schema.org/name",
  givenName: "http://schema.org/givenName",
  familyName: "http://schema.org/familyName"
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

class AuthStore {
  @observable endpoint = null;
  @observable user = null;
  @observable isRetrievingUserProfile = false;
  @observable userProfileError = false;
  @observable authError = null;
  @observable authSuccess = false;
  keycloak = null;

  constructor() {
    if (Storage === undefined) {
      throw "The browser must support WebStorage API";
    }
  }

  @computed
  get accessToken() {
    return this.isAuthenticated ? this.keycloak.token: "";
  }

  @computed
  get isAuthenticated() {
    return this.authSuccess;
  }

  @computed
  get hasUserProfile() {
    return !!this.user;
  }

  @computed
  get isFullyAuthenticated() {
    return this.isAuthenticated && this.hasUserProfile;
  }

  @action
  logout() {
    this.user = null;
    this.keycloak.logout();
  }

  @action
  async retrieveUserProfile() {
    if (this.isAuthenticated && !this.user) {
      this.userProfileError = false;
      this.isRetrievingUserProfile = true;
      try {
        const { data } = await API.axios.get(API.endpoints.user());
        runInAction(() => {
          this.user = mapUserProfile(data);
          this.isRetrievingUserProfile = false;
        });
      } catch (e) {
        runInAction(() => {
          this.userProfileError = e.message ? e.message : e;
          this.isRetrievingUserProfile = false;
        });
      }
    }
  }

  @action
  initializeKeycloak() {
    const keycloak = window.Keycloak({
      "realm": "hbp",
      "url":  this.endpoint,
      "clientId": "kg-editor"
    });
    runInAction(() => this.keycloak = keycloak);
    keycloak.onAuthSuccess = () => {
      runInAction(() => this.authSuccess = true);
      this.retrieveUserProfile();
    };
    keycloak.onAuthError = () => {
      runInAction(() => this.authError = "There was an error during login. Please try again!");
    };
    keycloak.onTokenExpired = () => { keycloak.login(); };
    keycloak.init({ flow: "implicit" });
  }

  @action
  login() {
    if(!this.isAuthenticated && this.keycloak) {
      this.keycloak.login();
    }
  }

  @action
  async initiliazeAuthenticate() {
    try {
      const { data } = await API.axios.get(API.endpoints.auth());
      runInAction(() => {
        this.endpoint =  data && data.data? data.data.endpoint :null;
      });
      if(this.endpoint) {
        const keycloakScript = document.createElement("script");
        keycloakScript.src = this.endpoint + "/js/keycloak.js";
        keycloakScript.async = true;

        document.head.appendChild(keycloakScript);
        keycloakScript.onload = () => {
          this.initializeKeycloak();
        };
      }
    } catch (e) {
      return null;
    }
  }
}

export default new AuthStore();