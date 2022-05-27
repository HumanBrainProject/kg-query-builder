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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons/faArrowUp";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";
import {faFilter} from "@fortawesome/free-solid-svg-icons/faFilter";
import {faLevelDownAlt} from "@fortawesome/free-solid-svg-icons/faLevelDownAlt";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons/faAsterisk";
import {faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons/faLongArrowAltLeft";
import {faLongArrowAltRight} from "@fortawesome/free-solid-svg-icons/faLongArrowAltRight";

import Button from "react-bootstrap/Button";

import { useStores } from "../../../Hooks/UseStores";
import PropertyTypes from "../../PropertyTypes";

import Fields from "./Fields";

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
  label: {
    padding: "10px 35px 10px 10px",
    margin: "1px",
    backgroundColor: "var(--bg-color-ui-contrast1)",
    position: "relative",
    zIndex: 2,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--bg-color-ui-contrast4)",
      "& $optionsButton": {
        opacity: 1
      }
    },
    "&.selected": {
      backgroundColor: "var(--bg-color-ui-contrast4)",
      "& $optionsButton": {
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
  required: {
    color: "var(--ft-color-louder)"
  },
  rename: {
    color: "var(--ft-color-louder)",
    fontWeight: "bold"
  },
  defaultname: {
    color: "var(--ft-color-normal)",
    fontStyle: "italic"
  },
  subFields: {
    paddingLeft: "20px"
  },
  optionsButton: {
    position: "absolute",
    right: "6px",
    top: "6px",
    opacity: 0.25,
    "&>button.btn": {
      "&:not(:first-child):not(:last-child)": {
        borderRadius: 0
      },
      "&:first-child": {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      },
      "&:last-child": {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }
    }
  },
  link: {
    transform: "translateY(1px)"
  },
  reverseLink: {
    color: "greenyellow",
    transform: "translateY(1px)"
  },
  typeFilter: {
    transform: "scale(0.9) translateY(1px)",
    color: "lightskyblue"
  }
});

const FieldTypes = observer(({ field }) => {
  const classes = useStyles();

  if (field.typeFilterEnabled && field.typeFilter && field.typeFilter.length) {
    return (
      <React.Fragment>
        &nbsp;(&nbsp;
        <FontAwesomeIcon
          icon={faFilter}
          className={classes.typeFilter}
          title="filtered types"
        />
        &nbsp;
        <PropertyTypes types={field.typeFilter} />
        &nbsp;)
      </React.Fragment>
    );
  }

  if (field.schema.canBe && !!field.schema.canBe.length) {
    return (
      <React.Fragment>
        &nbsp;(&nbsp;
        <PropertyTypes types={field.schema.canBe} />
        &nbsp;)
      </React.Fragment>
    );
  }
  return null;
});
FieldTypes.displayName = "FieldTypes";

const UnknownField = ({ field, classes }) => {
  if (field.isUnknown && field.parent) {
    if (field.schema.simpleAttributeName) {
      return (
        <React.Fragment>
          {field.schema.simpleAttributeName}&nbsp;
          <span className={classes.canBe} title={field.schema.attribute}>
            ({" "}
            {field.schema.attributeNamespace
              ? field.schema.attributeNamespace
              : field.schema.attribute}{" "}
            )
          </span>
        </React.Fragment>
      );
    }
    return field.schema.attribute;
  }

  if (field.parent) {
    return (
      <React.Fragment>
        {field.schema.label}
        <FieldTypes field={field} />
      </React.Fragment>
    );
  }
  return <PropertyTypes types={field.schema.canBe} />;
};

const AliasField = observer(
  ({ className, fieldTitle, icon, text, mainClass }) => {
    return (
      <span className={mainClass}>
        &nbsp;&nbsp;
        <FontAwesomeIcon icon={icon} className={className} title={fieldTitle} />
        &nbsp;&nbsp;
        {text}
      </span>
    );
  }
);

const Field = observer(({ field }) => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleSelectField = () => {
    queryBuilderStore.selectField(field);
  };

  const handleRemoveField = (e) => {
    e.stopPropagation();
    queryBuilderStore.removeField(field);
  };

  const handleMoveUpField = (e) => {
    e.stopPropagation();
    queryBuilderStore.moveUpField(field);
  };

  const handleMoveDownField = (e) => {
    e.stopPropagation();
    queryBuilderStore.moveDownField(field);
  };

  const isFlattened = field.isFlattened;
  const hasFlattenedParent = field.parent && field.parent.isFlattened;

  const fieldIndex = field.parent
    ? field.parent.structure.findIndex((f) => f === field)
    : -1;

  const canMoveUp = fieldIndex >= 1;
  const canMoveDown =
    fieldIndex === -1 ? false : fieldIndex < field.parent.structure.length - 1;

  let title = null;
  if (field.isInvalid) {
    title = "this is not a recognized property for this type";
  } else if (field.aliasError) {
    title = "alias should not be empty";
  } else if (field.isInvalidLeaf) {
    title = "Links field must have at least one child field";
  }

  const icon = field.isReverse ? faLongArrowAltLeft : faLongArrowAltRight;
  const className = `${classes.container} ${isFlattened?"flattened":""} ${hasFlattenedParent?"has-flattened-parent":""}`;
  const linkClassName = field.isReverse ? classes.reverseLink : classes.link;
  const fieldTitle = field.isReverse ? "is an incoming link" : null;

  return (
    <div className={className} >
      {hasFlattenedParent && (
        <div className={classes.verticalLineExtraPath}></div>
      )}
      <div
        className={`${classes.label} ${field.isUnknown ? "is-unknown" : ""} ${
          field.isInvalid || field.aliasError || field.isInvalidLeaf
            ? "is-invalid"
            : ""
        } ${field === queryBuilderStore.currentField ? "selected" : ""}`}
        onClick={handleSelectField}
        title={title}
      >
        {field.isFlattened && field.structure && !!field.structure.length && (
            <span className={classes.required}>
              <FontAwesomeIcon transform="flip-h" icon={faLevelDownAlt} />
              &nbsp;&nbsp;
            </span>
          )}
        {field.getOption("required") && !field.parent.isFlattened && (
          <span className={classes.required}>
            <FontAwesomeIcon transform="shrink-8" icon={faAsterisk} />
            &nbsp;&nbsp;
          </span>
        )}
        <UnknownField field={field} classes={classes} />
        {field.parent &&
          !field.parent.isFlattened &&
          (field.alias ? (
            <AliasField
              className={linkClassName}
              fieldTitle={fieldTitle}
              icon={icon}
              text={field.alias}
              mainClass={classes.rename}
            />
          ) : (
            <AliasField
              className={linkClassName}
              fieldTitle={fieldTitle}
              icon={icon}
              text={field.defaultAlias}
              mainClass={classes.defaultname}
            />
          ))}
        {field.parent && (
          <div className={classes.optionsButton}>
            {canMoveUp && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleMoveUpField}
                title="move up"
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </Button>
            )}
            {canMoveDown && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleMoveDownField}
                title="move down"
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </Button>
            )}
            <Button
              size="sm"
              variant="primary"
              onClick={handleRemoveField}
              title="remove"
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </div>
        )}
      </div>
      <div className={classes.subFields}>
        <Fields field={field} />
      </div>
    </div>
  );
});
Field.displayName = "Field";

export default Field;
