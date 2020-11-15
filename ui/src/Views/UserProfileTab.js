/*
*   Copyright (c) 2020, EPFL/Human Brain Project PCO
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import uniqueId from "lodash/uniqueId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { useStores } from "../Hooks/UseStores";

import Avatar from "../Components/Avatar";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    display: "inline-block"
  },
  button: {
    position: "relative",
    width: "100%",
    margin: 0,
    padding: 0,
    border: 0,
    backgroundColor: "transparent",
    textAlign: "center",
    outline: 0,
    cursor:"pointer"
  },
  popOver: {
    maxWidth: "unset !important",
    margin: "0 !important",
    padding: "0 !important",
    transform: "translate(-5px, 5px)",
    background: "var(--list-bg-hover)",
    border: "1px solid var(--border-color-ui-contrast1)",
    borderRadius: 0,
    "& .arrow": {
      display: "none !important"
    },
    "& .popover-content": {
      padding: "0 !important"
    }
  },
  popOverContent: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto 1fr",
    gridGap: "20px",
    margin: "15px",
    color:"var(--ft-color-normal)"
  },
  popOverFooterBar: {
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto auto",
    gridGap: "20px",
    width: "100%",
    padding: "8px 15px",
    borderTop: "1px solid var(--border-color-ui-contrast1)",
    background: "var(--bg-color-blend-contrast1)",
    wordBreak: "keep-all",
    whiteSpace: "nowrap",
    "& > div": {
      textAlign: "left",
      "& + div": {
        textAlign: "right"
      }
    },
    "& button": {
      borderRadius: "2px"
    }
  },
  name: {
    color:"var(--ft-color-loud)"
  },
  email: {

  },
  accountBtn: {
    borderRadius: "2px",
    marginTop: "25px"
  },
  tokenCopiedBar: {
    width: "100%",
    height: 0,
    background: "var(--list-bg-hover)",
    overflow: "hidden",
    transition: "height .3s ease-in-out",
    "&.show": {
      height: "48px",
      "& $tokenCopied": {
        transform: "translateY(0)",
      }
    }
  },
  tokenCopied: {
    margin: "8px 15px",
    padding: "6px 0",
    color: "var(--release-color-highlight)",
    transition: "transform .3s ease-in-out",
    transform: "translateY(-48px)"
  }
});

const windowHeight = () => {
  const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName("body")[0];
  return w.innerHeight || e.clientHeight || g.clientHeight;
  //return $(window).height();
};

const PopOverContent = ({onSizeChange, children}) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      typeof onSizeChange === "function" && onSizeChange(ref.current.getBoundingClientRect());
    }
  });


  return (
    <div ref={ref}>
      {children}
    </div>
  );

};

const UserProfileTab = observer(({className, size=30}) => {
  const classes = useStyles();
  const [showPopOver, setShowPopOver] = useState(false);
  const [popOverPosition, setPopOverPosition] = useState("bottom");
  const [tokenCopied, setTokenCopied] = useState(null);
  const buttonRef = useRef();

  const { authStore } = useStores();

  const handlePopOverPosition = popOverRect => {
    if (!popOverRect) { return null; }
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const position = (buttonRect.bottom + popOverRect.height + 5) >= windowHeight()?"top":"bottom";
    if (popOverPosition !== position) {
      setPopOverPosition(popOverPosition);
    }
  };

  const handleButtonClick = e => {
    e.stopPropagation();
    setShowPopOver(showPopOver => !showPopOver);
  };

  const handlePopOverClose = e => {
    e.stopPropagation();
    setPopOverPosition(false);
  };

  const handleCopyToken = () => {
    clearTimeout(tokenCopied);
    const timer = setTimeout(() => setTokenCopied(null), 2000);
    setTokenCopied(timer);
  };

  const handleLogout = () => authStore.logout();

  if (!authStore.isAuthenticated || !authStore.isUserAuthorized || !authStore.user) {
    return null;
  }

  return(
    <div className={`${classes.container} ${className?className:""}`}>
      <button className={classes.button} onClick={handleButtonClick} title="Account" ref={buttonRef}>
        <Avatar user={authStore.user} size={size} />
      </button>
      <Overlay
        show={showPopOver}
        target={buttonRef.current}
        placement={popOverPosition}
        outOfBoundaries={false}
        container={document.body}
        rootClose={true}
        onHide={handlePopOverClose}
      >
        <Popover id={uniqueId("popover")} className={classes.popOver}>
          <PopOverContent onSizeChange={handlePopOverPosition}>
            <div className={classes.popOverContent}>
              <Avatar user={authStore.user} size={100} />
              <div>
                <div className={classes.name}>{authStore.user.name}</div>
                <div className={classes.email}>{authStore.user.email}</div>
                <Button variant="primary" className={classes.accountBtn} href="https://collab.humanbrainproject.eu/#/me" title="https://collab.humanbrainproject.eu/#/me" rel="noopener noreferrer" target="_blank">Account</Button>
              </div>
            </div>
            <div className={classes.popOverFooterBar}>
              <div>
                <CopyToClipboard text={authStore.accessToken} onCopy={handleCopyToken}>
                  <Button>Copy token to clipboard</Button>
                </CopyToClipboard>
              </div>
              <div>
                <Button onClick={handleLogout}>Logout</Button>
              </div>
            </div>
            <div className={`${classes.tokenCopiedBar} ${tokenCopied?"show":""}`}>
              <div className={classes.tokenCopied}><FontAwesomeIcon icon={"check"} />&nbsp;Token copied to clipboard!</div>
            </div>
          </PopOverContent>
        </Popover>
      </Overlay>
    </div>
  );

});

export default UserProfileTab;