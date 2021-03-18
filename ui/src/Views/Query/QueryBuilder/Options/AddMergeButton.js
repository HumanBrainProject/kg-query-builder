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
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createUseStyles } from "react-jss";


const useStyles = createUseStyles({
  option: {
    marginTop: "20px",
    marginBottom: "20px",
    "&:last-child": {
      marginBottom: 0
    }
  },
  optionLabel: {
    fontWeight: "bold",
    marginBottom: "5px",
    "& small": {
      fontWeight: "normal",
      fontStyle: "italic"
    },
    "& strong": {
      color: "var(--ft-color-loud)"
    }
  },
  button: {
    borderRadius: "15px",
    padding: "3px 9px"
  }
});

const AddMergeButton = ({ show, onClick }) => {
  const classes = useStyles();

  if (!show) {
    return null;
  }

  return (
    <div className={classes.option}>
      <div className={classes.optionLabel}>
        <Button variant="secondary" className={classes.button} onClick={onClick}><FontAwesomeIcon icon="plus"></FontAwesomeIcon>&nbsp;Add a merge field</Button>
      </div>
    </div>
  );
};

export default AddMergeButton;