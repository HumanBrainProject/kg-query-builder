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
import ReactJson from "react-json-view";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeRJV from "../../../../Themes/ThemeRJV";

const useStyles = createUseStyles({
  option: {
    marginBottom: "20px",
    "&:last-child": {
      marginBottom: 0
    },
    "&.unsupported": {
      display: "flex",
      "& button": {
        alignSelf: "flex-start",
        display: "inline-block",
        margin: "0 5px 0 0",
        background: "var(--bg-color-ui-contrast1)",
        color: "var(--ft-color-loud)",
        borderColor: "var(--bg-color-ui-contrast1)",
        "&:hover": {
          background: "var(--bg-color-ui-contrast1)",
          color: "var(--ft-color-louder)",
          borderColor: "var(--bg-color-ui-contrast1)"
        }
      },
      "& $optionLabel": {
        alignSelf: "flex-start",
        display: "inline"
      },
      "& strong": {
        flex: 1,
        display: "inline-block",
        fontWeight: "normal",
        color: "var(--ft-color-loud)",
        "& .react-json-view": {
          backgroundColor: "transparent !important"
        }
      },
      "&:last-child": {
        marginBottom: "10px"
      }
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
  stringValue: {
    color: "rgb(253, 151, 31)"
  },
  boolValue: {
    color: "rgb(174, 129, 255)"
  },
  intValue: {
    color: "rgb(204, 102, 51)"
  },
  floatValue: {
    color: "rgb(84, 159, 61)"
  },
  dateValue: {
    color: "rgb(45, 89, 168)"
  },
  typeValue: {
    fontSize: "11px",
    marginRight: "4px",
    opacity: "0.8"
  }
});

const UnsupportedOption = ({ name, value, onChange }) => {

  const classes = useStyles();

  const handleDelete = () => {
    onChange(name, undefined);
  };

  return (
    <div className={`${classes.option} unsupported`}>
      <Button size="sm" variant="secondary" onClick={handleDelete} title={name === "merge" ? `"${name}" property cannot be deleted` : `delete property "${name}"`} disabled={name === "merge"} >
        <FontAwesomeIcon icon="times" />
      </Button>
      <div className={classes.optionLabel}>{name}:&nbsp;</div>
      <strong>
        {typeof value === "string" ?
          <div className={classes.stringValue}><span className={classes.typeValue}>string</span>&quot;{value}&quot;</div>
          :
          typeof value === "boolean" ?
            <div className={classes.boolValue}><span className={classes.typeValue}>bool</span>{value ? "true" : "false"}</div>
            :
            typeof value === "number" ?
              Number.isInteger(value) ?
                <div className={classes.intValue}><span className={classes.typeValue}>int</span>{value}</div>
                :
                <div className={classes.floatValue}><span className={classes.typeValue}>float</span>{value}</div>
              :
              <ReactJson collapsed={true} name={false} theme={ThemeRJV} src={value} enableClipboard={false} />
        }
      </strong>
    </div>
  );
};

export default UnsupportedOption;