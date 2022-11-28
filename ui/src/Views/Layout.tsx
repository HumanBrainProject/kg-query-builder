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
import { createUseStyles, DefaultTheme, useTheme, Styles } from "react-jss";

import { useStores } from "../Hooks/UseStores";

import GlobalError from "./GlobalError";
import Header from "./Header";
import Footer from "./Footer";
import Authenticate from "./Authenticate";
import { Theme as AppTheme } from "../Themes/Theme";

const getGlobalUseStyles = () => createUseStyles((theme) => {
  const appTheme = theme as AppTheme;
  const styles = {
    "@global": {
      ":root": {
        "--bg-gradient-start":appTheme.background.gradient.colorStart,
        "--bg-gradient-end":appTheme.background.gradient.colorEnd,
        "--bg-gradient-angle":appTheme.background.gradient.angle,

        "--bg-color-ui-contrast1":appTheme.contrast1.backgroundColor,
        "--bg-color-ui-contrast2":appTheme.contrast2.backgroundColor,
        "--bg-color-ui-contrast3":appTheme.contrast3.backgroundColor,
        "--bg-color-ui-contrast4":appTheme.contrast4.backgroundColor,

        "--border-color-ui-contrast1":appTheme.contrast1.borderColor,
        "--border-color-ui-contrast2":appTheme.contrast2.borderColor,
        "--border-color-ui-contrast5":appTheme.contrast5.borderColor,

        "--bg-color-blend-contrast1":appTheme.blendContrast1.backgroundColor,

        "--list-bg-hover":appTheme.list.hover.backgroundColor,
        "--list-border-hover":appTheme.list.hover.borderColor,
        "--list-bg-selected":appTheme.list.selected.backgroundColor,
        "--list-border-selected":appTheme.list.selected.borderColor,

        "--ft-color-quiet":appTheme.quiet.color,
        "--ft-color-normal":appTheme.normal.color,
        "--ft-color-loud":appTheme.loud.color,
        "--ft-color-louder":appTheme.louder.color,

        "--ft-color-error":appTheme.error.color,
        "--bg-color-error-quiet":appTheme.error.quiet.color,
        "--bg-color-error-normal":appTheme.error.normal.color,
        "--bg-color-error-loud":appTheme.error.loud.color,

        "--bg-color-warn-quiet":appTheme.warn.quiet.color,
        "--bg-color-warn-normal":appTheme.warn.normal.color,
        "--bg-color-warn-loud":appTheme.warn.loud.color,

        "--ft-color-info":appTheme.info.color,
        "--bg-color-info-normal":appTheme.info.normal.color,

        "--pane-box-shadow":appTheme.pane.boxShadow.color,

        "--release-status-box-shadow":appTheme.release.status.boxShadow,
        "--release-color-released":appTheme.release.status.released.color,
        "--release-bg-released":appTheme.release.status.released.backgroundColor,
        "--release-color-not-released":appTheme.release.status.notReleased.color,
        "--release-bg-not-released":appTheme.release.status.notReleased.backgroundColor,
        "--release-color-has-changed":appTheme.release.status.hasChanged.color,
        "--release-bg-has-changed":appTheme.release.status.hasChanged.backgroundColor,

        "--release-color-highlight":appTheme.release.highlight.color,
        "--release-bg-highlight":appTheme.release.highlight.backgroundColor,

        "--bookmark-on-color":appTheme.bookmark.on.color,
        "--bookmark-on-color-highlight":appTheme.bookmark.on.highlight.color,
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
    }
  };

  if (appTheme.name === "cupcake") {
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

  return styles as Styles;
});

const getBackgroundSize = (theme: AppTheme) => {
  if(theme.background.size) {
    return theme.background.size;
  }
  if(theme.background.image) {
    return "unset";
  }
  return "200%";
}

const useStyles = createUseStyles(theme => { 
  const appTheme = theme as AppTheme;
  return {
    container: {
      height: "100vh",
      display: "grid",
      overflow: "hidden",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto 1fr 20px",
      background: "linear-gradient(var(--bg-gradient-angle), var(--bg-gradient-start), var(--bg-gradient-end))",
      backgroundSize: getBackgroundSize(appTheme),
      backgroundImage:appTheme.background.image?`url('${appTheme.background.image}')`:"unset",
      backgroundPosition:appTheme.background.position?appTheme.background.position:"unset",
      color: "var(--ft-color-normal)"
    },
    body: {
      position: "relative",
      overflow: "hidden"
    }
  };
});

const Layout = observer(() => {

  const theme = useTheme<DefaultTheme>();
  const useGlobalStyles = getGlobalUseStyles();
  useGlobalStyles({ theme });

  const classes = useStyles({ theme });

  const { appStore } = useStores();

  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.body}>
        {appStore.globalError ?
          <GlobalError />
          :
          <Authenticate/>
        }
      </div>
      <Footer />
    </div>
  );
});
Layout.displayName = "Layout";

export default Layout;