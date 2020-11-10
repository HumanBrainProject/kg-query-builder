import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  fetchingPanel: {
    position: "absolute !important",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "1.2em",
    fontWeight: "lighter",
    width:"100%",
    textAlign:"center"
  },
  fetchingLabel: {
    paddingLeft: "6px",
    display:"inline-block"
  }
});

const FetchingLoader = ({ children }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.fetchingPanel} fetchingPanel`}>
      <FontAwesomeIcon icon="circle-notch" spin/>
      <span className={`${classes.fetchingLabel} fetchingLabel`}>
        {children}
      </span>
    </div>
  );
};

export default FetchingLoader;