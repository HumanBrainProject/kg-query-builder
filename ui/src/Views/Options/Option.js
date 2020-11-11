import React from "react";
import { createUseStyles } from "react-jss";
import ReactJson from "react-json-view";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeRJV from "../ThemeRJV";

import Toggle from "./Toggle";

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
  aliasError: {
    marginTop: "6px",
    color: "var(--ft-color-error)"
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

const Option = ({ field, rootField, lookupsLinks, option, onChange }) => {

  const classes = useStyles();

  const { name, value } = option;

  const handleDelete = () => {
    onChange(name, undefined);
  };

  if (name === "required") {
    return (
      <Toggle
        option={option}
        label="Required"
        comment="only applicable if parent field is not flattened"
        show={field !== rootField
          && !field.parent.isFlattened
          && (!field.isMerge || field.isRootMerge)
        }
        onChange={onChange}
      />
    );
  }

  if (name === "sort") {
    return (
      <Toggle
        option={option}
        label="Sort"
        comment="enabling sort on this field will disable sort on other fields"
        show={field !== rootField
          && !(lookupsLinks && !!lookupsLinks.length)
        }
        onChange={onChange}
      />
    );
  }

  if (name === "ensure_order") {
    return (
      <Toggle
        option={option}
        label="Ensure original order"
        comment="only applicable if parent field is not flattened"
        show={field !== rootField
          && (lookupsLinks && !!lookupsLinks.length)
          && !field.parent.isFlattened
          && (!field.isMerge || field.isRootMerge)
        }
        onChange={onChange}
      />
    );
  }

  if (name === "ensure_order") {
    return (
      <Toggle
        option={option}
        label="Ensure original order"
        comment="only applicable if parent field is not flattened"
        show={field !== rootField
          && (lookupsLinks && !!lookupsLinks.length)
          && !field.parent.isFlattened
          && (!field.isMerge || field.isRootMerge)
        }
        onChange={onChange}
      />
    );
  }

  if (value !== undefined && (!field.isMerge || field.isRootMerge)) {
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
  }
  return null;
};

export default Option;