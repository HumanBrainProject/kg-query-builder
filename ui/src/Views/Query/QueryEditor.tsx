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

import React, { useState } from "react";
import ReactJson, { InteractionProps } from "react-json-view";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars-2";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBan} from "@fortawesome/free-solid-svg-icons/faBan";
import jsonld from "jsonld";

import { useStores } from "../../Hooks/UseStores";

import ThemeRJV from "../../Themes/ThemeRJV";
import Actions from "./Actions";
import { QuerySpecification } from "../../Stores/QueryBuilderStore/QuerySpecification";
import { FIELD_FLAGS } from "../../Stores/Field";
import { Query } from "../../Stores/Query";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    gridGap: "10px",
    height: "100%",
    padding:"0 10px 10px 10px"
  },
  body:{
    color:"var(--ft-color-loud)",
    background: "rgba(0,0,0,0.4)",
    border: "1px solid var(--border-color-ui-contrast1)",
    padding:"10px",
    "& .react-json-view": {
      backgroundColor: "rgba(0,0,0,0.3) !important"
    }
  },
  actions: {
    position: "relative",
    background: "linear-gradient(90deg, rgba(5,25,35,0.4) 0%, rgba(5,20,35,0.8) 100%)",
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
  },
  error: {
    cursor: "pointer",
    "& [role=\"alert\"]": {
      marginTop: "10px",
      marginBottom: 0,
      "& svg": {
        marginRight: "4px",
        transform: "translateY(1px)"
      }
    }
  }
});

const QueryEditor = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const [error, setError] = useState<string>();

  if (!queryBuilderStore.rootField) {
    return null;
  }

  const updateQuery = async (o: object) => {
    if (o) {
      try {
        const jsonSpec = o as QuerySpecification.QuerySpecification;
        const query = await Query.normalizeQuery(jsonSpec);
        queryBuilderStore.updateQuery(query);
      } catch (e) {
        setError(`Error while trying to expand/compact JSON-LD (${e})`);
      }
    }
  };

  const handleOnEdit = ({updated_src}:InteractionProps) => {
    updateQuery(updated_src);
  };

  const handleOnAdd = ({existing_src, updated_src, namespace, name, new_value}:InteractionProps) => {
    const path = namespace ? namespace.join("/"): "";
    if (path === "" && name === ""){
      setError("Adding properties to the root path is forbidden.");
      updateQuery(existing_src);
    } else {
      if ((Array.isArray(namespace) && namespace.length && namespace[namespace.length-1]) || name === "structure") {
        if (new_value instanceof Object) {
          const new_value_object: jsonld.NodeObject = {...new_value};
          FIELD_FLAGS.forEach(name => {
            if (name in new_value_object && !new_value_object[name]) {
              new_value_object[name] = true;
            }
          });
        }
      }
      updateQuery(updated_src);
    }
  };

  const handleOnDelete = ({existing_src, updated_src, namespace, name}:InteractionProps) => {
    const path = namespace?namespace.join("/"):"";
    if ((path === "") ||
        (name === "type" && path === "meta") ||
        (name === "@vocab" && path === "@context") ||
        (name === "propertyName" && path === "@context") ||
        (name === "@type" && path === "@context/propertyName") ||
        (name === "@id" && path === "@context/propertyName") ||
        (name === "path" && path === "@context") ||
        (name === "@type" && path === "@context/path") ||
        (name === "@id" && path === "@context/path") ) {
      setError(`Deleting ${name} of ${path} is forbidden.`);
      updateQuery(existing_src);
    } else {
      updateQuery(updated_src);
    }
  };

  const handleOnErrorClose = () => setError(undefined);

  return (
    <div className={classes.container}>
      <div className={classes.error} onClick={handleOnErrorClose} >
        {error && (
          <Alert variant="danger" onClose={handleOnErrorClose} dismissible>
            <FontAwesomeIcon icon={faBan} />{error}
          </Alert>
        )}
      </div>
      <div className={classes.body}>
        <Scrollbars autoHide>
          <ReactJson collapsed={false} name={false} theme={ThemeRJV} src={queryBuilderStore.querySpecification} onEdit={handleOnEdit} onAdd={handleOnAdd} onDelete={handleOnDelete}  />
        </Scrollbars>
      </div>
      <div className={classes.actions}>
        <div>
          <Actions />
        </div>
      </div>
    </div>
  );
});
QueryEditor.displayName = "QueryEditor";

export default QueryEditor;