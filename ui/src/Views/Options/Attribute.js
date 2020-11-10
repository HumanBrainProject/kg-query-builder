import React from "react";
import Icon from "../../Components/Icon";
import { createUseStyles } from "react-jss";

import Property from "./Property";

const useStyles = createUseStyles({
  container: {
    color: "var(--ft-color-loud)",
    "& h5": {
      margin: "18px 0 6px 5px",
      "& small": {
        color: "var(--ft-color-quiet)",
        fontStyle: "italic"
      }
    },
    "& .merge": {
      "& h5": {
        "& strong": {
          color: "greenyellow"
        }
      }
    }
  }
});

const Attribute = ({ attribute, label: prefix, isMerge=false, onClick }) => {
  const classes = useStyles();

  const { id, label, color, properties } = attribute;

  return (
    <div className={`${classes.container} ${isMerge?"merge":""}`}>
      <h5>{isMerge?(<strong>Merge</strong> ):""}{prefix} <Icon icon="circle" color={color}/> {label} <small> - {id}</small></h5>
      {properties.map(property => (
        <Property key={property.attribute + (property.reverse ? "reverse" : "")} property={property} onClick={onClick} />
      ))}
    </div>
  );
};

export default Attribute;