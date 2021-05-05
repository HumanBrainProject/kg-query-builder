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

import React from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";

import { useStores } from "../../Hooks/UseStores";

const useStyles = createUseStyles({
  container: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "var(--bg-color-blend-contrast1)",
    zIndex: "1200",
    "& > div": {
      position: "absolute",
      top: "50%",
      left: "50%",
      minWidth: "220px",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "5px",
      background: "white",
      textAlign: "center",
      boxShadow: "2px 2px 4px #7f7a7a",
      "& h5": {
        margin: "0",
        paddingBottom: "20px",
        color: "red"
      },
      "& button + button, & a + button, & a + a": {
        marginLeft: "20px"
      }
    }
  }
});

const SaveError = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleSave = () => queryBuilderStore.saveQuery();

  const handleCancelSave = () => queryBuilderStore.cancelSaveQuery();

  if (!queryBuilderStore.saveError) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div>
        <h5>{queryBuilderStore.saveError}</h5>
        <div>
          <Button variant="secondary" onClick={handleCancelSave}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Retry</Button>
        </div>
      </div>
    </div>
  );
});
SaveError.displayName = "SaveError";

export default SaveError;