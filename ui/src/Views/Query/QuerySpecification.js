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

import React, { useRef } from "react";
import ReactJson from "react-json-view";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars";

import { useStores } from "../../Hooks/UseStores";

import ThemeRJV from "../../Themes/ThemeRJV";
import Actions from "./QueryBuilder/Actions";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "1fr auto",
    gridGap: "10px",
    height: "100%",
    padding:"10px"
  },
  body:{
    color:"var(--ft-color-loud)",
    background:"var(--bg-color-ui-contrast3)",
    border: "1px solid var(--border-color-ui-contrast1)",
    padding:"10px"
  }
});

const QuerySpecification = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scrollRef = useRef();

  if (!queryBuilderStore.rootField) {
    return null;
  }

  const handleOnEdit = ({updated_src}) => {
    queryBuilderStore.updateQuery(updated_src);
    return true;
  };

  const handleOnAdd = ({updated_src, namespace}) => {
    if (namespace.join("/") === ""){
      return false;
    }
    queryBuilderStore.updateQuery(updated_src);
    return true;
  };

  const handleOnDelete = ({updated_src, namespace, name}) => {
    if ((namespace.join("/") === "") ||
        (name === "type" && namespace.join("/") === "meta") ||
        (name === "@vocab" && namespace.join("/") === "@context") ||
        (name === "propertyName" && namespace.join("/") === "@context") ||
        (name === "@type" && namespace.join("/") === "@context/propertyName") ||
        (name === "@id" && namespace.join("/") === "@context/propertyName") ||
        (name === "merge" && namespace.join("/") === "@context") ||
        (name === "@type" && namespace.join("/") === "@context/merge") ||
        (name === "@id" && namespace.join("/") === "@context/merge")  ||
        (name === "path" && namespace.join("/") === "@context") ||
        (name === "@type" && namespace.join("/") === "@context/path") ||
        (name === "@id" && namespace.join("/") === "@context/path") ) {
      return false;
    }
    queryBuilderStore.updateQuery(updated_src);
    return true;
  };

  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <Scrollbars autoHide ref={scrollRef}>
          <ReactJson collapsed={false} name={false} theme={ThemeRJV} src={queryBuilderStore.JSONQuery} onEdit={handleOnEdit} onAdd={handleOnAdd} onDelete={handleOnDelete}  />
        </Scrollbars>
      </div>
      <Actions />
    </div>
  );
});
QuerySpecification.displayName = "QuerySpecification";

export default QuerySpecification;