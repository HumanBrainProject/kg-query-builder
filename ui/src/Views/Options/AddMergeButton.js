import React from "react";
import Button from "react-bootstrap/Button";
import { createUseStyles } from "react-jss";


const useStyles = createUseStyles({
  option: {
    marginTop: "20px",
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
  }
});

const AddMergeButton = ({ show, onClick }) => {
  const classes = useStyles();

  if (!show) {
    return null;
  }

  return (
    <div className={classes.option}>
      <div className={classes.optionLabel}>
        <Button onClick={onClick}>Add a merge field</Button>
      </div>
    </div>
  );
};

export default AddMergeButton;