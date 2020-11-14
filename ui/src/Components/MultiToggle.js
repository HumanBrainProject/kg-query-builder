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

import Toggle from "./Toggle";

const useStyles = createUseStyles({
  container:{
    display:"inline-grid",
    background:"var(--bg-color-ui-contrast4)",
    borderRadius:"20px",
    height:"24px"
  }
});

const MultiToggle = ({ children, selectedValue, onChange }) => {

  const classes = useStyles();

  const handleSelect = value => {
    if (typeof onChange === "function") {
      onChange(value);
    }
  };

  const childrenWithProps = React.Children.map(children, child => child && React.cloneElement(child, { selectedValue: selectedValue, onSelect: handleSelect }));

  return(
    <div className={classes.container} style={{gridTemplateColumns:`repeat(${childrenWithProps.length}, 24px)`}}>
      {childrenWithProps}
    </div>
  );
};

MultiToggle.Toggle = Toggle;

export default MultiToggle;