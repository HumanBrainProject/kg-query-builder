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
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useStores } from "../../../Hooks/UseStores";

import User from "../../../Components/User";

const useStyles = createUseStyles({
  container: {
    position:"relative",
    display: "grid",
    gridTemplateColumns: "310px 1fr",
    gridColumnGap: "30px",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px",
    "& h5": {
      display: "inline-block",
      marginTop: 0,
      marginBottom: "8px"
    }
  },
  workspace: {
    marginTop: "20px",
    "& form-group": {
      marginBottom: 0
    }
  },
  description: {
    gridColumnStart: "span 2",
    marginTop: "20px",
    "& textarea": {
      minWidth: "100%",
      maxWidth: "100%",
      minHeight: "10rem"
    },
    "& + $save": {
      marginTop: "20px"
    }
  },
  input:{
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    color: "var(--ft-color-loud)",
    width:"100%",
    border:"1px solid transparent",
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    },
    "&.disabled,&:disabled":{
      backgroundColor: "var(--bg-color-blend-contrast1)",
      color: "var(--ft-color-normal)",
      cursor: "text"
    }
  },
  queryIdError: {
    gridColumnStart: "span 2",
    marginTop: "6px",
    color: "var(--ft-color-error)"
  },
  author: {
    gridColumnStart: "span 2",
    marginTop: "6px",
    color: "var(--ft-color-normal)",
    "& + $save": {
      marginTop: "20px"
    }
  },
  links: {
    gridColumnStart: "span 2",
    marginTop: "10px",
    color: "var(--ft-color-normal)",
    "& a, & a:visited, &a:active": {
      color: "var(--ft-color-loud)",
      "&:hover": {
        color: "var(--ft-color-louder)",
      }
    },
    "& + $save": {
      marginTop: "10px",
      paddingTop: "10px",
      borderTop: "1px solid var(--ft-color-quiet)"
    }
  },
  save: {
    gridColumnStart: "span 2",
    display: "flex",
    "&.split": {
      display: "block",
      textAlign: "right",
      "@media screen and (min-width:1600px)": {
        display: "flex"
      },
      "& > div, & > span": {
        marginBottom: "10px",
        paddingBottom: "10px",
        borderBottom: "1px solid var(--ft-color-quiet)",
        "@media screen and (min-width:1600px)": {
          marginBottom: 0,
          paddingBottom: 0,
          borderBottom: 0
        }
      },
      "& $collapsedHeader input + button": {
        margin: "6px !important",
        position: "absolute",
        top: "10px",
        right: "6px",
        "@media screen and (min-width:1600px)": {
          position: "relative",
          top: "unset",
          right: "unset"
        }
      }
    },
    "& > div, & > span": {
      flex: 1,
      color: "var(--ft-color-normal)"
    },
    "& > span": {
      paddingTop: "6px",
    },
    "& button": {
      marginLeft: "10px"
    }
  },
  tip: {
    padding: "10px",
    borderRadius: "4px",
    color: "var(--bg-color-info-normal)"
  },
  newQueryButton: {
    position:"absolute",
    right:"12px",
    top:"9px"
  },
  collapsedHeader: {
    display: "flex",
    color: "var(--ft-color-loud)",
    "& button": {
      "margin": "0 !important",
      "& svg": {
        transform: "rotateX(180deg)"
      }
    },
    "& h5": {
      display: "inline",
      alignSelf: "center",
      margin: 0,
      padding: 0
    },
    "& input": {
      display: "inline",
      width: "auto",
      padding: "6px",
      "& + button": {
        margin: "6px !important"
      }
    }
  },
  fontAwesomeIconButton: {
    display: "inline-block",
    margin: 0,
    padding: 0,
    border: 0,
    background: "transparent",
    outline: 0,
    "&:hover": {
      outline: 0
    }
  }
});

const QueryForm = observer(({ className }) => {

  const classes = useStyles();

  const { queryBuilderStore, authStore } = useStores();

  const handleChangeLabel = e => queryBuilderStore.setLabel(e.target.value);


  const handleChangeWorkspace = e => queryBuilderStore.setWorkspace(e.target.value);

  const handleChangeDescription = e => queryBuilderStore.setDescription(e.target.value);

  const handleToggleCompareChanges = () => queryBuilderStore.toggleCompareChanges();

  const handleSave = () => queryBuilderStore.saveQuery();

  const handleRevertChanges = () => queryBuilderStore.cancelChanges();

  const handleShowSaveDialog = () => {
    queryBuilderStore.setSaveAsMode(true);
    queryBuilderStore.setQueryId();
  };

  const handleHideSaveDialog = () => queryBuilderStore.setSaveAsMode(false);

  const handleResetQuery = () => queryBuilderStore.resetRootSchema();

  const handleNewQuery = () => queryBuilderStore.setAsNewQuery();

  const handleHeaderToggle= () => queryBuilderStore.toggleHeader();

  return (
    <div className={`${classes.container} ${className}`}>
      {((queryBuilderStore.isQuerySaved && queryBuilderStore.showHeader) || queryBuilderStore.saveAsMode) && (
        <React.Fragment>
          <div>
            {!queryBuilderStore.saveAsMode && (
              <React.Fragment>
                <button className={classes.fontAwesomeIconButton} onClick={handleHeaderToggle}><FontAwesomeIcon icon="angle-down"/></button>&nbsp;&nbsp;
              </React.Fragment>
            )}
            <h5>Query :</h5>
            <span className={`form-control ${classes.input}`}>
              {(queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode)?queryBuilderStore.sourceQuery.id:queryBuilderStore.queryId}
            </span>
          </div>
          <div>
            <h5>Label :</h5>
            <input
              className={`form-control ${classes.input}`}
              disabled={!(queryBuilderStore.saveAsMode || queryBuilderStore.isOneOfMySavedQueries)}
              placeholder={""}
              type="text"
              value={queryBuilderStore.label}
              onChange={handleChangeLabel} />
          </div>
          <div className={classes.workspace}>
            <Form.Group>
              <h5>Workspace :</h5>
              <Form.Control className={classes.input} as="select" value={queryBuilderStore.workspace} onChange={handleChangeWorkspace} >
                {authStore.workspaces.map(workspace => (
                  <option value={workspace} key={workspace}>{workspace}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
          <div className={classes.description}>
            <h5>Description :</h5>
            <textarea
              className={`form-control ${classes.input}`}
              disabled={!(queryBuilderStore.saveAsMode || queryBuilderStore.isOneOfMySavedQueries)}
              placeholder={""}
              type="text"
              value={queryBuilderStore.description}
              onChange={handleChangeDescription} />
          </div>
          {queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode && !queryBuilderStore.isOneOfMySavedQueries && queryBuilderStore.sourceQuery.user && (
            <div className={classes.author} >
              <span>by user<User user={queryBuilderStore.sourceQuery.user} /></span>
            </div>
          )}
        </React.Fragment>
      )}
      {false && queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode && queryBuilderStore.showHeader && !queryBuilderStore.hasQueryChanged && (
        <div className={classes.links}>
          <h6>To go further: </h6>
          <ul>
            <li>
              <a href="/apidoc/index.html?url=/apispec/spring%3Fgroup%3D0_public%0A#/query-api/executeStoredQueryUsingGET_2" rel="noopener noreferrer" target="_blank">Service API documentation</a> to query {queryBuilderStore.sourceQuery.id}
            </li>
            <li>
          Get <a href={`/query/${queryBuilderStore.sourceQuery.id}/python`} rel="noopener noreferrer" target="_blank">python code</a> for this stored query
            </li>
            <li>
          Get <a href={`/query/${queryBuilderStore.sourceQuery.id}/python/pip`}rel="noopener noreferrer" target="_blank">PyPi compatible python code</a> for this stored query
            </li>
          </ul>
        </div>
      )}
      <div className={`${classes.save} ${queryBuilderStore.showHeader || !queryBuilderStore.hasQueryChanged?"":"split"}`}>
        {queryBuilderStore.isQuerySaved?
          queryBuilderStore.isOneOfMySavedQueries?
            queryBuilderStore.saveAsMode?
              <React.Fragment>
                <div></div>
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
              </React.Fragment>
              :
              <React.Fragment>
                <div>
                  {!queryBuilderStore.showHeader && (
                    <div className={classes.collapsedHeader}>
                      <button className={classes.fontAwesomeIconButton} onClick={handleHeaderToggle}><FontAwesomeIcon icon="angle-down"/></button>
                  &nbsp;&nbsp;<h5>Query :</h5>
                  &nbsp;&nbsp;<input
                        className={`form-control ${classes.input}`}
                        disabled={true}
                        type="text"
                        value={queryBuilderStore.sourceQuery.id} />
                  &nbsp;&nbsp;<Button size="sm" variant="primary" onClick={handleNewQuery} disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} title="Detach as a new query">
                        <FontAwesomeIcon icon="times"/>
                      </Button>
                    </div>
                  )}
                </div>
                {queryBuilderStore.hasChanged && (
                  <Button disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasQueryChanged}  onClick={handleToggleCompareChanges}><FontAwesomeIcon icon="glasses"/>&nbsp;Compare</Button>
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
                <div></div>
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
              </React.Fragment>
              :
              <React.Fragment>
                <div>
                  {!queryBuilderStore.showHeader && (
                    <div className={classes.collapsedHeader}>
                      <button className={classes.fontAwesomeIconButton} onClick={handleHeaderToggle}><FontAwesomeIcon icon="angle-down"/></button>
                  &nbsp;&nbsp;<h5>Query :</h5>
                  &nbsp;&nbsp;<input
                        className={`form-control ${classes.input}`}
                        disabled={true}
                        type="text"
                        value={queryBuilderStore.sourceQuery.id} />
                  &nbsp;&nbsp;<Button size="sm" variant="primary" onClick={handleNewQuery} disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} title="Detach as a new query">
                        <FontAwesomeIcon icon="times"/>
                      </Button>
                    </div>
                  )}
                </div>
                {queryBuilderStore.hasChanged && (
                  <Button disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasQueryChanged}  onClick={handleToggleCompareChanges}><FontAwesomeIcon icon="glasses"/>&nbsp;Compare</Button>
                )}
                {queryBuilderStore.hasChanged && !queryBuilderStore.savedQueryHasInconsistencies && (
                  <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleRevertChanges}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Undo changes</Button>
                )}
                <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
              </React.Fragment>
          :
          queryBuilderStore.saveAsMode?
            <React.Fragment>
              <div></div>
              <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
              <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
            </React.Fragment>
            :
            <React.Fragment>
              <span><span className={classes.tip}><FontAwesomeIcon icon={"lightbulb"} />&nbsp;&nbsp;Click on &quot;Save As&quot; to save your query.</span></span>
              <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleResetQuery}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Reset</Button>
              <Button variant="secondary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
            </React.Fragment>
        }
      </div>
      {queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode && queryBuilderStore.showHeader && (
        <div className={classes.newQueryButton}>
          <Button size="sm" variant="primary" onClick={handleNewQuery} disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} title="Detach as a new query">
            <FontAwesomeIcon icon="times"/>
          </Button>
        </div>
      )}
    </div>
  );
});
QueryForm.displayName = "QueryForm";

export default QueryForm;