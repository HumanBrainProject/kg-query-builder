import * as Sentry from "@sentry/browser";
import { observer } from "mobx-react";
import React from "react";
import { Modal } from "react-bootstrap";
import { render } from "react-dom";
import injectStyles from "react-jss";
import Cookies from "universal-cookie";
import "./Services/IconsImport";
import appStore from "./Stores/AppStore";
import authStore from "./Stores/AuthStore";
import GlobalError from "./Views/GlobalError";
import Login from "./Views/Login";
import QueryBuilder from "./Views/QueryBuilder";
import WorkspaceModal from "./Views/WorkspaceModal";
import Tabs from "./Views/Tabs";
import "@babel/polyfill";




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
  body: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(var(--bg-gradient-angle), var(--bg-gradient-start), var(--bg-gradient-end))",
    backgroundSize: "200%"
  },
  status: {
    background: "var(--bg-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    paddingLeft: "10px"
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
    appStore.initialize();
    document.addEventListener("keydown", appStore.handleGlobalShortcuts);
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

  render() {
    const { classes } = this.props;
    const Theme = appStore.availableThemes[appStore.currentTheme];
    return (
      <div className={classes.layout}>
        <Theme />
        <Tabs />
        <div className={classes.body}>
          {appStore.globalError ?
            <GlobalError />
            :
            (!appStore.isInitialized || !authStore.isAuthenticated ?
              <Login />
              :
              (authStore.hasUserWorkspaces?
                (appStore.currentWorkspace?
                  <QueryBuilder />
                  :
                  <WorkspaceModal />)
                :
                <Modal dialogClassName={classes.noWorkspacesModal} show={true}>
                  <Modal.Body>
                    <h1>Welcome <span title={name}>{name}</span></h1>
                    <p>You are currently not granted permission to acccess any workspaces.</p>
                    <p>Please contact our team by email at : <a href={"mailto:kg-team@humanbrainproject.eu"}>kg-team@humanbrainproject.eu</a></p>
                  </Modal.Body>
                </Modal>
              )
            )
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