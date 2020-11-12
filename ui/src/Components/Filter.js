import React, { useRef, useEffect} from "react";
import { createUseStyles } from "react-jss";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({

  container: {
    position: "relative",
    color: "var(--ft-color-loud)",
    backgroundColor: "var(--bg-color-ui-contrast3)",
    borderBottom: 0
  },
  input: {
    color: "var(--ft-color-loud)",
    width: "calc(100% - 20px)",
    margin: "10px",
    border: "1px solid transparent",
    paddingLeft: "30px",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "&:focus":{
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  },
  icon: {
    position: "absolute",
    top: "20px",
    left: "20px",
    color: "var(--ft-color-normal)"
  }
});

const Filter = ({ value, placeholder="filter...", icon="search", onChange }) => {

  const classes = useStyles();

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
    return () => {
      onChange("");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = e => onChange(e.target.value);

  return (
    <div className={classes.container}>
      <Form.Control
        ref={ref}
        className={classes.input}
        type="text"
        onChange={handleChange}
        value={value}
        placeholder={placeholder} />
      <FontAwesomeIcon icon={icon} className={classes.icon} />
    </div>
  );
};

export default Filter;