import React from "react";
import injectStyles from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const style = {
  container: {
    display: "inline-block",
    opacity: "0.5",
    paddingRight: "4px"
  }
};

@injectStyles(style)
class Icon extends React.Component {
  render() {
    const { classes, className, color, icon } = this.props;
    return (
      <div className={`${classes.container} ${className?className:""}`} style={color ? { color: color } : {}} >
        <FontAwesomeIcon fixedWidth icon={icon} />
      </div>
    );
  }
}

export default Icon;