import React from "react";
import { observer } from "mobx-react";
import MultiToggle from "../Components/MultiToggle";
import { createUseStyles } from "react-jss";
import { FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import queryBuilderStore from "../Stores/QueryBuilderStore";

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
  }
});


const Name = observer(({ field, rootField }) => {

  const classes = useStyles();

  const { isMerge, isRootMerge, alias, defaultAlias, aliasError, parent, setAlias } = field;

  const handleChangeName = e => setAlias(e.target.value);

  if (field == rootField ||
    parent.isFlattened ||
    (isMerge && !isRootMerge)) {
    return null;
  }

  return (
    <div className={classes.option} >
      {isRootMerge ?
        <div className={classes.optionLabel}>
          <strong><FontAwesomeIcon transform="shrink-8" icon="asterisk" /></strong>Merge name
        </div>
        :
        <div className={classes.optionLabel}>
            Target name <small>(only applicable if parent field is not flattened)</small>
        </div>
      }
      <div>
        <FormControl type="text" required={isRootMerge} value={alias || ""} placeholder={defaultAlias()} onChange={handleChangeName} />
        {aliasError && (
          <div className={classes.aliasError}>
            <FontAwesomeIcon icon="exclamation-triangle" />&nbsp;Empty value is not accepted
          </div>
        )}
      </div>
    </div>
  );
});

export default Name;