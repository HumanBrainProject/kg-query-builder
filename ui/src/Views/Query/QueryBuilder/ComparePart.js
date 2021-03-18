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

const useStyles = createUseStyles({
  removed:{
    background: "#FADBD7",
    textDecoration: "line-through",
    "& + $added": {
      marginLeft: "3px"
    }
  },
  added:{
    background: "#A5EBC3",
    "& + $removed": {
      marginLeft: "3px"
    }
  },
  unchanged: {

  },
});

const ComparePart = ({ part }) => {

  const classes = useStyles();

  if (!part.value) {
    return null;
  }

  const className = part.added?classes.added:part.removed?classes.removed:classes.unchanged;

  return (
    <span className={className}>{part.value}</span>
  );
};

export default ComparePart;