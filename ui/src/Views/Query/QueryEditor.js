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

import React, { useRef, useState } from "react";
import ReactJson from "react-json-view";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars";
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useStores } from "../../Hooks/UseStores";

import ThemeRJV from "../../Themes/ThemeRJV";
import Actions from "./Actions";

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
    background:"var(--bg-color-ui-contrast3)",
    border: "1px solid var(--border-color-ui-contrast1)",
    padding:"10px"
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

  const scrollRef = useRef();

  const [error, setError] = useState(null);

  if (!queryBuilderStore.rootField) {
    return null;
  }

  const handleOnEdit = ({updated_src}) => {
    queryBuilderStore.updateQuery(updated_src);
    return true;
  };

  const handleOnAdd = ({existing_src, updated_src, namespace}) => {
    const path = namespace.join("/");
    if (path === ""){
      setError("Adding properties to the root path is forbidden.");
      queryBuilderStore.updateQuery(existing_src);
    } else {
      queryBuilderStore.updateQuery(updated_src);
    }
    return true;
  };

  const handleOnDelete = ({existing_src, updated_src, namespace, name}) => {
    const path = namespace.join("/");
    if ((path === "") ||
        (name === "type" && path === "meta") ||
        (name === "@vocab" && path === "@context") ||
        (name === "propertyName" && path === "@context") ||
        (name === "@type" && path === "@context/propertyName") ||
        (name === "@id" && path === "@context/propertyName") ||
        (name === "merge" && path === "@context") ||
        (name === "@type" && path === "@context/merge") ||
        (name === "@id" && path === "@context/merge")  ||
        (name === "path" && path === "@context") ||
        (name === "@type" && path === "@context/path") ||
        (name === "@id" && path === "@context/path") ) {
      setError(`Deleting ${name} of ${path} is forbidden.`);
      queryBuilderStore.updateQuery(existing_src);
    } else {
      queryBuilderStore.updateQuery(updated_src);
    }
    return true;
  };

  const handleOnErrorClose = () => setError(null);

  return (
    <div className={classes.container}>
      <div className={classes.error} onClick={handleOnErrorClose} >
        {error && (
          <Alert variant="danger" onClose={handleOnErrorClose} dismissible>
            <FontAwesomeIcon icon="ban" />{error}
          </Alert>
        )}
      </div>
      <div className={classes.body}>
        <Scrollbars autoHide ref={scrollRef}>
          <ReactJson collapsed={false} name={false} theme={ThemeRJV} src={queryBuilderStore.JSONQuery} onEdit={handleOnEdit} onAdd={handleOnAdd} onDelete={handleOnDelete}  />
        </Scrollbars>
      </div>
      <Actions />
    </div>
  );
});
QueryEditor.displayName = "QueryEditor";

export default QueryEditor;