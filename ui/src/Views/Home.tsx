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

import React, {useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

import { useStores } from "../Hooks/UseStores";

import Types from "./Home/Types";
import Selection from "./Home/Selection";
import API from "../Services/API";
import WelcomeTip from "./WelcomeTip";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    columnGap: "10px",
    height: "100%",
    padding: "10px",
    background: "transparent",
    color: "var(--ft-color-normal)",
    overflow: "hidden",
    "&.showWelcomeTip": {
      gridTemplateRows: "auto 1fr",
      rowGap: "10px",
    }
  },
  welcomeTip: {
    gridColumnEnd: "span 2"
  }
});

const Home = observer(() => {

  const classes = useStyles();

  const [ showWelcomeTip, setShowWelcomeTip ] = useState(!localStorage.getItem("hideWelcomeTip"));

  const { typeStore, queryBuilderStore } = useStores();

  useEffect(() => {
    API.trackCustomUrl(window.location.href);
    API.trackPageView();
    if (!queryBuilderStore.hasRootSchema) {
      const typeId = localStorage.getItem("type");
      const type = typeId && typeStore.types.get(typeId);
      if (type) {
          queryBuilderStore.selectRootSchema(type);
      } else {
        localStorage.removeItem("type");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHideWelcomeTip = () => {
    localStorage.setItem("hideWelcomeTip", "true");
    setShowWelcomeTip(false);
  };

  return (
    <div className={`${classes.container} ${showWelcomeTip?"showWelcomeTip":""}`}>
      <WelcomeTip className={classes.welcomeTip} show={showWelcomeTip} onClose={handleHideWelcomeTip} />
      <Types />
      <Selection />
    </div>
  );
});
Home.displayName = "Home";

export default Home;