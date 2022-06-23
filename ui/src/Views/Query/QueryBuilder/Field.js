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

import { useStores } from "../../../Hooks/UseStores";

import ChildrenFlag from "./Field/ChildrenFlag";
import RequiredFlag from "./Field/RequiredFlag";
import Type from "./Field/Type";
import TargetName from "./Field/TargetName";
import Actions from "./Field/Actions";
import Children from "./Field/Children";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    "&::before": {
      display: "block",
      content: "''",
      position: "absolute",
      left: "10px",
      width: "0",
      height: "calc(100% - 20px)",
      borderLeft: "1px dashed #ccc"
    },
    "&::after": {
      display: "block",
      content: "''",
      position: "absolute",
      left: "-9px",
      top: "20px",
      width: "10px",
      height: "0",
      borderTop: "1px dashed #ccc"
    },
    "&.has-flattened-parent::after": {
      borderTop: "3px solid #40a9f3"
    }
  },
  verticalLineExtraPath: {
    display: "block",
    content: "''",
    position: "absolute",
    top: "-1px",
    left: "-11px",
    width: "0",
    height: "24px",
    borderLeft: "3px solid #40a9f3"
  },
  content: {
    padding: "10px 35px 10px 10px",
    margin: "1px",
    backgroundColor: "var(--bg-color-ui-contrast1)",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--bg-color-ui-contrast4)",
      "& $actions": {
        opacity: 1
      }
    },
    "&.selected": {
      backgroundColor: "var(--bg-color-ui-contrast4)",
      "& $actions": {
        opacity: 1
      }
    },
    "&.is-unknown": {
      backgroundColor: "var(--bg-color-warn-quiet)",
      "&&.selected": {
        backgroundColor: "var(--bg-color-warn-normal)"
      },
      "&:hover, &.selected:hover": {
        backgroundColor: "var(--bg-color-warn-loud)"
      }
    },
    "&.is-invalid, &.is-unknown.is-invalid": {
      backgroundColor: "var(--bg-color-error-quiet)",
      "&&.selected": {
        backgroundColor: "var(--bg-color-error-normal)"
      },
      "&:hover, &.selected:hover": {
        backgroundColor: "var(--bg-color-error-loud)"
      }
    }
  },
  children: {
    paddingLeft: "20px"
  },
  actions: {
    opacity: 0.25
  }
});

const getTitle = field => {
  if (field.isInvalid) {
    return "this is not a recognized property for this type";
  }

  if (field.aliasError) {
    return "alias should not be empty";
  }
 
  if (field.isInvalidLeaf) {
    return "Links field must have at least one child field";
  }

  return null;
};

const Field = observer(({ field }) => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleSelectField = () => {
    queryBuilderStore.selectField(field);
  };

  const isFlattened = field.isFlattened;
  const hasFlattenedParent = field.parent && field.parent.isFlattened;
  const isInvalid = field.isInvalid || field.aliasError || field.isInvalidLeaf;
  const isSelected = field === queryBuilderStore.currentField;

  const title = getTitle(field);

  const containerClassName = `${classes.container} ${isFlattened?"flattened":""} ${hasFlattenedParent?"has-flattened-parent":""}`;
  const contentClassName = `${classes.content} ${field.isUnknown ? "is-unknown" : ""} ${isInvalid? "is-invalid" : ""} ${isSelected ? "selected" : ""}`;

  return (
    <div className={containerClassName} >
      {hasFlattenedParent && (
        <div className={classes.verticalLineExtraPath}></div>
      )}
      <div className={contentClassName} title={title} onClick={handleSelectField} >
        <ChildrenFlag field={field} />
        <RequiredFlag field={field} />
        <Type field={field} />
        <TargetName field={field} />
        <Actions field={field} className={classes.actions} />
      </div>
      <Children field={field} className={classes.children} />
    </div>
  );
});
Field.displayName = "Field";

export default Field;
