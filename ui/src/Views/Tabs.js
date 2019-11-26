import React from "react";
import { observer } from "mobx-react";
import injectStyles from "react-jss";

import appStore from "../Stores/AppStore";
import authStore from "../Stores/AuthStore";

import UserProfileTab from "./UserProfileTab";
import WorkspaceSelector from "../Components/WorkspaceSelector";

const styles = {
  container: {
    background: "var(--bg-color-ui-contrast1)",
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto 1fr auto"
  },
  fixedTabsLeft: {
    display: "grid",
    gridTemplateColumns: "repeat(6, auto)"
  },
  fixedTabsRight: {
    display: "grid",
    gridTemplateColumns: "repeat(6, auto)"
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
  userProfileTab: {
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    color: "var(--ft-color-normal)",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast2)",
    borderLeft: "none"
  }
};

@injectStyles(styles)
@observer
class Tabs extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={`${classes.logo} layout-logo`} onClick={this.handleGoToDashboard}>
          <img src={`${window.rootPath}/assets/ebrains.svg`} alt="" width="30" height="30" />
          <span>Knowledge Graph Query Builder</span>
        </div>
        {!appStore.globalError &&
          <React.Fragment>
            <div className={classes.fixedTabsLeft}>
              {authStore.isFullyAuthenticated && authStore.hasWorkspaces && appStore.currentWorkspace?
                <WorkspaceSelector />
                : null
              }
            </div>
            <div className={classes.fixedTabsRight}>
              {authStore.isFullyAuthenticated &&
                <React.Fragment>
                  {/* <Tab icon={"question-circle"} current={matchPath(this.state.currentLocationPathname, { path: "/help", exact: "true" })} path={"/help"} hideLabel label={"Help"} /> */}
                  <UserProfileTab className={classes.userProfileTab} size={32} />
                </React.Fragment>
              }
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default Tabs;