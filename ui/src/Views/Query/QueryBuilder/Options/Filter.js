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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  container: {
    paddingTop: "10px",
    marginBottom: "20px",
    "&:last-child": {
      marginTop: "10px",
      marginBottom: "10px"
    }
  },
  panel: {
    position: "relative",
    padding: "10px",
    border: "1px solid rgb(108, 117, 125)",
    "&:after": {
      content: "\"Filter\"",
      position: "absolute",
      top: "-11px",
      left: "5px",
      backgroundColor: "#282828",
      padding: "0 5px"
    }
  },
  select: {
    display: "inline-block",
    paddingRight: "20px",
    backgroundColor: "rgb(108, 117, 125)",
    borderColor: "transparent",
    color: "white",
    "-webkit-appearance": "none",
    "&:hover": {
      backgroundColor: "#5a6268",
      borderColor: "#5a6268"
    }
  },
  selectBox: {
    position: "relative",
    "&:after": {
      content: "\"\"",
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      marginTop: "-3px",
      borderTop: "6px solid white",
      borderRight: "6px solid transparent",
      borderLeft: "6px solid transparent",
      pointerEvents: "none"
    }
  },
  inputRow: {
    display: "flex",
    marginTop: "10px"
  },
  label: {
    width: "75px",
    lineHeight: "2.2rem",
    textAlign: "right"
  },
  input: {
    flex: 1,
    color: "var(--ft-color-loud) !important",
    width: "calc(100% - 20px)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    marginRight: "4px",
    "&:focus":{
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  },
  addButton: {
    display: "block",
    marginLeft: "15px",
    borderRadius: "15px",
    padding: "3px 9px"
  },
  addFilterButton: {
    display: "block",
    borderRadius: "15px",
    padding: "3px 9px"
  },
  deleteButton: {
    "-webkit-appearance": "none",
    backgroundColor: "rgb(108, 117, 125)",
    borderColor: "transparent",
    borderRadius: "50%",
    color: "white",
    padding: "3px 9px",
    transform: "scale(0.8)",
    "&:hover": {
      backgroundColor: "#5a6268",
      borderColor: "#5a6268"
    }
  },
  warning: {
    color: "var(--ft-color-error)",
    marginRight: "35px"
  }
});


const Filter = observer(({ filter, show, onChange }) => {

  const classes = useStyles();

  const handleAddFilter = () => {
    const value = {
      op: "CONTAINS",
      value: ""
    };
    onChange("filter", value);
  };

  const handleChangeOp = e => {
    switch (e.target.value) {
      case "NONE": {
        onChange("filter", undefined);
        break;
      }
      case "IS_EMPTY": {
          const value = {
            op: e.target.value
          };
          onChange("filter", value);
          break;
      }
      default: {
        const value = {
          op: e.target.value,
          parameter: filter.parameter,
          value: filter.op === "IS_EMPTY"?"":filter.value
        };
        onChange("filter", value);
      }
    }
  };

  const handleAddValue = () => {
    const value = {
      op: filter.op,
      parameter: filter.parameter,
      value: ""
    };
    onChange("filter", value);
  };

  const handleChangeValue = e => {
    const value = {
      op: filter.op,
      parameter: filter.parameter,
      value: e.target.value
    };
    onChange("filter", value);
  };

  const handleDeleteValue = () => {
    const value = filter.parameter !== undefined?{
      op: filter.op,
      parameter: filter.parameter
    }:undefined;
    onChange("filter", value);
  };

  const handleAddParameter = () => {
    const value = {
      op: filter.op,
      parameter: "",
      value: filter.value
    };
    onChange("filter", value);
  };

  const handleChangeParameter = e => {
    const value = {
      op: filter.op,
      parameter: e.target.value,
      value: filter.value
    };
    onChange("filter", value);
  };

  const handleDeleteParameter = () => {
    const value = filter.value !== undefined?{
      op: filter.op,
      value: filter.value
    }:undefined;
    onChange("filter", value);
  };

  if (!show) {
    return null;
  }

  return (
    <div className={classes.container} >
      {(!filter || filter.op === "NONE")?(
        <Button variant="secondary" className={classes.addFilterButton} onClick={handleAddFilter}><FontAwesomeIcon icon="plus"></FontAwesomeIcon>&nbsp;add filter</Button>
      ):(
        <div className={classes.panel} >
          <div className={classes.inputRow}>
            <div className={classes.selectBox}><select className={classes.select} value={filter.op} onChange={handleChangeOp}>
              <option value="NONE">None</option>
              <option value="IS_EMPTY">Is empty</option>
              <option value="CONTAINS">Contains</option>
              <option value="EQUALS">Equals</option>
              <option value="STARTS_WITH">Starts with</option>
              <option value="ENDS_WITH">Ends with</option>
              <option value="REGEX">Regex</option>
              <option value="MBB">Minimal bounding box</option>
            </select></div>
            {filter.parameter === undefined && filter.op !== "IS_EMPTY" && (
              <Button variant="secondary"className={classes.addButton} onClick={handleAddParameter}><FontAwesomeIcon icon="plus"></FontAwesomeIcon>&nbsp;add parameter</Button>
            )}
            {filter.value === undefined && filter.op !== "IS_EMPTY" && (
              <Button variant="secondary" className={classes.addButton} onClick={handleAddValue}><FontAwesomeIcon icon="plus"></FontAwesomeIcon>&nbsp;add value</Button>
            )}
          </div>
          {filter.parameter !== undefined && (
            <>
              <div className={classes.inputRow}>
                <span className={classes.label}>Parameter:&nbsp;</span>
                <Form.Control className={classes.input} type="text" value={filter.parameter } placeholder="" onChange={handleChangeParameter} />
                <button className={classes.deleteButton} onClick={handleDeleteParameter} title="delete parameter"><FontAwesomeIcon icon="times"></FontAwesomeIcon></button>
              </div>
              {["scope", "size", "start", "instanceId"].includes(filter.parameter) && (
                <div className={classes.inputRow}>
                  <span className={classes.label}></span>
                  <span className={classes.warning}><FontAwesomeIcon icon="exclamation-triangle" />&nbsp;"{filter.parameter}" is a reserved parameter name and should not be used!</span>
                </div>
              )}
            </>
          )}
          {filter.value !== undefined && (
            <div className={classes.inputRow}>
              <span className={classes.label}>Value:&nbsp;</span>
              <Form.Control className={classes.input} type="text" value={filter.value } placeholder="" onChange={handleChangeValue} />
              <button className={classes.deleteButton} onClick={handleDeleteValue} title="delete value"><FontAwesomeIcon icon="times"></FontAwesomeIcon></button>
            </div>
          )}
        </div>
      )
      }
    </div>
  );
});
Filter.displayName = "Filter";

export default Filter;