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
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";

import { useStores } from "../../Hooks/UseStores";

import QueryForm from "./QueryBuilder/QueryForm";
import Representation from "./QueryBuilder/Representation";
import Actions from "./Actions";
import Options from "./QueryBuilder/Field/Options";
import Properties from "./QueryBuilder/Field/Properties";

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
    display: "grid",
    gridTemplateRows: "auto 1fr",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px"
  },
  form: {},
  representation:{},
  actions: {
    position: "relative",
    background: "var(--bg-color-ui-contrast2)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color: "var(--ft-color-loud)",
    padding: "10px 10px 0 0",
    "& > div": {
      textAlign: "right",
      "& > button": {
        marginLeft: "10px",
        marginBottom: "10px"
      }
    }
  }
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
        <div className={classes.actions}>
          <div>
            <Actions />
          </div>
        </div>
      </div>
      <div className={classes.options}>
        <Options />
        <Properties />
      </div>
    </div>
  );
});
QueryBuilder.displayName = "QueryBuilder";

export default QueryBuilder;