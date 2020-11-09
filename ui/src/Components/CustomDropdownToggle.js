import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  dropdownLink: {
    color: "var(--ft-color-normal)",
    fontSize: "0.9em",
    textDecoration: "none",
    "&:hover": {
      color: "var(--ft-color-loud)",
      textDecoration: "none"
    }
  }
});

const CustomDropdownToggle = () => {

  const classes = useStyles();

  const handleClick = e => {
    e.preventDefault();
    this.props.onClick(e);
  }

  return (
    <a onClick={handleClick} className={classes.dropdownLink}>
      {this.props.children} <FontAwesomeIcon icon={"caret-down"} />
    </a>
  );
};

export default CustomDropdownToggle;