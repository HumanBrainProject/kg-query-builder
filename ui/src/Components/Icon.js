import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  container: {
    display: "inline-block",
    opacity: "0.5",
    paddingRight: "4px"
  }
});

const Icon = ({ className, color, icon }) => {

  const classes = useStyles();

  return (
    <div className={`${classes.container} ${className?className:""}`} style={color ? { color: color } : {}} >
      <FontAwesomeIcon fixedWidth icon={icon} />
    </div>
  );
};

export default Icon;