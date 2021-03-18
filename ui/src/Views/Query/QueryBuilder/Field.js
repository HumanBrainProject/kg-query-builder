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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";

import { useStores } from "../../../Hooks/UseStores";
import Types from "../../Types";

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
    },
    "&.parent-is-root-merge": {
      "&::before": {
        marginLeft: "10px"
      },
      "& > $label": {
        marginLeft: "10px"
      },
      "& > $subFields": {
        marginLeft: "10px"
      }
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
  merge: {
    color: "greenyellow",
    "& svg": {
      transform: "scale(2) rotateZ(90deg)"
    }
  },
  parentIsRootMerge: {
    position: "absolute",
    width: "6px",
    height: "6px",
    marginTop: "7px",
    marginLeft: "-16px",
    background: "greenyellow",
    color: "greenyellow",
    "& svg": {
      transform: "scaleX(1.1) translate(-12px, -7px)rotateZ(180deg)"
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
    opacity: 0.25
  },
  link: {
    transform: "translateY(1px)"
  },
  reverseLink: {
    color: "greenyellow",
    transform: "translateY(1px)"
  }
});

const Field = observer(({ field }) => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleSelectField = () => {
    queryBuilderStore.selectField(field);
  };

  const handleRemoveField = e => {
    e.stopPropagation();
    queryBuilderStore.removeField(field);
  };

  const isFlattened = field.isFlattened;
  const hasFlattenedParent = field.parent && field.parent.isFlattened;

  return (
    <div className={`${classes.container} ${field.isMerge ? "is-merge" : ""} ${field.isRootMerge ? "is-root-merge" : ""} ${field.isMerge && !field.isRootMerge ? "is-child-merge" : ""} ${(field.isMerge && field.parentIsRootMerge) ? "parent-is-root-merge" : ""} ${isFlattened ? "flattened" : ""} ${hasFlattenedParent ? "has-flattened-parent" : ""}`}>
      {hasFlattenedParent &&
        <div className={classes.verticalLineExtraPath}></div>
      }
      <div className={`${classes.label} ${field.isUnknown ? "is-unknown" : ""} ${(field.isInvalid || field.aliasError) ? "is-invalid" : ""} ${field === queryBuilderStore.currentField ? "selected" : ""}`} onClick={handleSelectField}>
        {field.isMerge && field.parentIsRootMerge && (
          <div className={classes.parentIsRootMerge}>
            <FontAwesomeIcon icon="long-arrow-alt-right" />
          </div>
        )}
        {field.isFlattened && (!field.isMerge || (field.structure && !!field.structure.length)) && (
          <span className={classes.required}>
            <FontAwesomeIcon transform="flip-h" icon="level-down-alt" />&nbsp;&nbsp;
          </span>
        )}
        {field.getOption("required") && (
          <span className={classes.required}>
            <FontAwesomeIcon transform="shrink-8" icon="asterisk" />&nbsp;&nbsp;
          </span>
        )}
        {field.isRootMerge ?
          <React.Fragment>
            <span className={classes.merge} title="merge">
              <FontAwesomeIcon transform="shrink-8" icon="sitemap" />
            </span>
            {field.parent?
              <React.Fragment>
                &nbsp;&nbsp;{field.schema.label}{field.schema.canBe && !!field.schema.canBe.length && (
                  <React.Fragment>
                    &nbsp;( <Types types={field.schema.canBe} /> )
                  </React.Fragment>
                )}
              </React.Fragment>
              :
              <React.Fragment>
                &nbsp;&nbsp;<Types types={field.schema.canBe} />
              </React.Fragment>
            }
          </React.Fragment>
          :
          field.isUnknown ?
            field.schema.simpleAttributeName ?
              <React.Fragment>
                {field.schema.simpleAttributeName}&nbsp;
                <span className={classes.canBe} title={field.schema.attribute}>( {field.schema.attributeNamespace ? field.schema.attributeNamespace : field.schema.attribute} )</span>
              </React.Fragment>
              :
              field.schema.attribute
            :
            field.parent?
              <React.Fragment>
                {field.schema.label}
                {!field.isRootMerge && field.schema.canBe && !!field.schema.canBe.length && (
                  <React.Fragment>
                    &nbsp;( <Types types={field.schema.canBe} /> )
                  </React.Fragment>
                )}
              </React.Fragment>
              :
              <Types types={field.schema.canBe} />
        }
        {field.parent && !field.parent.isFlattened && (!field.isMerge || field.isRootMerge) && (
          field.alias ?
            <span className={classes.rename}>
              &nbsp;&nbsp;<FontAwesomeIcon icon={field.isReverse?"long-arrow-alt-left":"long-arrow-alt-right"} className={field.isReverse?classes.reverseLink:classes.link} title={field.isReverse?"is reverse":null} />&nbsp;&nbsp;
              {field.alias}
            </span>
            :
            <span className={classes.defaultname}>
              &nbsp;&nbsp;<FontAwesomeIcon icon={field.isReverse?"long-arrow-alt-left":"long-arrow-alt-right"} className={field.isReverse?classes.reverseLink:classes.link} title={field.isReverse?"is reverse":null} />&nbsp;&nbsp;
              {field.defaultAlias}
            </span>
        )}
        {field.parent && (
          <div className={classes.optionsButton}>
            <Button size="sm" variant="primary" onClick={handleRemoveField}>
              <FontAwesomeIcon icon="times" />
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