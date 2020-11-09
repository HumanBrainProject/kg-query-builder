import React from "react";
import { createUseStyles } from "react-jss";

import Toggle from "./Toggle";

const useStyles = createUseStyles({
  container:{
    display:"inline-grid",
    background:"var(--bg-color-ui-contrast4)",
    borderRadius:"20px",
    height:"24px"
  }
});

const MultiToggle = ({ children, onChange }) => {

  const classes = useStyles();

  const handleSelect = value => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  const childrenWithProps = React.Children.map(children, child => child && React.cloneElement(child, { selectedValue: this.props.selectedValue, onSelect: handleSelect }));

  return(
    <div className={classes.container} style={{gridTemplateColumns:`repeat(${childrenWithProps.length}, 24px)`}}>
      {childrenWithProps}
    </div>
  );
};

MultiToggle.Toggle = Toggle;

export default MultiToggle;