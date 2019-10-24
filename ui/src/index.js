import React from "react";
import { render } from "react-dom";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";
import injectStyles from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import Cookies from "universal-cookie";

import "./Services/IconsImport";

import appStore from "./Stores/AppStore";
import authStore from "./Stores/AuthStore";

import UserProfileTab from "./Views/UserProfileTab";

import Login from "./Views/Login";
import QueryBuilder from "./Views/QueryBuilder";
import FetchingLoader from "./Components/FetchingLoader";
import BGMessage from "./Components/BGMessage";
import GlobalError from "./Views/GlobalError";
import * as Sentry from "@sentry/browser";
import WorkspaceSelector from "./Components/WorkspaceSelector";

import "babel-polyfill";

const styles = {
  "@global html, body, #root": {
    height: "100%",
    overflow: "hidden",
    textRendering: "optimizeLegibility",
    "-webkit-font-smoothing": "antialiased",
    "-webkit-tap-highlight-color": "transparent",
    fontFamily: "Lato, sans-serif"
  },
  "@global *": {
    boxSizing: "border-box"
  },
  "@global button, @global input[type=button], @global a": {
    "-webkit-touch-callout": "none",
    userSelect: "none"
  },
  layout: {
    height: "100vh",
    display: "grid",
    overflow: "hidden",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr 20px"
  },
  tabs: {
    background: "var(--bg-color-ui-contrast1)",
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto auto 1fr auto"
  },
  body: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(var(--bg-gradient-angle), var(--bg-gradient-start), var(--bg-gradient-end))",
    backgroundSize: "200%"
  },
  logo: {
    padding: "10px",
    cursor: "pointer",
    "& span": {
      color: "var(--ft-color-loud)",
      display: "inline-block",
      paddingLeft: "10px",
      fontSize: "0.9em",
      borderLeft: "1px solid var(--border-color-ui-contrast5)",
      marginLeft: "10px"
    },
    "&:hover span": {
      color: "var(--ft-color-louder)"
    }
  },
  status: {
    background: "var(--bg-color-ui-contrast1)",
    color: "var(--ft-color-loud)"
  },
  loader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10000,
    background: "var(--bg-color-blend-contrast1)",
    "& .fetchingPanel": {
      width: "auto",
      padding: "30px",
      border: "1px solid var(--border-color-ui-contrast1)",
      borderRadius: "4px",
      color: "var(--ft-color-loud)",
      background: "var(--list-bg-hover)"
    }
  },
  authError: {
    color: "var(--ft-color-loud)"
  },
  userProfileTab: {
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    color: "var(--ft-color-normal)",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast2)",
    borderLeft: "none"
  },
  workspacesSelection: {
    fontSize: "1.5em",
    padding: "0 0 30px 0",
    "& h1": {
      padding: "0 30px 20px 30px"
    },
    "& p": {
      padding: "0 30px",
      fontWeight: "300"
    }
  },
  workspaces: {
    display: "grid",
    padding: "0 30px",
    gridGap: "15px",
    gridTemplateColumns: "repeat(1fr)",
    "@media screen and (min-width:768px)": {
      gridTemplateColumns: "repeat(2, 1fr)"
    },
    "@media screen and (min-width:1024px)": {
      gridTemplateColumns: "repeat(3, 1fr)"
    },
  },
  workspace: {
    position: "relative",
    padding: "20px",
    fontWeight: "300",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "1.2em",
    wordBreak: "break-word",
    "@media screen and (min-width:768px)": {
      whiteSpace: "nowrap"
    },
    "&:hover": {
      background: "#f3f3f3"
    }
  },
  workspaceSelectionModal: {
    overflow: "hidden",
    width: "90%",
    margin: "auto",
    "@media screen and (min-width:1024px)": {
      width: "900px"
    },
    "&.modal-dialog": {
      marginTop: "25vh",
      "& .modal-body": {
        padding: "0",
        maxHeight: "calc(100vh - 30vh -80px)",
        overflowY: "hidden"
      }
    }
  },
  noWorkspacesModal: {
    "&.modal-dialog": {
      marginTop: "40vh",
      "& .modal-body": {
        padding: "0 30px 15px 30px",
        fontSize: "1.6rem",
        "@media screen and (min-width:768px)": {
          whiteSpace: "nowrap"
        }
      }
    }
  }
};

@injectStyles(styles)
@observer
class App extends React.Component {
  componentDidMount() {
    authStore.initiliazeAuthenticate();
    // Init of sentry (logs) bucket
    const cookies = new Cookies();
    const sentryUrl = cookies.get("sentry_url");
    if (sentryUrl) {
      Sentry.init({
        dsn: sentryUrl
      });
    }
  }

  componentDidCatch(error, info) {
    appStore.setGlobalError(error, info);
  }

  handleRetryRetriveUserProfile = () => authStore.retriveUserProfile();

  handleRetryAuthenticate = () => authStore.initiliazeAuthenticate();

  handleClick = workspace => authStore.setCurrentWorkspace(workspace);

  render() {
    const { classes } = this.props;
    const Theme = appStore.availableThemes[appStore.currentTheme];
    return (
      <div className={classes.layout}>
        <Theme />
        <div className={classes.tabs}>
          <div className={`${classes.logo} layout-logo`} onClick={this.handleGoToDashboard}>
            {/* <img src={`${window.rootPath}/assets/HBP.png`} alt="" width="30" height="30" /> */}
            <span>Knowledge Graph Query Builder</span>
          </div>
          {!appStore.globalError &&
          <React.Fragment>
            {authStore.isFullyAuthenticated && authStore.hasWorkspaces && authStore.currentWorkspace?
              <WorkspaceSelector />: <div></div>
            }
            <div></div>
            {authStore.isFullyAuthenticated && <UserProfileTab className={classes.userProfileTab} size={32} />
            }
          </React.Fragment>}
        </div>
        <div className={classes.body}>
          {appStore.globalError ?
            <GlobalError />
            :
            authStore.authError?
              <div className={classes.authError}>
                <BGMessage icon={"ban"}>
                  {`There was a problem authenticating (${authStore.authError}).
                    If the problem persists, please contact the support.`}<br /><br />
                  <Button bsStyle={"primary"} onClick={this.handleRetryAuthenticate}>
                    <FontAwesomeIcon icon={"redo-alt"} /> &nbsp; Retry
                  </Button>
                </BGMessage>
              </div>
              :
              authStore.isInitializing?
                <div className={classes.loader}>
                  <FetchingLoader>Initializing authentication...</FetchingLoader>
                </div>
                :
                !authStore.isAuthenticated ?
                  <Login />
                  :
                  authStore.userProfileError ?
                    <div className={classes.authError}>
                      <BGMessage icon={"ban"}>
                        {`There was a network problem retrieving user profile (${authStore.userProfileError}).
                          If the problem persists, please contact the support.`}<br /><br />
                        <Button bsStyle={"primary"} onClick={this.handleRetryRetriveUserProfile}>
                          <FontAwesomeIcon icon={"redo-alt"} /> &nbsp; Retry
                        </Button>
                      </BGMessage>
                    </div>
                    :
                    authStore.isRetrievingUserProfile ?
                      <div className={classes.loader}>
                        <FetchingLoader>Retrieving user profile...</FetchingLoader>
                      </div>
                      :
                      authStore.hasWorkspaces?
                        authStore.currentWorkspace?
                          <QueryBuilder />
                          :
                          <Modal dialogClassName={classes.workspaceSelectionModal} show={true} centered>
                            <Modal.Body>
                              <div className={classes.workspacesSelection}>
                                <h1>Welcome <span title={name}>{name}</span></h1>
                                <p>Please select a workspace:</p>
                                <div style={{height: `${Math.round(Math.min(window.innerHeight * 0.5 - 140, Math.ceil(authStore.workspaces.length / 3) * 80))}px`}}>
                                  <Scrollbars>
                                    <div className={classes.workspaces}>
                                      {authStore.workspaces.map(workspace =>
                                        <div className={classes.workspace} key={workspace} onClick={() => this.handleClick(workspace)}>{workspace}</div>
                                      )}
                                    </div>
                                  </Scrollbars>
                                </div>
                              </div>
                            </Modal.Body>
                          </Modal>
                        :
                        <Modal dialogClassName={classes.noWorkspacesModal} show={true} centered>
                          <Modal.Body>
                            <h1>Welcome <span title={name}>{name}</span></h1>
                            <p>You are currently not granted permission to acccess any workspaces.</p>
                            <p>Please contact our team by email at : <a href={"mailto:kg-team@humanbrainproject.eu"}>kg-team@humanbrainproject.eu</a></p>
                          </Modal.Body>
                        </Modal>
                    
          }
        </div>
        <div className={`${classes.status} layout-status`}>
              Copyright &copy; {new Date().getFullYear()} EBRAINS. All rights reserved.
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));