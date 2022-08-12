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

import React, {useState} from "react";
import { createUseStyles } from "react-jss";
import {observer} from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRedoAlt} from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import {faUndoAlt} from "@fortawesome/free-solid-svg-icons/faUndoAlt";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faTag} from "@fortawesome/free-solid-svg-icons/faTag";
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import API from "../../../../Services/API";

import { useStores } from "../../../../Hooks/UseStores";

import PopOverButton from "../../../../Components/PopOverButton";

const useStyles = createUseStyles({
  container:{
    position:"relative",
    cursor:"pointer",
    margin:"4px 0",
    padding:"10px",
    background: "rgba(0,0,0,0.4)",
    color:"var(--ft-color-normal)",
    "&:hover": {
      background: "linear-gradient(90deg, rgba(30,60,70,0.9) 0%, rgba(20,50,60,0.9) 100%)",
      "& $deleteButton": {
        color: "var(--ft-color-normal)",
        "&:hover, &:active, &:focus": {
          color: "var(--ft-color-louder)"
        }
      }
    },
    "&.is-deleting": {
      cursor: "default"
    }
  },
  name: {
    position: "relative",
    width: "100%",
    display: "inline-block",
    color:"var(--ft-color-louder)",
    textTransform: "capitalize",
    "& small":{
      color:"var(--ft-color-quiet)",
      fontStyle:"italic",
      textTransform: "none"
    },
    "& .author": {
      position: "absolute",
      right: 0,
      color: "var(--ft-color-normal)",
      textTransform: "none",
      "&.extra-padding":{
        right: "20px"
      }
    }
  },
  deleteButton: {
    position: "absolute",
    top: "50%",
    right: "-5px",
    transform: "translateY(-50%)",
    color: "transparent",
    margin: 0,
    border: 0,
    background: "none",
    "&:hover, &:active, &:focus": {
      color: "var(--ft-color-louder)"
    }
  },
  deleteDialog: {
    position: "absolute",
    top: "-5px",
    right: "-200px",
    transition: "right .2s ease",
    "&.show": {
      right: "-5px"
    }
  },
  deleting:{
    position:" absolute",
    top: "-5px",
    right: "-10px",
    height: "100%",
    padding: "5px 10px",
    display: "block",
    color: "var(--ft-color-normal)"
  },
  error: {
    position:"absolute",
    top:"-5px",
    right:"-5px"
  },
  errorButton: {
    color: "var(--ft-color-error)"
  },
  textError: {
    color: "var(--ft-color-error)",
    margin: "0px 15px",
    wordBreak: "keep-all"
  },
  description: {
    overflow:"hidden",
    marginTop:"5px",
    whiteSpace:"nowrap",
    textOverflow:"ellipsis",
    fontSize:"0.9em"
  }
});


const Query = observer(({query, enableDelete}) => {
// const SavedQuery = observer(({query, showUser, enableDelete}) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const { queryBuilderStore } = useStores();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelect = e => {
    API.trackEvent("Query", "Select", query.id);
    e.stopPropagation();
    if (!query.deleteError && !query.isDeleting) {
      navigate(`/queries/${query.id}`);
    }
  };

  const handleConfirmDelete = e => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = e => {
    API.trackEvent("Query", "Delete", query.id);
    e && e.stopPropagation();
    setShowDeleteDialog(false);
    queryBuilderStore.deleteQuery(query, null);
  };

  const handleCloseDeleteDialog = e => {
    e.stopPropagation();
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = e => {
    e && e.stopPropagation();
    queryBuilderStore.cancelDeleteQuery(query);
  };
  return (
    <div className={`${classes.container} ${query.isDeleting?"is-deleting":""}`} key={query.id} onClick={handleSelect} onMouseLeave={handleCloseDeleteDialog} >
      <div className={classes.name}>
        <FontAwesomeIcon icon={faTag} />&nbsp;&nbsp;
        <span>{query.label?query.label:query.id} - <small title="queryId">{query.id}</small></span>
        {enableDelete && !query.deleteError && !query.isDeleting && !showDeleteDialog && (
          <button className={classes.deleteButton} title="delete" onClick={handleConfirmDelete}><FontAwesomeIcon icon={faTimes}/></button>
        )}
        {enableDelete && !query.deleteError && !query.isDeleting && (
          <div className={`${classes.deleteDialog} ${showDeleteDialog?"show":""}`}>
            <Button variant="danger" size="sm" onClick={handleDelete}><FontAwesomeIcon icon={faTrashAlt}/>&nbsp;Delete</Button>
          </div>
        )}
        {enableDelete && !query.deleteError && query.isDeleting && (
          <div className={classes.deleting} title={`deleting query ${query.id}...`}>
            <FontAwesomeIcon icon={faCircleNotch} spin/>
          </div>
        )}
        {enableDelete && query.deleteError && (
          <PopOverButton
            className={classes.error}
            buttonClassName={classes.errorButton}
            buttonTitle={query.deleteError}
            iconComponent={FontAwesomeIcon}
            iconProps={{icon: faExclamationTriangle}}
            okComponent={() => (
              <React.Fragment>
                <FontAwesomeIcon icon={faRedoAlt}/>&nbsp;Retry
              </React.Fragment>
            )}
            onOk={handleDelete}
            cancelComponent={() => (
              <React.Fragment>
                <FontAwesomeIcon icon={faUndoAlt}/>&nbsp;Cancel
              </React.Fragment>
            )}
            onCancel={handleCancelDelete}
          >
            <h5 className={classes.textError}>{query.deleteError}</h5>
          </PopOverButton>
        )}
      </div>
      {query.description && (
        <div className={classes.description} title={query.description}>{query.description}</div>
      )}
    </div>
  );
});
Query.displayName = "Query";

export default Query;
