import React from "react";
import { createUseStyles } from "react-jss";
import Icon from "../../Components/Icon";
import typesStore from "../../Stores/TypesStore";

const Type = ({ type: t }) => {
  const type = typesStore.types[t];
  const label = type?type.label:t;
  const color = type?type.color:null;
  return (
    <React.Fragment key={label} >
      <Icon icon="circle" color={color} />{label}
    </React.Fragment>
  );
};

const Types = ({ types }) => {
  if (!Array.isArray(types)) {
    return null;
  }

  return (
    <span>&nbsp;&nbsp;
      {types.map(type => (
        <Type key={type} type={type} />
      ))}
    </span>
  );
};

const useStyles = createUseStyles({
  property: {
    color: "var(--ft-color-loud)",
    fontWeight: "normal",
    cursor: "pointer",
    padding: "10px",
    margin: "1px",
    background: "var(--bg-color-ui-contrast1)",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "&:hover": {
      background: "var(--bg-color-ui-contrast4)",
    }
  }
});

const Property = ({ property, onClick }) => {

  const classes = useStyles();

  const { attribute, label, canBe } = property;

  const handleClick = e => onClick(property, e);

  return (
    <div className={classes.property} onClick={handleClick}>
      {label} - <small>{attribute}</small>
      <Types types={canBe} />
    </div>
  );
};

export default Property;