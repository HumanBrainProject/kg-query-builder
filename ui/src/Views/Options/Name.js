import React from "react";
import { observer } from "mobx-react";
import { createUseStyles } from "react-jss";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  targetInput: {
    color: "var(--ft-color-loud)",
    width: "calc(100% - 20px)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "&:focus":{
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  }
});


const Name = observer(({ field, rootField }) => {

  const classes = useStyles();

  const handleChangeName = e => field.setAlias(e.target.value);

  if (field == rootField
    || parent.isFlattened
    || (field.isMerge && !field.isRootMerge)
  ) {
    return null;
  }

  return (
    <div className={classes.option} >
      {field.isRootMerge ?
        <div className={classes.optionLabel}>
          <strong><FontAwesomeIcon transform="shrink-8" icon="asterisk" /></strong>Merge name
        </div>
        :
        <div className={classes.optionLabel}>
            Target name <small>(only applicable if parent field is not flattened)</small>
        </div>
      }
      <div>
        <Form.Control className={classes.targetInput} type="text" required={field.isRootMerge} value={field.alias || ""} placeholder={field.defaultAlias} onChange={handleChangeName} />
        {field.aliasError && (
          <div className={classes.aliasError}>
            <FontAwesomeIcon icon="exclamation-triangle" />&nbsp;Empty value is not accepted
          </div>
        )}
      </div>
    </div>
  );
});

export default Name;