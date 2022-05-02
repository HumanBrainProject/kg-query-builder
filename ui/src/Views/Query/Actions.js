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
import _ from "lodash-uuid";
import ReactPiwik from "react-piwik";

import { useStores } from "../../Hooks/UseStores";
import { useNavigate } from "react-router-dom";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px",
  },
  save: {
    textAlign: "right",
    "& button": {
      marginLeft: "10px",
    },
  },
});

const SaveQuery = observer(({ cancelDisabled, saveDisabled, onCancel, onSave }) => {
  return (
    <React.Fragment>
      <Button variant="secondary" disabled={cancelDisabled} onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" disabled={saveDisabled} onClick={onSave}>
        <FontAwesomeIcon icon="save" />
        &nbsp;Save
      </Button>
    </React.Fragment>
  );
});

const MultipleActions = observer(({
  compareDisabled,
  copyAsNewDisabled,
  saveAsDisabled,
  saveDisabled,
  onCompare,
  onCopyAsNew,
  onRevert,
  onSaveAs,
  onSave,
}) => {
  const { queryBuilderStore } = useStores();
  return (
    <React.Fragment>
      {queryBuilderStore.hasChanged && (
        <Button disabled={compareDisabled} onClick={onCompare}>
          <FontAwesomeIcon icon="glasses" />
          &nbsp;Compare
        </Button>
      )}
      {queryBuilderStore.isQuerySaved && (
        <Button
          variant="secondary"
          onClick={onCopyAsNew}
          disabled={copyAsNewDisabled}
        >
          <FontAwesomeIcon icon="copy" />
          &nbsp;Copy as a new query
        </Button>
      )}
      {queryBuilderStore.hasChanged &&
        !queryBuilderStore.savedQueryHasInconsistencies && (
          <Button variant="secondary" onClick={onRevert}>
            <FontAwesomeIcon icon="undo-alt" />
            &nbsp;Undo changes
          </Button>
        )}
      <Button variant="secondary" disabled={saveAsDisabled} onClick={onSaveAs}>
        <FontAwesomeIcon icon="save" />
        &nbsp;Save As
      </Button>
      <Button variant="primary" disabled={saveDisabled} onClick={onSave}>
        <FontAwesomeIcon icon="save" />
        &nbsp;Save
      </Button>
    </React.Fragment>
  );
});

const Actions = observer(({ className }) => {
  const classes = useStyles();

  const navigation = useNavigate();

  const { queryBuilderStore } = useStores();

  const handleToggleCompareChanges = () => {
    ReactPiwik.push([
      "trackEvent",
      "Query",
      "Compare",
      queryBuilderStore.rootField.id,
    ]);
    queryBuilderStore.toggleCompareChanges();
  };

  const handleSave = () => {
    ReactPiwik.push([
      "trackEvent",
      "Query",
      "Save",
      queryBuilderStore.rootField.id,
    ]);
    queryBuilderStore.saveQuery(navigation);
  };

  const handleRevertChanges = () => queryBuilderStore.cancelChanges();

  const handleShowSaveDialog = () => {
    ReactPiwik.push([
      "trackEvent",
      "Query",
      "SaveAs",
      queryBuilderStore.rootField.id,
    ]);
    queryBuilderStore.setSaveAsMode(true);
  };

  const handleHideSaveDialog = () => queryBuilderStore.setSaveAsMode(false);

  const handleResetQuery = () => queryBuilderStore.resetRootSchema();

  const handleNewQuery = () => {
    ReactPiwik.push([
      "trackEvent",
      "Query",
      "CopyAsNew",
      queryBuilderStore.rootField.id,
    ]);
    const uuid = _.uuid();
    queryBuilderStore.setAsNewQuery(uuid);
    navigation(`/queries/${uuid}`);
  };

  if (queryBuilderStore.isQuerySaved) {
    if (queryBuilderStore.canSaveQuery) {
      if (queryBuilderStore.saveAsMode) {
        return (
          <div className={`${classes.container} ${className}`}>
            <div className={classes.save}>
              <SaveQuery
                cancelDisabled={
                  queryBuilderStore.isSaving || !!queryBuilderStore.saveError
                }
                saveDisabled={
                  queryBuilderStore.isSaving ||
                  !!queryBuilderStore.saveError ||
                  queryBuilderStore.isQueryEmpty
                }
                onCancel={handleHideSaveDialog}
                onSave={handleSave}
              />
            </div>
          </div>
        );
      }
      return (
        <div className={`${classes.container} ${className}`}>
          <div className={classes.save}>
            <MultipleActions
              compareDisabled={
                queryBuilderStore.isSaving ||
                !!queryBuilderStore.saveError ||
                !queryBuilderStore.hasQueryChanged
              }
              copyAsNewDisabled={
                queryBuilderStore.isSaving || !!queryBuilderStore.saveError
              }
              saveAsDisabled={
                queryBuilderStore.isSaving ||
                !!queryBuilderStore.saveError ||
                queryBuilderStore.isQueryEmpty
              }
              saveDisabled={
                queryBuilderStore.isSaving ||
                !!queryBuilderStore.saveError ||
                !queryBuilderStore.hasChanged ||
                queryBuilderStore.isQueryEmpty ||
                (queryBuilderStore.sourceQuery &&
                  queryBuilderStore.sourceQuery.isDeleting)
              }
              onCompare={handleToggleCompareChanges}
              onCopyAsNew={handleNewQuery}
              onSaveAs={handleShowSaveDialog}
              onSave={handleSave}
              onRevert={handleRevertChanges}
            />
          </div>
        </div>
      );
    }
    if (queryBuilderStore.saveAsMode) {
      return (
        <div className={`${classes.container} ${className}`}>
          <div className={classes.save}>
            <SaveQuery
              cancelDisabled={
                queryBuilderStore.isSaving || !!queryBuilderStore.saveError
              }
              saveDisabled={
                queryBuilderStore.isSaving ||
                !!queryBuilderStore.saveError ||
                queryBuilderStore.isQueryEmpty
              }
              onCancel={handleHideSaveDialog}
              onSave={handleSave}
            />
          </div>
        </div>
      );
    }
    return (
      <div className={`${classes.container} ${className}`}>
        <div className={classes.save}>
          {queryBuilderStore.hasChanged && (
            <Button
              disabled={
                queryBuilderStore.isSaving ||
                !!queryBuilderStore.saveError ||
                !queryBuilderStore.hasQueryChanged
              }
              onClick={handleToggleCompareChanges}
            >
              <FontAwesomeIcon icon="glasses" />
              &nbsp;Compare
            </Button>
          )}
          {queryBuilderStore.hasChanged &&
            !queryBuilderStore.savedQueryHasInconsistencies && (
              <Button
                variant="secondary"
                disabled={
                  queryBuilderStore.isSaving || !!queryBuilderStore.saveError
                }
                onClick={handleRevertChanges}
              >
                <FontAwesomeIcon icon="undo-alt" />
                &nbsp;Undo changes
              </Button>
            )}
          {queryBuilderStore.isQuerySaved && (
            <Button
              variant="secondary"
              onClick={handleNewQuery}
              disabled={
                queryBuilderStore.isSaving || !!queryBuilderStore.saveError
              }
            >
              <FontAwesomeIcon icon="copy" />
              &nbsp;Copy as a new query
            </Button>
          )}
          <Button
            variant="secondary"
            disabled={
              queryBuilderStore.isSaving ||
              !!queryBuilderStore.saveError ||
              queryBuilderStore.isQueryEmpty
            }
            onClick={handleShowSaveDialog}
          >
            <FontAwesomeIcon icon="save" />
            &nbsp;Save As
          </Button>
        </div>
      </div>
    );
  }

  if (queryBuilderStore.saveAsMode) {
    return (
      <div className={`${classes.container} ${className}`}>
        <div className={classes.save}>
          <SaveQuery
            cancelDisabled={
              queryBuilderStore.isSaving || !!queryBuilderStore.saveError
            }
            saveDisabled={
              queryBuilderStore.isSaving ||
              !!queryBuilderStore.saveError ||
              !queryBuilderStore.hasChanged ||
              queryBuilderStore.isQueryEmpty
            }
            onCancel={handleHideSaveDialog}
            onSave={handleSave}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${classes.container} ${className}`}>
      <div className={classes.save}>
        <Button
          variant="secondary"
          disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError}
          onClick={handleResetQuery}
        >
          <FontAwesomeIcon icon="undo-alt" />
          &nbsp;Reset
        </Button>
        {queryBuilderStore.isQuerySaved && (
          <Button
            variant="secondary"
            onClick={handleNewQuery}
            disabled={
              queryBuilderStore.isSaving || !!queryBuilderStore.saveError
            }
          >
            <FontAwesomeIcon icon="copy" />
            &nbsp;Copy as a new query
          </Button>
        )}
        <Button
          variant="secondary"
          disabled={
            queryBuilderStore.isSaving ||
            !!queryBuilderStore.saveError ||
            !queryBuilderStore.hasChanged
          }
          onClick={handleShowSaveDialog}
        >
          <FontAwesomeIcon icon="save" />
          &nbsp;Save As
        </Button>
      </div>
    </div>
  );
});

export default Actions;
