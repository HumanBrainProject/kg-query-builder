import React from "react";
import { observer } from "mobx-react";
import { createUseStyles } from "react-jss";

import appStore from "../Stores/AppStore";
import authStore from "../Stores/AuthStore";

import UserProfileTab from "./UserProfileTab";
import WorkspaceSelector from "../Components/WorkspaceSelector";

const useStyles = createUseStyles({
  container: {
    background: "var(--bg-color-ui-contrast1)",
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto 1fr auto"
  },
  fixedTabsLeft: {
    display: "grid",
    gridTemplateColumns: "auto 1fr"
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
});

const Tabs = observer(() => {

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={`${classes.logo} layout-logo`}>
        <img src={`${window.rootPath}/assets/ebrains.svg`} alt="" width="30" height="30" />
        <span>Knowledge Graph Query Builder</span>
      </div>
      {!appStore.globalError &&
          <React.Fragment>
            <div className={classes.fixedTabsLeft}>
              {authStore.isAuthenticated && authStore.isUserAuthorized && authStore.hasUserWorkspaces && appStore.currentWorkspace?
                <WorkspaceSelector />
                : null
              }
            </div>
            <div className={classes.fixedTabsRight}>
              {authStore.isAuthenticated && authStore.isUserAuthorized && (
                <UserProfileTab className={classes.userProfileTab} size={32} />
              )}
            </div>
          </React.Fragment>
      }
    </div>
  );

});

export default Tabs;