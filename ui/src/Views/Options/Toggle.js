import React from "react";
import { createUseStyles } from "react-jss";

import MultiToggle from "../../Components/MultiToggle";

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


const Toggle = ({ option, label, comment, show, onChange }) => {

  const classes = useStyles();

  const { name, value } = option;

  const handleChange = newValue => onChange(name, newValue);

  if (!show) {
    return null;
  }

  return (
    <div className={classes.option}>
      <div className={classes.optionLabel}>
        {label} <small>({comment})</small>
      </div>
      <div>
        <MultiToggle selectedValue={value} onChange={handleChange}>
          <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true} />
          <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined} />
        </MultiToggle>
      </div>
    </div>
  );
};

export default Toggle;