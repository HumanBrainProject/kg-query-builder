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

import React, { useRef, useEffect, useState, MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import uniqueId from "lodash/uniqueId";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons/faRedoAlt";
import { faUndoAlt } from "@fortawesome/free-solid-svg-icons/faUndoAlt";
import { Placement } from "react-bootstrap/esm/types";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    display: "inline-block"
  },
  button: {
    position: "relative",
    minWidth: "1.1em",
    margin: 0,
    padding: 0,
    border: 0,
    backgroundColor: "transparent",
    outline: 0
  },
  popOver: {
    background: "#0a2332",
    border: "1px solid var(--list-border-hover)",
    "& .arrow:after": {
      borderBottomColor: "var(--list-border-hover) !important"
    }
  },
  popOverContent: {
    margin: "20px 0",
    color: "var(--ft-color-loud)"
  },
  popOverCloseButton: {
    position: "absolute",
    top: "3px",
    right: "3px",
    color: "var(--ft-color-loud)",
    backgroundColor: "transparent",
    border: "transparent"
  },
  popOverFooterBar: {
    marginBottom: "10px",
    width: "100%",
    textAlign: "center",
    wordBreak: "keep-all",
    whiteSpace: "nowrap",
    "& button + button": {
      marginLeft: "20px"
    }
  }
});

const windowHeight = () => {
  const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0];
  return w.innerHeight || e.clientHeight || g.clientHeight;
};

const PopOverContent = ({ onSizeChange, children }) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      typeof onSizeChange === "function" &&
        onSizeChange(ref.current.getBoundingClientRect());
    }
  });

  return <div ref={ref}>{children}</div>;
};

interface PopOverButtonProps {
  className: string;
  buttonClassName: string;
  buttonTitle: string;
  children: React.ReactNode;
  onCancel: () => void;
  onOk: () => void;
}

const PopOverButton = observer(
  ({
    className,
    buttonClassName,
    buttonTitle,
    children,
    onCancel,
    onOk
  }: PopOverButtonProps) => {
    const classes = useStyles();
    const buttonRef = useRef();
    const [showPopOver, setShowPopOver] = useState(false);
    const [popOverPosition, setPopOverPosition] = useState("bottom");

    useEffect(() => {
      return () => {
        if (showPopOver) {
          setShowPopOver(false);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showPopOver]);

    const handlePopOverPosition = popOverRect => {
      if (!popOverRect) {
        return null;
      }
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const position =
        buttonRect.bottom + popOverRect.height + 5 >= windowHeight()
          ? "top"
          : "bottom";
      if (popOverPosition !== position) {
        setPopOverPosition(position);
      }
    };

    const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPopOver(prevShowPopOver => !prevShowPopOver);
    };

    const handlePopOverClose = (e: MouseEvent<HTMLButtonElement> | Event) => {
      e.stopPropagation();
      setShowPopOver(false);
    };

    const handleCancelClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPopOver(false);
      onCancel();
    };

    const handleOkClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPopOver(false);
      onOk();
    };

    return (
      <div className={`${classes.container} ${className ? className : ""}`}>
        <button
          className={`${classes.button} ${
            buttonClassName ? buttonClassName : ""
          }`}
          onClick={handleButtonClick}
          title={buttonTitle}
          ref={buttonRef}
        >
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </button>
        <Overlay
          show={showPopOver}
          target={buttonRef.current}
          placement={popOverPosition as Placement}
          container={document.body}
          rootClose={true}
          onHide={handlePopOverClose}
        >
          <Popover id={uniqueId("popover")} className={classes.popOver}>
            <PopOverContent onSizeChange={handlePopOverPosition}>
              <div className={classes.popOverContent}>{children}</div>
              <div className={classes.popOverFooterBar}>
                <Button size="sm" onClick={handleCancelClick}>
                  <FontAwesomeIcon icon={faUndoAlt} />
                  &nbsp;Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleOkClick}>
                  <FontAwesomeIcon icon={faRedoAlt} />
                  &nbsp;Retry
                </Button>
              </div>
              <button
                className={classes.popOverCloseButton}
                onClick={handlePopOverClose}
                title="close"
              >
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
              </button>
            </PopOverContent>
          </Popover>
        </Overlay>
      </div>
    );
  }
);
PopOverButton.displayName = "PopOverButton";

export default PopOverButton;
