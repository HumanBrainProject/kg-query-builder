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

import Icon from "../../../Components/Icon";

import queryBuilderStore from "../../../Stores/QueryBuilderStore";

const useStyles = createUseStyles({
  container: {
    margin: "4px 1px",
    padding: "15px 10px",
    background: "var(--bg-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    fontSize: "1.2em",
    fontWeight: "normal",
    cursor: "pointer",
    transition: "background .3s ease-in-out",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "&:hover": {
      background: "var(--bg-color-ui-contrast4)"
    }
  }
});

const Schemas = observer(({ type }) =>  {

  const classes = useStyles();

  const handleClick = () => queryBuilderStore.selectRootSchema(type);

  return (
    <div className={classes.container} onClick={handleClick}>
      <Icon icon="circle" color={type.color}/>
      {type.label} - <small>{type.id}</small>
    </div>
  );
});

export default Schemas;