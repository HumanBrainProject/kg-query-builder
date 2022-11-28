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

import React, { MouseEvent } from "react";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { PathMatch } from "react-router-dom";

const useStyles = createUseStyles({
  container: {
    height: "50px",
    lineHeight: "45px",
    color: "var(--ft-color-normal)",
    background: "rgba(255,255,255,0.05)",
    padding: "0 20px 0 20px",
    border: "1px solid var(--border-color-ui-contrast2)",
    borderLeft: "none",
    cursor: "pointer",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    "&$closable": {
      paddingRight: "10px"
    },
    "& $icon": {
      opacity: 0.7
    },
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.1)",
      color: "var(--ft-color-loud)",
      "& $icon": {
        opacity: 1
      }
    }
  },
  closable: {},
  disabled: {
    "&, &:hover": {
      background: "rgba(255,255,255,0.05)",
      color: "var(--ft-color-normal)",
      cursor: "not-allowed",
      "& $icon": {
        opacity: 0.2
      }
    }
  },
  current: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "var(--ft-color-loud)",
    borderBottom: "1px solid var(--list-border-selected)",
    "& $icon": {
      opacity: 1
    }
  },
  text: {
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "& + $close": {
      marginLeft: "10px"
    }
  },
  icon: {
    color: "var(--ft-color-loud)",
    display: "inline-block",
    "& + $text": {
      marginLeft: "10px"
    }
  },
  close: {
    color: "var(--ft-color-normal)",
    padding: "0 10px",
    "&:hover": {
      color: "var(--ft-color-loud)"
    }
  }
});

interface TabProps {
  label: string;
  disabled: boolean;
  current?: PathMatch<string>|null;
  icon?: IconDefinition;
  iconColor?: string;
  iconSpin?: boolean;
  hideLabel: boolean;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onClose?: (e: MouseEvent<HTMLElement>) => void;
}

const Tab = ({
  label,
  disabled,
  current,
  icon,
  iconColor,
  iconSpin,
  hideLabel,
  onClick,
  onClose
}: TabProps) => {
  const classes = useStyles();
  const closeable = typeof onClose === "function";

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    typeof onClick === "function" && onClick(e);
  };

  const handleClose = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    closeable && onClose(e);
  };

  return (
    <div
      className={`${classes.container} ${disabled ? classes.disabled : ""} ${
        current ? classes.current : ""
      } ${closeable ? classes.closable : ""}`}
      onClick={handleClick}
    >
      <div
        className={classes.icon}
        style={iconColor ? { color: iconColor } : {}}
        title={label}
      >
        {icon && <FontAwesomeIcon fixedWidth icon={icon} spin={iconSpin} />}
      </div>
      {hideLabel ? null : (
        <div className={classes.text} title={label}>
          {label}
        </div>
      )}
      {closeable ? (
        <div className={classes.close} onClick={handleClose}>
          <FontAwesomeIcon icon={"times"} />
        </div>
      ) : null}
    </div>
  );
};

export default Tab;
