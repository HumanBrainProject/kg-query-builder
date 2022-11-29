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

import React, { useEffect, useState, useRef, MouseEvent } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import uniqueId from "lodash/uniqueId";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { CopyToClipboard } from "react-copy-to-clipboard";

import API from "../Services/API";
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
    cursor: "pointer"
  },
  popOver: {
    maxWidth: "unset !important",
    margin: "0 !important",
    padding: "0 !important",
    transform: "translate(-5px, 5px)",
    background: "var(--list-bg-hover)",
    border: "1px solid var(--border-color-ui-contrast1)",
    borderRadius: 0,
    "& .popover-arrow:after": {
      borderBottomColor: "var(--list-bg-hover)"
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
    color: "var(--ft-color-normal)"
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
    color: "var(--ft-color-loud)"
  },
  email: {},
  tokenCopiedBar: {
    width: "100%",
    height: 0,
    background: "var(--list-bg-hover)",
    overflow: "hidden",
    transition: "height .3s ease-in-out",
    "&.show": {
      height: "48px",
      "& $tokenCopied": {
        transform: "translateY(0)"
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
  icon: {
    margin: 0,
    padding: 0,
    paddingTop: "10px",
    overflow: "hidden",
    border: 0,
    background: "none",
    "& .avatar.default.fa-user": {
      width: "100px",
      transform: "scale(3)",
      color: "#1b1b1b"
    }
  }
});

interface UserProfileTabProps {
  className: string;
  size: number;
}

const UserProfileTab = observer(
  ({ className, size = 30 }: UserProfileTabProps) => {
    const classes = useStyles();

    const buttonRef = useRef<HTMLButtonElement>(null);

    const [showPopOver, setShowPopOver] = useState<boolean>(false);
    const [tokenCopied, setTokenCopied] = useState<NodeJS.Timeout>();

    const { authStore } = useStores();

    useEffect(() => {
      if (showPopOver) {
        API.trackEvent("Tab", "UserProfile", "Open");
      }
      return () => {
        if (showPopOver) {
          setShowPopOver(false);
        }
      };
    }, [showPopOver]);

    const handleButtonClick = (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setShowPopOver(!showPopOver);
    };

    const handlePopOverClose = (e: Event) => {
      e && e.stopPropagation();
      setShowPopOver(false);
    };

    const handleCopyToken = () => {
      API.trackEvent("Token", "Copy");
      clearTimeout(tokenCopied);
      const timer = setTimeout(() => setTokenCopied(undefined), 2000);
      setTokenCopied(timer);
    };

    const handleLogout = () => {
      API.trackEvent("User", "Logout");
      authStore.logout();
    };

    if (
      !authStore.isAuthenticated ||
      !authStore.isUserAuthorized ||
      !authStore.user
    ) {
      return null;
    }

    return (
      <div className={`${classes.container} ${className ? className : ""}`}>
        <button
          className={classes.button}
          onClick={handleButtonClick}
          title="Account"
          ref={buttonRef}
        >
          <Avatar user={authStore.user} size={size} />
        </button>
        <Overlay
          show={showPopOver}
          target={buttonRef.current}
          placement="bottom"
          container={document.body}
          rootClose={true}
          onHide={handlePopOverClose}
        >
          <Popover id={uniqueId("popover")} className={classes.popOver}>
            <div>
              <div className={classes.popOverContent}>
                <div className={classes.icon}>
                  <Avatar user={authStore.user} size={100} />
                </div>
                <div>
                  <div className={classes.name}>
                    {authStore.user.name}
                  </div>
                  <div className={classes.email}>{authStore.user.email}</div>
                </div>
              </div>
              <div className={classes.popOverFooterBar}>
                <div>
                  <CopyToClipboard
                    text={authStore.accessToken}
                    onCopy={handleCopyToken}
                  >
                    <Button variant="secondary">Copy token to clipboard</Button>
                  </CopyToClipboard>
                </div>
                <div>
                  <Button onClick={handleLogout}>Logout</Button>
                </div>
              </div>
              <div
                className={`${classes.tokenCopiedBar} ${
                  tokenCopied ? "show" : ""
                }`}
              >
                <div className={classes.tokenCopied}>
                  <FontAwesomeIcon icon={faCheck} />
                  &nbsp;Token copied to clipboard!
                </div>
              </div>
            </div>
          </Popover>
        </Overlay>
      </div>
    );
  }
);
UserProfileTab.displayName = "UserProfileTab";

export default UserProfileTab;
