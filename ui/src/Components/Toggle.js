import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  container:{
    textAlign:"center",
    height:"24px",
    lineHeight:"24px",
    cursor:"pointer",
    fontSize:"0.66em",
    transition:"all .2s ease",
    background:"none",
    "&.selected":{
      background:"var(--bg-color-ui-contrast1)",
      borderRadius:"50%",
      transform:"scale(1.12)",
      fontSize:"0.8em",
      /*backgroundColor:"currentColor",
      "& svg":{
        color:"white"
      },*/
      "&.noscale":{
        transform:"scale(1)",
      }
    }
  }
});

const Toggle = ({ selectedValue, value, color, icon, noscale, onSelect }) => {

  const classes = useStyles();

  const handleClick = () => {
    if(typeof onSelect === "function") {
      onSelect(value);
    }
  };

  return(
    <div onClick={handleClick} className={`${classes.container}${selectedValue === value?" selected":""}${noscale !== undefined?" noscale":""}`} style={{color: color}}>
      <FontAwesomeIcon icon={icon || "dot-circle"}/>
    </div>
  );
};

export default Toggle;