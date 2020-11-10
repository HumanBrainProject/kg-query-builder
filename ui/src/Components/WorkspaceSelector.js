import React from "react";
import { observer } from "mobx-react";
import Dropdown from "react-bootstrap/Dropdown";
import { createUseStyles } from "react-jss";
import authStore from "../Stores/AuthStore";
import CustomDropdownToggle from "./CustomDropdownToggle";
import appStore from "../Stores/AppStore";


const useStyles = createUseStyles({
  container: {
    height: "50px",
    lineHeight: "50px",
    color: "var(--ft-color-normal)",
    background: "var(--bg-color-ui-contrast2)",
    padding: "0 20px 0 20px",
    border: "1px solid var(--border-color-ui-contrast2)",
    borderLeft: "none",
    cursor: "pointer",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    "& .btn-group": {
      margin: "-2px"
    }
  },
  dropdownMenu: {
    background: "var(--ft-color-loud)",
    margin: "0 0 0 -20px",
    fontSize: "0.9em"
  }
});

const WorkspaceSelector = observer(() => {
  const classes = useStyles();

  const selectWorkspace = eventKey => appStore.setCurrentWorkspace(eventKey);

  return (
    <div className={classes.container} title={`${appStore.currentWorkspace} workspace`}>
      {authStore.workspaces.length > 1 ?
        <Dropdown id="dropdown-custom-1">
          <CustomDropdownToggle bsRole="toggle">{appStore.currentWorkspace}</CustomDropdownToggle>
          <Dropdown.Menu className={classes.dropdownMenu}>
            {authStore.workspaces.map(workspace =>
              <Dropdown.Item key={workspace}
                eventKey={workspace}
                onSelect={selectWorkspace}>
                {workspace}</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        : appStore.currentWorkspace}
    </div>
  );
});

export default WorkspaceSelector;