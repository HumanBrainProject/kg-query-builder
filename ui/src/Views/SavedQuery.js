import React, {useState} from "react";
import { createUseStyles } from "react-jss";
import {observer} from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";

import queryBuilderStore from "../Stores/QueryBuilderStore";
import PopOverButton from "../Components/PopOverButton";
import User from "../Components/User";

const useStyles = createUseStyles({
  container:{
    position:"relative",
    cursor:"pointer",
    margin:"1px",
    padding:"10px",
    background:"var(--bg-color-ui-contrast1)",
    color:"var(--ft-color-normal)",
    "&:hover": {
      background:"var(--bg-color-ui-contrast4)",
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
    color: "var(--ft-color-normal)",
  },
  error: {
    position:"absolute",
    top:"-5px",
    right:"-5px",
  },
  errorButton: {
    color: "var(--ft-color-error)"
  },
  textError: {
    margin: 0,
    wordBreak: "keep-all"
  },
  description: {
    overflow:"hidden",
    marginTop:"5px",
    whiteSpace:"nowrap",
    textOverflow:"ellipsis",
    fontSize:"0.9em",
  }
});


const SavedQuery = observer(({query, showUser, enableDelete}) => {
  const classes = useStyles();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelect = e => {
    e.stopPropagation();
    if (!query.deleteError && !query.isDeleting) {
      queryBuilderStore.selectQuery(query);
    }
  };

  const handleConfirmDelete = e => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = e => {
    e.stopPropagation();
    setShowDeleteDialog(false);
    queryBuilderStore.deleteQuery(query);
  };

  const handleCloseDeleteDialog = e => {
    e.stopPropagation();
    setShowDeleteDialog(false);
  };

  const handleCancelDelete = e => {
    e.stopPropagation();
    queryBuilderStore.cancelDeleteQuery(query);
  };
  return (
    <div className={`${classes.container} ${query.isDeleting?"is-deleting":""}`} key={query.id} onClick={handleSelect} onMouseLeave={handleCloseDeleteDialog} >
      <div className={classes.name}>
        <span>{query.label?query.label:query.id} - <small title="queryId">{query.id}</small></span>
        {showUser && query.user && (
          <span className={`author ${enableDelete?"extra-padding":""}`}>by user <User user={query.user} />
          </span>
        )}
        {enableDelete && !query.deleteError && !query.isDeleting && !showDeleteDialog && (
          <button className={classes.deleteButton} title="delete" onClick={handleConfirmDelete}><FontAwesomeIcon icon="times"/></button>
        )}
        {enableDelete && !query.deleteError && !query.isDeleting && (
          <div className={`${classes.deleteDialog} ${showDeleteDialog?"show":""}`}>
            <Button variant="danger" size="sm" onClick={handleDelete}><FontAwesomeIcon icon="trash-alt"/>&nbsp;Delete</Button>
          </div>
        )}
        {enableDelete && !query.deleteError && query.isDeleting && (
          <div className={classes.deleting} title={`deleting query ${query.id}...`}>
            <FontAwesomeIcon icon={"circle-notch"} spin/>
          </div>
        )}
        {enableDelete && query.deleteError && (
          <PopOverButton
            className={classes.error}
            buttonClassName={classes.errorButton}
            buttonTitle={query.deleteError}
            iconComponent={FontAwesomeIcon}
            iconProps={{icon: "exclamation-triangle"}}
            okComponent={() => (
              <React.Fragment>
                <FontAwesomeIcon icon="redo-alt"/>&nbsp;Retry
              </React.Fragment>
            )}
            onOk={handleDelete}
            cancelComponent={() => (
              <React.Fragment>
                <FontAwesomeIcon icon="undo-alt"/>&nbsp;Cancel
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

export default SavedQuery;
