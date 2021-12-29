/*
 * Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This open source software code was developed in part or in whole in the
 * Human Brain Project, funded from the European Union's Horizon 2020
 * Framework Programme for Research and Innovation under
 * Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 * (Human Brain Project SGA1, SGA2 and SGA3).
 *
 */

import React, { useState, useRef } from "react";
import ReactJson from "react-json-view";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Scrollbars } from "react-custom-scrollbars";

import { useStores } from "../../../Hooks/UseStores";

import ThemeRJV from "../../../Themes/ThemeRJV";
import ResultTable from "./ResultTable";

const useStyles = createUseStyles({
  container:{
    position:"relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    height: "100%",
    color:"var(--ft-color-loud)",
    background:"var(--bg-color-ui-contrast3)",
    border: "1px solid var(--border-color-ui-contrast1)",
  },
  toggle: {
    textAlign: "right",
    padding: "10px 10px 0 0"
  },
  result: {
    padding:"10px"
  },
  executionTime: {
    float: "left",
    paddingLeft: "10px",
    paddingTop: "8px"
  }
});

const Result = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const [viewAsTable, setViewAsTable] = useState(false);

  const scrollRef = useRef();

  const selectTable = () => setViewAsTable(true);

  const selectJSON = () => setViewAsTable(false);

  if (!queryBuilderStore.result) {
    return null;
  }

  const executionTime = `${queryBuilderStore.result.durationInMs/1000} seconds`;  
  return (
    <div className={classes.container}>
      <div className={classes.toggle}>
        <span className={classes.executionTime}>
          Took {executionTime}.
        </span>
        <ButtonGroup>
          <Button variant="secondary" onClick={selectJSON}>JSON</Button>
          <Button variant="secondary" onClick={selectTable}>Table</Button>
        </ButtonGroup>
      </div>
      <div className={classes.result}>
        <Scrollbars autoHide ref={scrollRef}>
          {viewAsTable?
            <ResultTable />
            :
            <ReactJson collapsed={1} name={false} theme={ThemeRJV} src={queryBuilderStore.result} />
          }
        </Scrollbars>
      </div>
    </div>
  );

});
Result.displayName = "Result";

export default Result;