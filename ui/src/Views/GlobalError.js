import React from "react";
import { createUseStyles } from "react-jss";
import Button from "react-bootstrap/Button";

import appStore from "../Stores/AppStore";
import BGMessage from "../Components/BGMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Sentry from "@sentry/browser";

const useStyles = createUseStyles({
  container: {
    height: "100%",
    color: "var(--ft-color-loud)"
  }
});

const GlobalError = () => {

  const classes = useStyles();

  const handleDismiss = () => appStore.dismissGlobalError();

  return (
    <div className={classes.container}>
      <BGMessage icon={"exclamation-circle"}>
        An unexpected error has occured.<br />
        We recommend you to save all your changes and reload the application in your browser.<br />
        If the problem persists, please contact the support.<br /><br />
        <Button variant="primary" onClick={handleDismiss}>
          <FontAwesomeIcon icon={"check"} /> &nbsp; Dismiss
        </Button>&nbsp;&nbsp;
        <Button variant="warning" onClick={() => Sentry.showReportDialog({ title: "An unexpected error has occured.", subtitle2: "We recommend you to save all your changes and reload the application in your browser. The KG team has been notified. If you'd like to help, tell us what happened below.", labelEmail: "Email(optional)", labelName: "Name(optional)", user: { email: "error@kgeditor.com", name: "Error Reporter" }, labelComments: "Please fill in a description of your error use case" })}>
          <FontAwesomeIcon icon={"envelope"} /> &nbsp; Send an error report
        </Button>
      </BGMessage>
    </div >
  );
};

export default GlobalError;
