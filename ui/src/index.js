import React from "react";
import { render } from "react-dom";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import injectStyles from "react-jss";

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
  fixedTabsLeft: {
    display: "grid",
    gridTemplateColumns: "repeat(6, auto)"
  },
  dynamicTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 0.5fr))"
  },
  fixedTabsRight: {
    display: "grid",
    gridTemplateColumns: "repeat(6, auto)"
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
    background: "var(--bg-color-ui-contrast1)"
  },
  savebar: {
    position: "absolute",
    top: 0,
    right: "-400px",
    width: "400px",
    background: "var(--bg-color-ui-contrast3)",
    borderLeft: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    height: "100%",
    zIndex: 2,
    transition: "right 0.25s ease",
    "&.show": {
      right: "0",
    }
  },
  savebarToggle: {
    cursor: "pointer",
    position: "absolute",
    bottom: "10px",
    right: "100%",
    background: "linear-gradient(90deg, var(--bg-color-ui-contrast1), var(--bg-color-ui-contrast3))",
    borderRadius: "3px 0 0 3px",
    padding: "10px",
    border: "1px solid var(--border-color-ui-contrast1)",
    borderRight: "none",
    textAlign: "center",
    color: "#e67e22",
    "&:hover": {
      background: "var(--bg-color-ui-contrast3)"
    }
  },
  savebarToggleIcon: {
    animation: "pulse 2s linear infinite"
  },
  "@keyframes pulse": {
    "0%": {
      "transform": "scale(1.1)"
    },
    "50%": {
      "transform": "scale(0.8)"
    },
    "100%": {
      "transform": "scale(1.1)"
    }
  },
  userProfileLoader: {
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
  userProfileError: {
    color: "var(--ft-color-loud)"
  },
  userProfileErrorFooterBar: {
    marginBottom: "10px",
    width: "100%",
    textAlign: "center",
    wordBreak: "keep-all",
    whiteSpace: "nowrap",
    "& button + button": {
      marginLeft: "20px"
    }
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
  deleteInstanceErrorModal: {
    "& .modal-dialog": {
      top: "35%",
      width: "max-content",
      maxWidth: "800px",
      "& .modal-body": {
        padding: "15px 25px",
        border: "1px solid var(--ft-color-loud)",
        borderRadius: "4px",
        color: "var(--ft-color-loud)",
        background: "var(--list-bg-hover)"
      }
    }
  },
  deleteInstanceError: {
    margin: "20px 0",
    color: "var(--ft-color-error)"
  },
  deleteInstanceErrorFooterBar: {
    marginBottom: "10px",
    width: "100%",
    textAlign: "center",
    wordBreak: "keep-all",
    whiteSpace: "nowrap",
    "& button + button": {
      marginLeft: "20px"
    }
  },
  deletingInstanceModal: {
    "& .modal-dialog": {
      top: "35%",
      width: "max-content",
      maxWidth: "800px",
      "& .modal-body": {
        padding: "30px",
        border: "1px solid var(--ft-color-loud)",
        borderRadius: "4px",
        color: "var(--ft-color-loud)",
        background: "var(--list-bg-hover)",
        "& .fetchingPanel": {
          position: "unset !important",
          top: "unset",
          left: "unset",
          width: "unset",
          transform: "none",
          wordBreak: "break-word",
          "& .fetchingLabel": {
            display: "inline"
          }
        }
      }
    }
  },
  newInstanceModal: {
    overflow: "hidden",
    width: "90%",
    "@media screen and (min-width:1024px)": {
      width: "900px",
    },
    "& .modal-body": {
      height: "calc(95vh - 52px)",
      padding: "3px 0",
      maxHeight: "calc(100vh - 210px)",
      overflowY: "auto"
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

  handleRetryRetriveUserProfile = () => {
    authStore.retriveUserProfile();
  }

  render() {
    const { classes } = this.props;
    const Theme = appStore.availableThemes[appStore.currentTheme];
    return (
      <div className={classes.layout}>
        <Theme />
        <div className={classes.tabs}>
          <div className={`${classes.logo} layout-logo`} onClick={this.handleGoToDashboard}>
            <img src={`${window.rootPath}/assets/HBP.png`} alt="" width="30" height="30" />
            <span>Knowledge Graph Query Builder</span>
          </div>
          {!appStore.globalError &&
              <div className={classes.fixedTabsRight}>
                {authStore.isFullyAuthenticated && <UserProfileTab className={classes.userProfileTab} size={32} />
                }
              </div>}
        </div>
        <div className={classes.body}>
          {appStore.globalError ?
            <GlobalError />
            :
            !authStore.isOIDCAuthenticated ?
              <Login />
              :
              authStore.isFullyAuthenticated ?
                <QueryBuilder />: null
          }
          {authStore.isOIDCAuthenticated && !authStore.hasUserProfile && (
            authStore.isRetrievingUserProfile ?
              <div className={classes.userProfileLoader}>
                <FetchingLoader>Retrieving user profile...</FetchingLoader>
              </div>
              :
              authStore.userProfileError ?
                <div className={classes.userProfileError}>
                  <BGMessage icon={"ban"}>
                    {`There was a network problem retrieving user profile (${authStore.userProfileError}).
                      If the problem persists, please contact the support.`}<br /><br />
                    <Button bsStyle={"primary"} onClick={this.handleRetryRetriveUserProfile}>
                      <FontAwesomeIcon icon={"redo-alt"} /> &nbsp; Retry
                    </Button>
                  </BGMessage>
                </div>
                : null
          )}
        </div>
        <div className={`${classes.status} layout-status`}>
              Copyright &copy; {new Date().getFullYear()} Human Brain Project. All rights reserved.
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
