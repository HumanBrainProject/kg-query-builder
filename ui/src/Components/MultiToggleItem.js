/*
 * Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This open source software code was developed in part or in whole in the
 * Human Brain Project, funded from the European Union's Horizon 2020
 * Framework Programme for Research and Innovation under
 * Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 * (Human Brain Project SGA1, SGA2 and SGA3).
 *
 */

import React from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faDotCircle} from "@fortawesome/free-solid-svg-icons/faDotCircle";

const useStyles = createUseStyles({
  container:{
    textAlign:"center",
    height:"24px",
    lineHeight:"24px",
    fontSize:"0.66em",
    transition:"all .2s ease",
    background:"none",
    "&:not(.readOnly)": {
      cursor:"pointer"
    },
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
        transform:"scale(1)"
      }
    }
  }
});

const MultiToggleItem = ({ selectedValue, value, color, icon, noscale, onSelect }) => {

  const classes = useStyles();

  const isReadOnly = typeof onSelect !== "function";

  const handleClick = () => {
    if(typeof onSelect === "function") {
      onSelect(value);
    }
  };

  const className = `${classes.container}${selectedValue === value?" selected":""}${noscale !== undefined?" noscale":""} ${isReadOnly?"readOnly":""}`;

  return(
    <div onClick={isReadOnly?null:handleClick} className={className} style={{color: color}}>
      <FontAwesomeIcon icon={icon || faDotCircle}/>
    </div>
  );
};

export default MultiToggleItem;