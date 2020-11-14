/*
*   Copyright (c) 2020, EPFL/Human Brain Project PCO
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

import React from "react";
import { createUseStyles } from "react-jss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const Tab = ({ current, label, icon, iconColor, hideLabel, onClick}) => {
  const classes = useStyles();

  const handleClick = e => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  return (
    <div className={`${classes.container} ${current? classes.current: ""}`} onClick={handleClick}>
      <div className={classes.icon} style={iconColor?{color:iconColor}:{}} title={label}>
        {icon && <FontAwesomeIcon fixedWidth icon={icon} />}
      </div>
      {hideLabel?null:
        <div className={classes.text} title={label}>
          {label}
        </div>
      }
    </div>
  );
};

export default Tab;