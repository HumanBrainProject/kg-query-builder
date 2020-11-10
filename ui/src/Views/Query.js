import React from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Scrollbars } from "react-custom-scrollbars";
const jsdiff = require("diff");

import queryBuilderStore from "../Stores/QueryBuilderStore";
import FetchingLoader from "../Components/FetchingLoader";
import User from "../Components/User";
import Field from "./Field";

const useStyles = createUseStyles({
  container:{
    display: "grid",
    gridTemplateRows: "auto 1fr",
    gridTemplateColumns: "1fr",
    gridGap: "10px",
    height: "100%"
  },
  info: {
    display: "grid",
    gridTemplateColumns: "310px 1fr",
    gridColumnGap: "30px",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px",
    "&:not(.available)": {
      display: "none",
      "& + $schemas": {
        gridRowStart: "span 2"
      }
    },
    "& h4": {
      display: "inline-block",
      marginTop: 0,
      marginBottom: "8px"
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
    "&:focus":{
      borderColor: "rgba(64, 169, 243, 0.5)"
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
  schemas:{
    position:"relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color:"var(--ft-color-normal)"
  },
  savingLoader:{
    position:"fixed",
    top:0,
    left:0,
    width: "100%",
    height: "100%",
    zIndex: 10000,
    background: "var(--bg-color-blend-contrast1)",
    "& .fetchingPanel": {
      width: "auto",
      padding: "30px",
      border: "1px solid var(--border-color-ui-contrast1)",
      borderRadius: "4px",
      color: "var(--ft-color-loud)",
      background: "var(--list-bg-hover)"
    }
  },
  saveErrorPanel: {
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
      "& h4": {
        margin: "0",
        paddingBottom: "20px",
        color: "red"
      },
      "& button + button, & a + button, & a + a": {
        marginLeft: "20px"
      }
    }
  },
  compareModal:{
    width:"90%",
    "@media screen and (min-width:1024px)": {
      width:"900px",
    },
    "& .modal-body": {
      height: "calc(95vh - 112px)",
      padding: "3px 0"
    }
  },
  comparison:{
    height: "100%",
    padding: "20px",
    "& pre": {
      border: 0,
      margin: 0,
      padding: 0,
      display: "inline",
      background: "transparent",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
      "& span": {
        whiteSpace: "pre-wrap"
      }
    }
  },
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
  tip: {
    padding: "10px",
    borderRadius: "4px",
    background:"var(--bg-color-ui-contrast4)",
    color: "var(--ft-color-normal)"
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
    "& h4": {
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

const Query = observer(() => {
  const classes = useStyles();

  const handleChangeLabel = e => queryBuilderStore.setLabel(e.target.value);

  const handleChangeDescription = e => queryBuilderStore.setDescription(e.target.value);

  const handleSave = () => queryBuilderStore.saveQuery();

  const handleCancelSave = () => queryBuilderStore.cancelSaveQuery();

  const handleRevertChanges = () => queryBuilderStore.cancelChanges();

  const handleShowSaveDialog = () => {
    queryBuilderStore.setSaveAsMode(true);
    queryBuilderStore.setQueryId();
  };

  const handleHideSaveDialog = () => queryBuilderStore.setSaveAsMode(false);

  const handleToggleCompareChanges = () => queryBuilderStore.toggleCompareChanges();

  const handleResetQuery = () => queryBuilderStore.resetRootSchema();

  const handleNewQuery = () => queryBuilderStore.setAsNewQuery();

  const handleHeaderToggle= () => queryBuilderStore.toggleHeader();

  if (!queryBuilderStore.rootField) {
    return null;
  }

  const diff = jsdiff.diffJson(queryBuilderStore.JSONSourceQuery, queryBuilderStore.JSONQuery);

  return (
    <div className={classes.container}>
      <div className={`${classes.info} ${queryBuilderStore.isQuerySaved || !queryBuilderStore.isQueryEmpty?"available":""}`}>
        {((queryBuilderStore.isQuerySaved && queryBuilderStore.showHeader) || queryBuilderStore.saveAsMode) && (
          <React.Fragment>
            <div>
              {!queryBuilderStore.saveAsMode && (
                <React.Fragment>
                  <button className={classes.fontAwesomeIconButton} onClick={handleHeaderToggle}><FontAwesomeIcon icon="angle-down"/></button>&nbsp;&nbsp;
                </React.Fragment>
              )}
              <h4>Query :</h4>
              <span className={`form-control ${classes.input}`}>
                {(queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode)?queryBuilderStore.sourceQuery.id:queryBuilderStore.queryId}
              </span>
            </div>
            <div>
              <h4>Label :</h4>
              <input
                className={`form-control ${classes.input}`}
                disabled={!(queryBuilderStore.saveAsMode || queryBuilderStore.isOneOfMySavedQueries)}
                placeholder={""}
                type="text"
                value={queryBuilderStore.label}
                onChange={handleChangeLabel} />
            </div>
            <div className={classes.description}>
              <h4>Description :</h4>
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
                  <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                  <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
                </React.Fragment>
                :
                <React.Fragment>
                  <div>
                    {!queryBuilderStore.showHeader && (
                      <div className={classes.collapsedHeader}>
                        <button className={classes.fontAwesomeIconButton} onClick={handleHeaderToggle}><FontAwesomeIcon icon="angle-down"/></button>
                          &nbsp;&nbsp;<h4>Query :</h4>
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
                    <Button variant="default" onClick={handleRevertChanges}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Undo changes</Button>
                  )}
                  <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
                  <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged || queryBuilderStore.isQueryEmpty || (queryBuilderStore.sourceQuery && queryBuilderStore.sourceQuery.isDeleting)} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
                </React.Fragment>
              :
              queryBuilderStore.saveAsMode?
                <React.Fragment>
                  <div></div>
                  <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                  <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
                </React.Fragment>
                :
                <React.Fragment>
                  <div>
                    {!queryBuilderStore.showHeader && (
                      <div className={classes.collapsedHeader}>
                        <button className={classes.fontAwesomeIconButton} onClick={handleHeaderToggle}><FontAwesomeIcon icon="angle-down"/></button>
                          &nbsp;&nbsp;<h4>Query :</h4>
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
                    <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleRevertChanges}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Undo changes</Button>
                  )}
                  <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || queryBuilderStore.isQueryEmpty} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
                </React.Fragment>
            :
            queryBuilderStore.saveAsMode?
              <React.Fragment>
                <div></div>
                <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleHideSaveDialog}>Cancel</Button>
                <Button variant="primary" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged || queryBuilderStore.isQueryEmpty} onClick={handleSave}><FontAwesomeIcon icon="save"/>&nbsp;Save</Button>
              </React.Fragment>
              :
              <React.Fragment>
                <span><span className={classes.tip}><FontAwesomeIcon icon={"lightbulb"} />&nbsp;&nbsp;Click on &quot;Save As&quot; to save your query.</span></span>
                <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError} onClick={handleResetQuery}><FontAwesomeIcon icon="undo-alt"/>&nbsp;Reset</Button>
                <Button variant="default" disabled={queryBuilderStore.isSaving || !!queryBuilderStore.saveError || !queryBuilderStore.hasChanged} onClick={handleShowSaveDialog}><FontAwesomeIcon icon="save"/>&nbsp;Save As</Button>
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
      <div className={classes.schemas}>
        <Scrollbars autoHide>
          <Field field={queryBuilderStore.rootField} />
        </Scrollbars>
      </div>
      {queryBuilderStore.isSaving && (
        <div className={classes.savingLoader}>
          <FetchingLoader>{`Saving query "${queryBuilderStore.queryId}"...`}</FetchingLoader>
        </div>
      )}
      {queryBuilderStore.saveError && (
        <div className={classes.saveErrorPanel}>
          <div>
            <h4>{queryBuilderStore.saveError}</h4>
            <div>
              <Button variant="default" onClick={handleCancelSave}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>Retry</Button>
            </div>
          </div>
        </div>
      )}
      {queryBuilderStore.compareChanges &&
              <Modal show={true} dialogClassName={classes.compareModal} onHide={handleToggleCompareChanges}>
                <Modal.Header closeButton>
                  <strong>{queryBuilderStore.queryId}</strong>
                </Modal.Header>
                <Modal.Body>
                  <div className={classes.comparison}>
                    <Scrollbars autoHide>
                      <pre>
                        {diff.map(part => {
                          if (!part.value) {
                            return null;
                          }
                          return (
                            <span key={part.value} className={part.added?classes.added:part.removed?classes.removed:classes.unchanged}>{part.value}</span>
                          );
                        })}
                      </pre>
                    </Scrollbars>
                  </div>
                </Modal.Body>
              </Modal>
      }
    </div>
  );

});

export default Query;