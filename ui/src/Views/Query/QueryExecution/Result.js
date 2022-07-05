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

import React, { useRef } from "react";
import ReactJson from "react-json-view";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Button from "react-bootstrap/Button";
import { Scrollbars } from "react-custom-scrollbars-2";

import { useStores } from "../../../Hooks/UseStores";

import ThemeRJV from "../../../Themes/ThemeRJV";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    height: "100%",
    color: "var(--ft-color-loud)",
    background: "linear-gradient(90deg, rgba(5,25,35,0.4) 0%, rgba(5,20,35,0.8) 100%)",
    border: "1px solid var(--border-color-ui-contrast1)",
    "& .react-json-view": {
      backgroundColor: "rgba(0,0,0,0.3) !important"
    }
  },
  toggle: {
    textAlign: "right",
    padding: "10px 10px 0 0"
  },
  result: {
    padding: "10px"
  },
  executionTime: {
    float: "left",
    paddingLeft: "10px",
    paddingTop: "8px"
  }
});

const download = content => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "result.json";
  a.click();
};

const Result = observer(() => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scrollRef = useRef();

  const handeDownload = () => download(JSON.stringify(queryBuilderStore.result));

  if (!queryBuilderStore.result) {
    return null;
  }

  const executionTime = `${queryBuilderStore.result.durationInMs / 1000} seconds`;
  return (
    <div className={classes.container}>
      <div className={classes.toggle}>
        <span className={classes.executionTime}>Took {executionTime}.</span>
        <Button variant="secondary" onClick={handeDownload}>
          Download
        </Button>
      </div>
      <div className={classes.result}>
        <Scrollbars autoHide ref={scrollRef}>
          <ReactJson
            collapsed={1}
            name={false}
            theme={ThemeRJV}
            src={queryBuilderStore.result}
          />
        </Scrollbars>
      </div>
    </div>
  );
});
Result.displayName = "Result";

export default Result;
