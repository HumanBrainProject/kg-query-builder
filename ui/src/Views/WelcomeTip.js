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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faLightbulb} from "@fortawesome/free-solid-svg-icons/faLightbulb";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    background: "rgba(0,0,0,0.2)",
    padding: "8px 8px 8px 12px",
    color: "var(--ft-color-loud)",
    "& > svg": {
      transform: "translateY(3px)"
    }
  },
  tip: {
    padding: "0 10px",
    flex: 1,
    "& a, & a:hover, & a:visited, & a:active": {
      color: "var(--ft-color-loud)",
      fontWeight: "bold"
    }
  },
  closeBtn: {
    margin: 0,
    border: 0,
    background: "transparent",
    color: "var(--ft-color-normal)",
    "&:hover": {
      color: "var(--ft-color-loud)",
    }
  }
});

const WelcomeTip = observer(({ className, show, onClose}) => {

  const classes = useStyles();

  if (!show) {
    return null;
  }

  return (
    <div className={`${classes.container} ${className?className:""}`}>
      <FontAwesomeIcon icon={faLightbulb} />
      <div className={classes.tip}> This is the place to query the EBRAINS Knowledge Graph conveniently by UI. If you need any help, please check out <a href="https://docs.kg.ebrains.eu/9b511d36d7608eafc94ea43c918f16b6/tutorials.html" rel="nofollow noreferrer noopener" target="_blank">our tutorials</a> or contact us at <a href="mailto:kg@ebrains.eu">kg@ebrains.eu</a></div>
      <button className={classes.closeBtn} onClick={onClose} title="close"><FontAwesomeIcon icon={faTimes} /></button>
    </div>
  );
});
WelcomeTip.displayName = "WelcomeTip";

export default WelcomeTip;