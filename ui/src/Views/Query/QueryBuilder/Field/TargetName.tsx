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
import {faLongArrowAltLeft} from "@fortawesome/free-solid-svg-icons/faLongArrowAltLeft";
import {faLongArrowAltRight} from "@fortawesome/free-solid-svg-icons/faLongArrowAltRight";
import { FieldProps } from "../Field";

const useStyles = createUseStyles({
  alias: {
    color: "var(--ft-color-louder)",
    fontWeight: "bold"
  },
  default: {
    color: "var(--ft-color-normal)",
    fontStyle: "italic"
  },
  link: {
    transform: "translateY(1px)"
  },
  reverseLink: {
    color: "greenyellow",
    transform: "translateY(1px)"
  }
});

const TargetName = observer(({ field }: FieldProps) => {

    const classes = useStyles();

    if (!field.parent || field.parent.isFlattened) {
      return null;
    }
    const className = field.alias ? classes.alias : classes.default;
    const iconClassName = field.isReverse ? classes.reverseLink : classes.link;
    const icon = field.isReverse ? faLongArrowAltLeft : faLongArrowAltRight;
    const title = field.isReverse ? "is an incoming link" : undefined;
    const name = field.alias ? field.alias : field.defaultAlias;
    return (
      <span className={className}>
        &nbsp;&nbsp;
        <FontAwesomeIcon icon={icon} className={iconClassName} title={title} />
        &nbsp;&nbsp;
        {name}
      </span>
    );
  }
);
TargetName.displayName = "TargetName";

export default TargetName;
