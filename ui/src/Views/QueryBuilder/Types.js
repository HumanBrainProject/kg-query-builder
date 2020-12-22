
import React from "react";
import { createUseStyles } from "react-jss";

import { useStores } from "../../Hooks/UseStores";

import Icon from "../../Components/Icon";

const useStyles = createUseStyles({
  types: {
    "& > div::before": {
      content: "', '",
      color: "var(--ft-color-loud)"
    },
    "& > div:first-child::before": {
      content: "''"
    }
  }
});

const Type = ({type}) => {

  const { typeStore } = useStores();

  const t = typeStore.types[type];
  const label = t?t.label:t;
  const color = t?t.color:null;

  return (
    <React.Fragment>
      <Icon icon="circle" color={color} />{label}
    </React.Fragment>
  );
};

const Types = ({types}) => {

  const classes = useStyles();

  if (!Array.isArray(types) || !types.length) {
    return null;
  }

  return (
    <span className={classes.types}>
      {types.map(type => (
        <Type type={type} key={type} />
      ))}
    </span>
  );
};

export default Types;


