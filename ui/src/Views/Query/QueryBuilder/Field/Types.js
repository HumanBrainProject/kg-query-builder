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
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons/faFilter";

import PropertyTypes from "../../../PropertyTypes";

const useStyles = createUseStyles({
  typeFilter: {
    transform: "scale(0.9) translateY(1px)",
    color: "lightskyblue"
  }
});

const Types = observer(({ field }) => {
  const classes = useStyles();

  if (field.typeFilterEnabled && field.typeFilter && field.typeFilter.length) {
    return (
      <React.Fragment>
        &nbsp;(&nbsp;
        <FontAwesomeIcon icon={faFilter} className={classes.typeFilter} title="filtered types"  />
        &nbsp;
        <PropertyTypes types={field.typeFilter} />
        &nbsp;)
      </React.Fragment>
    );
  }

  if (field.schema.canBe && !!field.schema.canBe.length) {
    return (
      <React.Fragment>
        &nbsp;(&nbsp;
        <PropertyTypes types={field.schema.canBe} />
        &nbsp;)
      </React.Fragment>
    );
  }
  return null;
});
Types.displayName = "Types";

export default Types;