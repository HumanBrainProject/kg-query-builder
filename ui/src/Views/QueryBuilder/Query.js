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
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";

import { useStores } from "../../Hooks/UseStores";

import QueryForm from "./Query/QueryForm";
import Representation from "./Query/Representation";
import CompareChangesModal from "./Query/CompareChangesModal";
import SaveError from "./Query/SaveError";
import SavingMessage from "./Query/SavingMessage";

const useStyles = createUseStyles({
  container:{
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    gridTemplateColumns: "1fr",
    gridGap: "10px",
    height: "100%"
  },
  form: {
    "&:not(.available)": {
      display: "none",
      "& + $representation": {
        gridRowStart: "span 2"
      }
    }
  },
  representation:{}
});

const Query = observer(() => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  if (!queryBuilderStore.rootField) {
    return null;
  }

  return (
    <div className={classes.container}>
      <QueryForm className={`${classes.form} ${queryBuilderStore.isQuerySaved || !queryBuilderStore.isQueryEmpty?"available":""}`} />
      <Representation className={classes.representation} />
      <SavingMessage />
      <SaveError />
      <CompareChangesModal />
    </div>
  );
});
Query.displayName = "Query";

export default Query;