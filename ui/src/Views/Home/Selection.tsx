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
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";

import { useStores } from "../../Hooks/UseStores";

import Queries from "./Selection/Queries";
import Icon from "../../Components/Icon";
import { Type } from "../../Stores/Type";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    height: "100%",
    width: "100%",
    padding: "10px",
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)",
    color: "var(--ft-color-normal)",
    border: "1px solid var(--border-color-ui-contrast2)",
    overflow: "hidden"
  },
  noSelection: {
    marginTop: "40%",
    textAlign: "center",
    fontSize: "1.4rem",
    marginLeft: "10px",
    marginRight: "10px"
  },
  noSelectionText: {
    fontSize: "small",
    marginTop: "10px"
  },
  choice: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  type: {
    marginTop: "20px",
    color: "var(--ft-color-loud)",
    textAlign: "center",
    fontSize: "1.2rem",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "& p": {
      marginTop: "10px",
      fontSize: "small",
      color: "var(--ft-color-quiet)"
    }
  },
  action: {
    position: "relative",
    marginTop: "30px",
    padding: "15px 10px 15px 15px",
    border: "1px solid var(--border-color-ui-contrast2)",
    color: "var(--ft-color-quiet)",
    fontSize: "1.2em",
    fontWeight: "normal",
    cursor: "pointer",
    transition: "background .3s ease-in-out",
    background: "rgba(0,0,0,0.4)",
    "&:hover": {
      background:
        "linear-gradient(90deg, rgba(30,60,70,0.9) 0%, rgba(20,50,60,0.9) 100%)",
      color: "var(--ft-color-loud)",
      "& $nextIcon": {
        color: "var(--ft-color-loud)"
      }
    }
  },
  actionTitle: {
    marginLeft: "10px"
  },
  nextIcon: {
    position: "absolute",
    top: "16px",
    right: "15px",
    color: "var(--ft-color-quiet)",
    transition: "background .3s ease-in-out, transform .3s ease-in-out"
  },
  showSavedQueries: {
    transform: "rotate(90deg)"
  },
  savedQueries: {
    flex: 1,
    borderTop: "0 !important"
  }
});

const getTypeLabel = (type: Type.Type) => {
  if (!type) {
    return "";
  }
  if (type.label) {
    return type.label;
  }
  if (!type.id) {
    return "";
  }
  const parts = type.id.split("/");
  return parts[parts.length - 1];
};

interface TypeInfoProps {
  className: string;
  type: Type.Type;
}

const TypeInfo = observer(({ className, type }: TypeInfoProps) => {
  return (
    <div className={className}>
      <Icon icon={faCircle} color={type.color} />
      {getTypeLabel(type)} - <small>{type.id}</small>
      {type.description && <p>{type.description}</p>}
    </div>
  );
});

const Selection = observer(() => {
  const classes = useStyles();

  const navigate = useNavigate();

  const { queryBuilderStore, queriesStore, typeStore } = useStores();

  const handleNewQueryClick = () => {
    const uuid = uuidv4();
    navigate(`/queries/${uuid}`);
  };

  const handlShowSavedClick = () =>
    queriesStore.toggleShowSavedQueries(
      !queriesStore.showSavedQueries
    );

  const type = queryBuilderStore.typeId && typeStore.types.get(queryBuilderStore.typeId);

  return (
    <div className={classes.container}>
      {type ? (
        <div className={classes.choice}>
          <TypeInfo className={classes.type} type={type} />
          <div className={classes.action} onClick={handleNewQueryClick}>
            <FontAwesomeIcon icon={faFile} size="lg" />
            <span className={classes.actionTitle}>Create a new query</span>
            <div className={classes.nextIcon}>
              <FontAwesomeIcon icon={faChevronRight} size="lg" />
            </div>
          </div>
          <div className={classes.action} onClick={handlShowSavedClick}>
            <FontAwesomeIcon icon={faTag} size="lg" />
            <span className={classes.actionTitle}>Select a saved query</span>
            <div className={classes.nextIcon}>
              <FontAwesomeIcon
                icon={faChevronRight}
                size="lg"
                className={
                  queriesStore.showSavedQueries
                    ? classes.showSavedQueries
                    : ""
                }
              />
            </div>
          </div>
          {queriesStore.showSavedQueries && (
            <Queries className={classes.savedQueries} />
          )}
        </div>
      ) : (
        <div className={classes.noSelection}>
          Please select a type{" "}
          <p className={classes.noSelectionText}>
            To start querying the EBRAINS Knowledge Graph, please select the
            type of the data structure of your main interest. You will then have
            the chance to collect the various attributes of this type as well as
            connected resources across the graph in your individual query.
          </p>
        </div>
      )}
    </div>
  );
});
Selection.displayName = "Selection";

export default Selection;
