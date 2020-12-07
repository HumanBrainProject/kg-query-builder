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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    marginBottom: "20px",
    paddingTop: "10px",
    "&:last-child": {
      marginBottom: 0
    }
  },
  select: {
    display: "inline-block",
    minWidth: "100px",
    paddingRight: "20px",
    backgroundColor: "rgb(108, 117, 125)",
    borderColor: "transparent",
    color: "white",
    "-webkit-appearance": "none",
    "&:hover": {
      backgroundColor: "#5a6268",
      borderColor: "#5a6268"
    }
  },
  selectBox: {
    position: "relative",
    "&:after": {
      content: "\"\"",
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      marginTop: "-3px",
      borderTop: "6px solid white",
      borderRight: "6px solid transparent",
      borderLeft: "6px solid transparent",
      pointerEvents: "none"
    }
  },
  label: {
    lineHeight: "1.7rem",
    marginRight: "6px"
  }
});


const SingleItemStrategy = observer(({ strategy, show, onChange }) => {

  const classes = useStyles();

  const handleChange = e => {
    const value = e.target.value === "NONE"?undefined:e.target.value;
    onChange("singleValue", value);
  };

  if (!show) {
    return null;
  }

  const selectedValue = strategy === undefined?"NONE":strategy;

  return (
    <div className={classes.container} >
      <span className={classes.label}>Single item strategy:&nbsp;</span>
      <div className={classes.selectBox}><select className={classes.select} value={selectedValue} onChange={handleChange}>
        <option value="NONE">None</option>
        <option value="FIRST">First</option>
        <option value="CONCAT">Concat</option>
      </select></div>
    </div>
  );
});
SingleItemStrategy.displayName = "SingleItemStrategy";

export default SingleItemStrategy;