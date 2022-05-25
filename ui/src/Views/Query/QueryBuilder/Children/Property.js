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
import {faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons/faLongArrowAltLeft";
import { observer } from "mobx-react-lite";

import PropertyTypes from "../../../PropertyTypes";

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
      background: "var(--bg-color-ui-contrast4)"
    }
  },
  reverseLink: {
    color: "greenyellow",
    transform: "translateY(1px)"
  }
});

const Property = observer(({ property, onClick }) => {

  const classes = useStyles();

  const { attribute, label, canBe } = property;

  const handleClick = e => onClick(e, property);

  return (
    <div className={classes.property} onClick={handleClick}>
      {property.reverse && (
        <React.Fragment>
          <FontAwesomeIcon icon={faLongArrowAltLeft} className={classes.reverseLink} title="is an incoming link" />&nbsp;
        </React.Fragment>
      )}
      {label} - <small>{attribute}</small>
      <PropertyTypes types={canBe} />
    </div>
  );
});
Property.displayName = "Property";

export default Property;