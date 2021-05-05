
import React from "react";
import { createUseStyles } from "react-jss";

import { useStores } from "../Hooks/UseStores";

import Icon from "../Components/Icon";

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

const extractLabel = type => {
  if (typeof type !== "string") {
    return "<unknown filter>";
  }
  const idx = type.lastIndexOf("/");
  if (idx !== -1) {
    return type.substr(idx + 1);
  }
  return type;
};

export const Type = ({type}) => {

  const { typeStore } = useStores();

  const t = typeStore.types[type];
  const label = t?t.label:extractLabel(type);
  const color = t?t.color:null;

  

  return (
    <span title={typeof type === "string"?type:JSON.stringify(type)}>
      <Icon icon="circle" color={color} />{label}
    </span>
  );
};

const Types = ({types}) => {

  const classes = useStyles();

  if (!Array.isArray(types) || !types.length) {
    return null;
  }

  return (
    <span className={classes.types}>
      {types.map((type, index) => (
        <Type type={type} key={type?type:index} />
      ))}
    </span>
  );
};

export default Types;


