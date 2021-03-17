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

import QueryForm from "./QueryBuilder/QueryForm";
import Representation from "./QueryBuilder/Representation";
import Actions from "./QueryBuilder/Actions";
import CompareChangesModal from "./QueryBuilder/CompareChangesModal";
import SaveError from "./QueryBuilder/SaveError";
import SavingMessage from "./QueryBuilder/SavingMessage";
import Options from "./QueryBuilder/Options";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "10px",
    height: "100%",
    padding: "10px"
  },
  body:{
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gridTemplateColumns: "1fr",
    gridGap: "10px",
    height: "100%",
    "&:not(.hasChanged)": {
      "& $form": {
        display: "none"
      },
      "& $representation": {
        gridRowStart: "span 3"
      },
      "& $actions": {
        display: "none"
      }
    }
  },
  options: {
    position:"relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px"
  },
  form: {},
  representation:{},
  actions:{}
});

const QueryBuilder = observer(() => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  if (!queryBuilderStore.rootField) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={`${classes.body} ${queryBuilderStore.isQuerySaved || !queryBuilderStore.isQueryEmpty?"hasChanged":""}`}>
        <QueryForm className={classes.form} />
        <Representation className={classes.representation} />
        <Actions className={classes.actions} />
        <SavingMessage />
        <SaveError />
        <CompareChangesModal />
      </div>
      <div className={classes.options}>
        <Options />
      </div>
    </div>
  );
});
QueryBuilder.displayName = "QueryBuilder";

export default QueryBuilder;