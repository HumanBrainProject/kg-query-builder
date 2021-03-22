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
import Form from "react-bootstrap/Form";
import Vocab from "./Vocab";

import { useStores } from "../../../Hooks/UseStores";

// import User from "../../../Components/User";

const useStyles = createUseStyles({
  container: {
    position:"relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px",
    "& h5": {
      display: "inline-block",
      marginTop: 0,
      marginBottom: "8px"
    },
    "& > $vocab:not(:first-child)": {
      marginTop: "20px"
    }
  },
  workspace: {
    marginTop: "20px",
    "& form-group": {
      marginBottom: 0
    }
  },
  description: {
    marginTop: "20px",
    "& textarea": {
      minWidth: "100%",
      maxWidth: "100%",
      minHeight: "10rem"
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
  vocab:{},
  author: {
    marginTop: "6px",
    color: "var(--ft-color-normal)"
  },
  links: {
    marginTop: "10px",
    color: "var(--ft-color-normal)",
    "& a, & a:visited, &a:active": {
      color: "var(--ft-color-loud)",
      "&:hover": {
        color: "var(--ft-color-louder)",
      }
    }
  },
  half: {
    width: "50%"
  }
});

const QueryForm = observer(({ className }) => {

  const classes = useStyles();

  const { queryBuilderStore, authStore } = useStores();

  const handleChangeLabel = e => queryBuilderStore.setLabel(e.target.value);

  const handleChangeWorkspace = e => queryBuilderStore.setWorkspace(e.target.value);

  const handleChangeDescription = e => queryBuilderStore.setDescription(e.target.value);

  const handleChangeVocab = value => queryBuilderStore.setResponseVocab(value);

  return (
    <div className={`${classes.container} ${className}`}>
      {(queryBuilderStore.isQuerySaved || queryBuilderStore.saveAsMode) && (
        <React.Fragment>
          <div>
            <h5>Label :</h5>
            <input
              className={`form-control ${classes.input} ${classes.half}`}
              disabled={!(queryBuilderStore.saveAsMode || queryBuilderStore.isOneOfMySavedQueries)}
              placeholder={""}
              type="text"
              value={queryBuilderStore.label}
              onChange={handleChangeLabel} />
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
          {queryBuilderStore.saveAsMode && (
            <div className={classes.workspace}>
              <Form.Group>
                <h5>Workspace :</h5>
                <Form.Control className={`${classes.input} ${classes.half}`} as="select" value={queryBuilderStore.workspace} onChange={handleChangeWorkspace}>
                  {!queryBuilderStore.saveAsMode && queryBuilderStore.workspace ?
                    <option value={queryBuilderStore.workspace} >{queryBuilderStore.workspace}</option> :
                    authStore.workspaces.map(workspace => (
                      <option value={workspace} key={workspace}>{workspace}</option>
                    ))
                  }
                </Form.Control>
              </Form.Group>
            </div>
          )}
        </React.Fragment>
      )}
      <div className={classes.vocab}>
        <Vocab
          defaultValue={queryBuilderStore.defaultResponseVocab}
          value={queryBuilderStore.responseVocab}
          onChange={handleChangeVocab}
        />
      </div>
      {/* {queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode && !queryBuilderStore.isOneOfMySavedQueries && queryBuilderStore.sourceQuery.user && ( //TODO: Enable this when new user endpoint available
            <div className={classes.author} >
              <span>by user<User user={queryBuilderStore.sourceQuery.user} /></span>
            </div>
          )} */}
      {false && queryBuilderStore.isQuerySaved && !queryBuilderStore.saveAsMode && !queryBuilderStore.hasQueryChanged && (
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
    </div>
  );
});
QueryForm.displayName = "QueryForm";

export default QueryForm;