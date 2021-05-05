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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _  from "lodash-uuid";

import { useStores } from "../../Hooks/UseStores";

// import User from "../../../Components/User";

const useStyles = createUseStyles({
  container: {
    position:"relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px"
  },
  save: {
    textAlign: "right",
    "& button": {
      marginLeft: "10px"
    }
  }
});

const Actions = observer(({ className }) => {

  const classes = useStyles();

  const { queryBuilderStore, history } = useStores();

  const handleToggleCompareChanges = () => queryBuilderStore.toggleCompareChanges();

  const handleSave = () => queryBuilderStore.saveQuery();

  const handleRevertChanges = () => queryBuilderStore.cancelChanges();

  const handleShowSaveDialog = () => queryBuilderStore.setSaveAsMode(true);

  const handleHideSaveDialog = () => queryBuilderStore.setSaveAsMode(false);

  const handleResetQuery = () => queryBuilderStore.resetRootSchema();

  const handleNewQuery = () => {
    const uuid = _.uuid();
    queryBuilderStore.setAsNewQuery(uuid);
    history.push(`/queries/${uuid}`);
  };

  return (
    <div className={`${classes.container} ${className}`}>
      <div className={classes.save}>
        {queryBuilderStore.isQuerySaved?
          queryBuilderStore.isOneOfMySavedQueries?
            queryBuilderStore.saveAsMode?
              <React.Fragment>
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
              </React.Fragment>
              :
              <React.Fragment>
                {queryBuilderStore.hasChanged && (
                  <Button disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasQueryChanged}  onClick={handleToggleCompareChanges}><FontAwesomeIcon icon="glasses"/>&nbsp;Compare</Button>
                )}
                {queryBuilderStore.isQuerySaved && (
                  <Button variant="secondary" onClick={handleNewQuery} disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError}><FontAwesomeIcon icon="copy"/>&nbsp;Copy as a new query</Button>
                )}
                {queryBuilderStore.hasChanged && !queryBuilderStore.savedQueryHasInconsistencies &&  (
                  <Button variant="secondary" onClick={handleRevertChanges}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Undo changes</Button>
                )}
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
                <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged || queryBuilderStore.isQueryEmpty || (queryBuilderStore.sourceQuery && queryBuilderStore.sourceQuery.isDeleting)} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
              </React.Fragment>
            :
            queryBuilderStore.saveAsMode?
              <React.Fragment>
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
              </React.Fragment>
              :
              <React.Fragment>
                {queryBuilderStore.hasChanged && (
                  <Button disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasQueryChanged}  onClick={handleToggleCompareChanges}><FontAwesomeIcon icon="glasses"/>&nbsp;Compare</Button>
                )}
                {queryBuilderStore.hasChanged && !queryBuilderStore.savedQueryHasInconsistencies && (
                  <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleRevertChanges}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Undo changes</Button>
                )}
                {queryBuilderStore.isQuerySaved && (
                  <Button variant="secondary" onClick={handleNewQuery} disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError}><FontAwesomeIcon icon="copy"/>&nbsp;Copy as a new query</Button>
                )}
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
              </React.Fragment>
          :
          queryBuilderStore.saveAsMode?
            <React.Fragment>
              <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
              <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
            </React.Fragment>
            :
            <React.Fragment>
              <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleResetQuery}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Reset</Button>
              {queryBuilderStore.isQuerySaved && (
                <Button variant="secondary" onClick={handleNewQuery} disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError}><FontAwesomeIcon icon="copy"/>&nbsp;Copy as a new query</Button>
              )}
              <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
            </React.Fragment>
        }
      </div>
    </div>
  );
});
Actions.displayName = "Actions";

export default Actions;