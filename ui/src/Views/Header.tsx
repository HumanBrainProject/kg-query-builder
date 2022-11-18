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

import { useStores } from "../Hooks/UseStores";

import HomeTab from "./HomeTab";
import UserProfileTab from "./UserProfileTab";

const useStyles = createUseStyles({
  container: {
    background: "rgba(0,0,0,0.4)",
    display: "grid",
    gridTemplateRows: "1fr",
    gridTemplateColumns: "auto 1fr auto"
  },
  fixedTabsLeft: {
    display: "grid",
    gridTemplateColumns: "auto auto auto auto 1fr"
  },
  fixedTabsRight: {
    display: "grid",
    gridTemplateColumns: "repeat(6, auto)"
  },
  logo: {
    padding: "10px",
    cursor: "pointer",
    "& span": {
      color: "var(--ft-color-loud)",
      display: "inline-block",
      paddingLeft: "10px",
      fontSize: "0.9em",
      borderLeft: "1px solid var(--border-color-ui-contrast5)",
      marginLeft: "10px"
    },
    "&:hover span": {
      color: "var(--ft-color-louder)"
    }
  },
  userProfileTab: {
    width: "50px",
    height: "50px",
    lineHeight: "50px",
    border1: "1px solid var(--border-color-ui-contrast2)",
    borderLeft: "none",
    border: 0,
    "& > button": {
      background: "transparent",
      color: "rgba(255,255,255,0.6)",
      transition: "background-color 0.3s ease-in-out",
      "&:hover" : {
        background: "rgba(0,0,0,0.2)",
        color: "white"
      }
    }
  }
});

const Header = observer(() => {

  const classes = useStyles();

  const { appStore } = useStores();

  return (
    <div className={classes.container}>
      <div className={`${classes.logo} layout-logo`}>
        <img src={`${window.rootPath}/assets/ebrains.svg`} alt="" height="30" />
        <span>Knowledge Graph Query Builder</span>
      </div>
      {!appStore.globalError &&
          <>
            <div className={classes.fixedTabsLeft}>
              <HomeTab />
            </div>
            <div className={classes.fixedTabsRight}>
              <UserProfileTab className={classes.userProfileTab} size={32} />
            </div>
          </>
      }
    </div>
  );
});
Header.displayName = "Header";

export default Header;