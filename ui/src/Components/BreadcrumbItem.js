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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { isString, isInteger } from "lodash";

const useStyles = createUseStyles({
  breadcrumbItem: {
    marginBottom: "10px",
    float: "left",
    background: "var(--list-bg-hover)",
    height: "36px",
    lineHeight: "36px",
    padding: "0 20px 0 30px",
    position: "relative",
    border: "1px solid var(--border-color-ui-contrast2)",
    "&::before": {
      display: "block",
      content: "''",
      position: "absolute",
      top: "5px",
      left: "-13px",
      height: "24px",
      width: "24px",
      transform: "rotate(45deg)",
      background: "var(--list-bg-hover)",
      borderTop: "1px solid var(--border-color-ui-contrast2)",
      borderRight: "1px solid var(--border-color-ui-contrast2)",
    },
    "&:first-child::before": {
      display: "none",
    },
    "&:first-child": {
      padding: "0 20px 0 20px",
    },
    "&.clickable": {
      cursor: "pointer",
    },
    "&.clickable:hover": {
      background: "var(--list-bg-selected)",
      "& + ::before": {
        background: "var(--list-bg-selected)",
      }
    },
    "&:last-child": {
      background: "var(--list-bg-selected)",
      cursor: "default",
    }
  }
});


const BreadcrumbItem = observer(({ item, index, onClick, total }) => {

  const classes = useStyles();
  const className = `${classes.breadcrumbItem}${!isInteger(item) ? " clickable" : ""}`;
  const actions = {};
  if(isString(item)) {
    actions.onClick = () => onClick(index);
  }

  const totalResult = index === 0 ? `(${total})` : "";
  const name = isInteger(item) ? `#${item}`:item;

  return (
    <div className={className} {...actions}>
      {name}
      {totalResult}
    </div>
  );
});

export default BreadcrumbItem;

