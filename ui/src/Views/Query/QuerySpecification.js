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

import React, { useRef } from "react";
import ReactJson from "react-json-view";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars";

import { useStores } from "../../Hooks/UseStores";

import ThemeRJV from "../../Themes/ThemeRJV";

const useStyles = createUseStyles({
  container:{
    position:"relative",
    color:"var(--ft-color-loud)",
    background:"var(--bg-color-ui-contrast3)",
    border: "1px solid var(--border-color-ui-contrast1)",
    height: "calc(100% - 20px)",
    margin:"10px",
    padding:"10px"
  }
});

const QuerySpecification = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scrollRef = useRef();

  if (!queryBuilderStore.rootField) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Scrollbars autoHide ref={scrollRef}>
        <ReactJson collapsed={false} name={false} theme={ThemeRJV} src={queryBuilderStore.JSONQuery} />
      </Scrollbars>
    </div>
  );
});
QuerySpecification.displayName = "QuerySpecification";

export default QuerySpecification;