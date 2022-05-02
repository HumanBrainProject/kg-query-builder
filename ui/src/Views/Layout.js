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
import Modal from "react-bootstrap/Modal";
import { createUseStyles, useTheme } from "react-jss";
import { Navigate, Routes, Route } from "react-router-dom";

import { useStores } from "../Hooks/UseStores";

import Header from "./Header";
import Login from "./Login";
import GlobalError from "./GlobalError";
import Queries from "./Queries";
import RootSchema from "./RootSchema";
import Query from "./Query";

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

const getBackgroundSize = theme => {
  if(theme.background.size) {
    return theme.background.size;
  }
  if(theme.background.image) {
    return "unset";
  }
  return "200%";
}

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
    backgroundSize: getBackgroundSize(theme),
    backgroundImage: theme.background.image?`url('${theme.background.image}')`:"unset",
    backgroundPosition: theme.background.position?theme.background.position:"unset"
  },
  container: {
    width: "100%",
    height: "100%",
    color: "var(--ft-color-normal)",
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
  },
  footer: {
    position: "relative"
  },
  build: {
    color: "var(--ft-color-loud)",
    position: "absolute",
    top: "0px",
    right: "10px"
  }
}));


const NavigationRoutes = observer(({classes}) => {
  const { appStore, authStore, queryBuilderStore } = useStores();
  if (!appStore.isInitialized || !authStore.isAuthenticated) {
    return <Login />;
  }
  
  if(!authStore.isUserAuthorized) {
    return (
      <Modal dialogClassName={classes.noAccessModal} show={true} onHide={() => {}}>
        <Modal.Body>
          <h1>Welcome</h1>
          <p>You are currently not granted permission to acccess the application.</p>
          <p>Please contact our team by email at : <a href={"mailto:kg@ebrains.eu"}>kg@ebrains.eu</a></p>
        </Modal.Body>
      </Modal>
    );
  }
  
  if(!authStore.hasUserSpaces) {
    return(
      <Modal dialogClassName={classes.noAccessModal} show={true} onHide={() => {}}>
        <Modal.Body>
          <h1>Welcome <span title={authStore.firstName}>{authStore.firstName}</span></h1>
          <p>You are currently not granted permission to acccess any spaces.</p>
          <p>Please contact our team by email at : <a href={"mailto:kg@ebrains.eu"}>kg@ebrains.eu</a></p>
        </Modal.Body>
      </Modal>
    )
  }

  return(
    <div className={classes.container}>
      <Routes>
        <Route path="/" element={<RootSchema />} />
        <Route path="queries/:id" element={<Query />} />
        <Route path="queries/:id/:mode" element={<Query />} />
        {queryBuilderStore.hasRootSchema && <Route path="queries" element={<Queries />} />}
        <Route path="*" element={<Navigate to="/" replace={true} />} />  
      </Routes>
    </div>
  )
})


const Layout = observer(() => {

  const theme = useTheme();
  const useGlobalStyles = getGlobalUseStyles();
  useGlobalStyles({ theme });

  const classes = useStyles({ theme });

  const { appStore, authStore } = useStores();
  const commit = authStore.commit;

  return (
    <div className={classes.layout}>
      <Header />
      <div className={classes.body}>
        {appStore.globalError ?
          <GlobalError />
          :
          <NavigationRoutes classes={classes}/>
        }
      </div>
      <div className={classes.footer}>
        <div className={`${classes.status} layout-status`}>
                Copyright &copy; {new Date().getFullYear()} EBRAINS. All rights reserved.
        </div>
        <div className={classes.build}>
          {commit && <span >build: <i>{commit}</i></span>}
        </div>
      </div>
    </div>
  );
});
Layout.displayName = "Layout";

export default Layout;