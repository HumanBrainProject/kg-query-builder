import React from "react";
import injectStyles from "react-jss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react";
import { isFunction } from "lodash";

const useStyles = createUseStyles({
  container:{
    height:"50px",
    lineHeight:"50px",
    color:"var(--ft-color-normal)",
    background:"var(--bg-color-ui-contrast2)",
    padding:"0 20px 0 20px",
    border:"1px solid var(--border-color-ui-contrast2)",
    borderLeft:"none",
    cursor:"pointer",
    display:"grid",
    gridTemplateColumns:"auto 1fr auto",
    "& $icon": {
      opacity:0.5
    },
    "&:hover":{
      color:"var(--ft-color-loud)",
      "& $icon": {
        opacity:1
      }
    }
  },
  current:{
    backgroundColor:"var(--bg-color-ui-contrast3)",
    color:"var(--ft-color-loud)",
    borderBottom:"1px solid #40a9f3",
    "& $icon": {
      opacity:1
    }
  },
  text:{
    display:"inline-block",
    overflow:"hidden",
    textOverflow:"ellipsis",
    whiteSpace:"nowrap",
    "& + $close":{
      marginLeft:"10px"
    }
  },
  icon:{
    color:"var(--ft-color-loud)",
    display:"inline-block",
    "& + $text":{
      marginLeft:"10px"
    }
  },
  close:{
    color:"var(--ft-color-normal)",
    padding:"0 10px",
    "&:hover":{
      color:"var(--ft-color-loud)"
    }
  }
});

const Tab = observer(({ current, icon, iconColor, hideLabel}) => {
  const classes = useStyles();

  const handleClick = e => {
    e.preventDefault();
    if(isFunction(this.props.onClick)){
      this.props.onClick(e);
    }
  };

  return (
    <div className={`${classes.container} ${current? classes.current: ""}`} onClick={handleClick}>
      <div className={classes.icon} style={iconColor?{color:iconColor}:{}} title={this.props.label}>
        {icon && <FontAwesomeIcon fixedWidth icon={icon} />}
      </div>
      {hideLabel?null:
        <div className={classes.text} title={this.props.label}>
          {this.props.label}
        </div>
      }
    </div>
  );

});

export default Tab;