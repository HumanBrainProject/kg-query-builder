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

import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import uniqueId from "lodash/uniqueId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactPiwik from "react-piwik";

import { useStores } from "../Hooks/UseStores";

import Avatar from "../Components/Avatar";

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
  },
  profilePictureButton: {
    margin: 0,
    padding: 0,
    overflow: "hidden",
    border: 0,
    background: "none",
    "&:hover $profilePictureCamera": {
      color: "rgba(0, 0, 0, 0.45)"
    },
    "&:hover $profilePicturePlus": {
      color: "rgba(0, 0, 0, 0.65)"
    },
    "& .avatar.default.fa-user": {
      width: "100px",
      transform: "scale(8)",
      color: "#1b1b1b"
    }
  },
  profilePictureCamera: {
    position: "absolute",
    top: "30px",
    left: "35px",
    color: "rgba(0, 0, 0, 0.25)",
    transition: "color 0.25 ease-in-out"
  },
  profilePicturePlus: {
    position: "absolute",
    top: "50px",
    left: "55px",
    color: "rgba(0, 0, 0, 0.45)",
    transition: "color 0.25 ease-in-out"
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

const UserProfileTab = observer(({ className, size=30 }) => {

  const classes = useStyles();

  const buttonRef = useRef();
  const imageFileRef = useRef();

  const [showPopOver, setShowPopOver] = useState(false);
  const [popOverPosition, setPopOverPosition] = useState("bottom");
  const [tokenCopied, setTokenCopied] = useState(null);

  const { authStore } = useStores();

  useEffect(() => {
    if(showPopOver) {
      ReactPiwik.push(["trackEvent", "Tab", "UserProfile", "Open"]);
    }
    return () => {
      if (showPopOver) {
        handlePopOverClose();
      }
    };
  }, [showPopOver]);

  const handlePopOverPosition = popOverRect => {
    if (!popOverRect) { return null; }
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const position = (buttonRect.bottom + popOverRect.height + 5) >= windowHeight()?"top":"bottom";
    if (popOverPosition !== position) {
      setPopOverPosition(position);
    }
  };

  const handleButtonClick = e => {
    e.stopPropagation();
    setShowPopOver(!showPopOver);
  };

  const handlePopOverClose = e => {
    e && e.stopPropagation();
    setShowPopOver(false);
  };

  const handleCopyToken = () => {
    ReactPiwik.push(["trackEvent", "Token", "Copy"]);
    clearTimeout(tokenCopied);
    const timer = setTimeout(() => setTokenCopied(null), 2000);
    setTokenCopied(timer);
  };

  // const handlePictureClick = e => {
  //   e && e.stopPropagation();
  //   imageFileRef.current.click();
  // };

  // const handleImageFileChange = () => {
  //   if (imageFileRef.current.files.length) {
  //     const reader = new FileReader();
  //     const sendPictureToBackend = () => {
  //       authStore.saveProfilePicture(reader.result);
  //       reader.removeEventListener("load", sendPictureToBackend);
  //     };
  //     reader.addEventListener("load", sendPictureToBackend, false);
  //     reader.readAsDataURL(imageFileRef.current.files[0]);
  //   }
  // };

  const handleLogout = () => {
    ReactPiwik.push(["trackEvent", "User", "Logout"]);
    authStore.logout();
  }

  if (!authStore.isAuthenticated || !authStore.isUserAuthorized || !authStore.user) {
    return null;
  }

  return (
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
              {/* <button className={classes.profilePictureButton} onClick={handlePictureClick} title="Click to change your profile picture." > */}
              <button className={classes.profilePictureButton} >
                <Avatar user={authStore.user} size={100} />
                <FontAwesomeIcon icon={"camera"} size="5x" className={classes.profilePictureCamera} />
                <FontAwesomeIcon icon={"plus"} size="2x" className={classes.profilePicturePlus} />
              </button>
              {/* <input type="file" accept="image/*" ref={imageFileRef} style={{display: "none"}} onChange={handleImageFileChange} /> */}
              <input type="file" accept="image/*" ref={imageFileRef} style={{display: "none"}} />
              <div>
                <div className={classes.name}>{authStore.user.displayName}</div>
                <div className={classes.email}>{authStore.user.email}</div>
                <Button variant="primary" className={classes.accountBtn} href="https://iam.ebrains.eu/auth/realms/hbp/account/" title="https://iam.ebrains.eu/auth/realms/hbp/account/" rel="noopener noreferrer" target="_blank">Account</Button>
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
UserProfileTab.displayName = "UserProfileTab";

export default UserProfileTab;