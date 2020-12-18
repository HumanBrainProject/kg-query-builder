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

import React from "react";
import { observer } from "mobx-react-lite";
import Modal from "react-bootstrap/Modal";
import { createUseStyles, useTheme } from "react-jss";

import { useStores } from "../Hooks/UseStores";

import Header from "./Header";
import Login from "./Login";
import GlobalError from "./GlobalError";
import QueryBuilder from "./QueryBuilder";

const getGlobalUseStyles = () => createUseStyles(theme => {
  const styles = {
    "@global": {
      ":root": {
        "--bg-gradient-start": theme.background.gradient.colorStart,
        "--bg-gradient-end": theme.background.gradient.colorEnd,
        "--bg-gradient-angle": theme.background.gradient.angle,

        "--bg-color-ui-contrast1": theme.contrast1.backgroundColor,
        "--bg-color-ui-contrast2": theme.contrast2.backgroundColor,
        "--bg-color-ui-contrast3": theme.contrast3.backgroundColor,
        "--bg-color-ui-contrast4": theme.contrast4.backgroundColor,

        "--border-color-ui-contrast1": theme.contrast1.borderColor,
        "--border-color-ui-contrast2": theme.contrast2.borderColor,
        "--border-color-ui-contrast5": theme.contrast5.borderColor,

        "--bg-color-blend-contrast1": theme.blendContrast1.backgroundColor,

        "--list-bg-hover": theme.list.hover.backgroundColor,
        "--list-border-hover": theme.list.hover.borderColor,
        "--list-bg-selected": theme.list.selected.backgroundColor,
        "--list-border-selected": theme.list.selected.borderColor,

        "--ft-color-quiet": theme.quiet.color,
        "--ft-color-normal": theme.normal.color,
        "--ft-color-loud": theme.loud.color,
        "--ft-color-louder": theme.louder.color,

        "--ft-color-error": theme.error.color,
        "--bg-color-error-quiet": theme.error.quiet.color,
        "--bg-color-error-normal": theme.error.normal.color,
        "--bg-color-error-loud": theme.error.loud.color,

        "--bg-color-warn-quiet": theme.warn.quiet.color,
        "--bg-color-warn-normal": theme.warn.normal.color,
        "--bg-color-warn-loud": theme.warn.loud.color,

        "--ft-color-info": theme.info.color,
        "--bg-color-info-normal": theme.info.normal.color,

        "--pane-box-shadow": theme.pane.boxShadow.color,

        "--release-status-box-shadow": theme.release.status.boxShadow,
        "--release-color-released": theme.release.status.released.color,
        "--release-bg-released": theme.release.status.released.backgroundColor,
        "--release-color-not-released": theme.release.status.notReleased.color,
        "--release-bg-not-released": theme.release.status.notReleased.backgroundColor,
        "--release-color-has-changed": theme.release.status.hasChanged.color,
        "--release-bg-has-changed": theme.release.status.hasChanged.backgroundColor,

        "--release-color-highlight": theme.release.highlight.color,
        "--release-bg-highlight": theme.release.highlight.backgroundColor,

        "--bookmark-on-color": theme.bookmark.on.color,
        "--bookmark-on-color-highlight": theme.bookmark.on.highlight.color,
        "--bookmark-off-color":"var(--ft-color-normal)",
        "--bookmark-off-color-highlight":"var(--bookmark-on-color-highlight)"
      }
    },
    "@global html, body, #root": {
      height: "100%",
      overflow: "hidden",
      textRendering: "optimizeLegibility",
      "-webkit-font-smoothing": "antialiased",
      "-webkit-tap-highlight-color": "transparent",
      fontFamily: "Lato, sans-serif",
      fontSize: "14px"
    },
    "@global *": {
      boxSizing: "border-box"
    },
    "@global button, @global input[type=button], @global a": {
      "-webkit-touch-callout": "none",
      userSelect: "none"
    },
  };

  if (theme.name === "cupcake") {
    return {
      ...styles,
      ".layout-status": {
        "background": "linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3) !important",
        "background-size": "180% 180% !important",
        animation: "rainbow 3s linear infinite !important",
        "border-top":"1px solid var(--border-color-ui-contrast2)"
      },
      "@keyframes rainbow": {
        "0%":{"background-position":"0% 82%"},
        "50%":{"background-position":"100% 19%"},
        "100%":{"background-position":"0% 82%"}
      },
      ".layout-logo": {
        backgroundImage:"url(https://vignette.wikia.nocookie.net/nyancat/images/f/fd/Taxac_Naxayn.gif/revision/latest/scale-to-width-down/2000?cb=20180518022723)",
        "background-size": "50px 30px",
        "background-repeat": "no-repeat",
        "background-position": "5px 9px",
        "padding-left": "50px !important",
        "padding-top": "14px !important",
        "& img":{
          display:"none"
        }
      }
    };
  }

  return styles;
});

const useStyles = createUseStyles(theme => ({
  layout: {
    height: "100vh",
    display: "grid",
    overflow: "hidden",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto 1fr 20px"
  },
  body: {
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(var(--bg-gradient-angle), var(--bg-gradient-start), var(--bg-gradient-end))",
    backgroundSize: theme.background.size?theme.background.size:(theme.background.image?"unset":"200%"),
    backgroundImage: theme.background.image?`url('${theme.background.image}')`:"unset",
    backgroundPosition: theme.background.position?theme.background.position:"unset"
  },
  status: {
    background: "var(--bg-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    paddingLeft: "10px"
  },
  noAccessModal: {
    maxWidth: "min(max(500px, 50%),750px)",
    "&.modal-dialog": {
      marginTop: "40vh",
      "& .modal-body": {
        padding: "15px 30px",
        fontSize: "1.6rem"
      }
    }
  }
}));

const Layout = observer(() => {

  const theme = useTheme();
  const useGlobalStyles = getGlobalUseStyles();
  useGlobalStyles({ theme });

  const classes = useStyles({ theme });

  const { appStore, authStore } = useStores();

  return (
    <div className={classes.layout}>
      <Header />
      <div className={classes.body}>
        {appStore.globalError ?
          <GlobalError />
          :
          (!appStore.isInitialized || !authStore.isAuthenticated ?
            <Login />
            :
            (authStore.isUserAuthorized?
              (authStore.hasUserWorkspaces?
                <QueryBuilder />
                :
                <Modal dialogClassName={classes.noAccessModal} show={true} onHide={() => {}}>
                  <Modal.Body>
                    <h1>Welcome <span title={authStore.firstName}>{authStore.firstName}</span></h1>
                    <p>You are currently not granted permission to acccess any workspaces.</p>
                    <p>Please contact our team by email at : <a href={"mailto:kg@ebrains.eu"}>kg@ebrains.eu</a></p>
                  </Modal.Body>
                </Modal>
              )
              :              <Modal dialogClassName={classes.noAccessModal} show={true} onHide={() => {}}>
                <Modal.Body>
                  <h1>Welcome</h1>
                  <p>You are currently not granted permission to acccess the application.</p>
                  <p>Please contact our team by email at : <a href={"mailto:kg@ebrains.eu"}>kg@ebrains.eu</a></p>
                </Modal.Body>
              </Modal>
            )
          )
        }
      </div>
      <div className={`${classes.status} layout-status`}>
              Copyright &copy; {new Date().getFullYear()} EBRAINS. All rights reserved.
      </div>
    </div>
  );
});
Layout.displayName = "Layout";

export default Layout;