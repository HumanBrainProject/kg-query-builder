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

import React, { useRef }  from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import { useStores } from "../../../Hooks/UseStores";

import Filter from "../../../Components/Filter";
import Attributes from "./Children/Attributes";
import Links from "./Children/Links";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    height: "100%",
    marginTop: "25px",
    color: "var(--ft-color-normal)",
    "& input": {
      color: "black"
    },
    "& hr": {
      margin: "30px auto",
      maxWidth: "500px",
      borderTopColor: "var(--bg-color-ui-contrast4)"
    }
  },
  panel: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    border: "1px solid rgb(108, 117, 125)",
    height: "calc(100% - 25px)"
  },
  filter: {
    border: 0
  },
  body: {
    padding: "0 10px 10px 10px",
    borderTop: "1px solid var(--bg-color-ui-contrast4)"
  }
});

const Children = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scrollRef = useRef();

  const field = queryBuilderStore.currentField;
  const rootField = queryBuilderStore.rootField;

  if (!field || !field.schema.canBe || !Array.isArray(field.schema.canBe) || !field.schema.canBe.length) {
    return null;
  }

  const parentLookupsAttributes = queryBuilderStore.currentFieldParentLookupsAttributes;
  const parentLookupsLinks = queryBuilderStore.currentFieldParentLookupsLinks;
  const lookupsLinks= queryBuilderStore.currentFieldLookupsLinks;
  const lookupsAttributes = queryBuilderStore.currentFieldLookupsAttributes;
  const lookupsAdvancedAttributes = queryBuilderStore.currentFieldLookupsAdvancedAttributes;

  const showParentProperties = field.isRootMerge && field !== rootField;

  const showProperties = !field.isFlattened ||
                          (field.isMerge &&
                            (field.isRootMerge ||
                              (!field.isRootMerge && (!field.structure || !field.structure.length))));

  const showParentLookupsAttributes = showParentProperties && queryBuilderStore.currentFieldParentLookupsAttributes.length;
  const showParentLookupsLinks = showParentProperties && queryBuilderStore.currentFieldParentLookupsLinks.length;
  const showLookupsLinks = showProperties && queryBuilderStore.currentFieldLookupsLinks.length;
  const showLookupsAttributes = showProperties && queryBuilderStore.currentFieldLookupsAttributes.length;
  const showLookupsAdvancedAttributes = showProperties && queryBuilderStore.currentFieldLookupsAdvancedAttributes.length;

  if (!showParentLookupsAttributes && !showParentLookupsLinks && !showLookupsLinks && !showLookupsAttributes && !showLookupsAdvancedAttributes) {
    return null;
  }

  const handleAddField = (e, schema) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addField(schema, field, !e.ctrlKey && !e.metaKey);
  };

  const handleAddMergeChildField = (e, schema) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addMergeChildField(schema, field, !e.ctrlKey && !e.metaKey);
  };

  const handleChange = value => queryBuilderStore.setChildrenFilterValue(value);

  return (
    <div className={classes.container}>
      <div className={classes.panel}>
        <Filter className={classes.filter} value={queryBuilderStore.childrenFilterValue} placeholder="Filter properties" onChange={handleChange} />
        <div className={classes.body}>
          <Scrollbars autoHide ref={scrollRef}>
            <Attributes
              attributes={parentLookupsAttributes}
              label="attributes valid for"
              isMerge={true}
              show={showParentLookupsAttributes}
              onClick={handleAddMergeChildField}
            />
            <Links
              links={parentLookupsLinks}
              label="links valid for"
              isMerge={true}
              show={showParentLookupsAttributes}
              onClick={handleAddMergeChildField}
            />
            <Attributes
              attributes={lookupsAttributes}
              label="Attributes valid for"
              show={showProperties}
              onClick={handleAddField}
            />
            <Attributes
              attributes={lookupsAdvancedAttributes}
              label="Advanced attributes valid for"
              show={showProperties}
              onClick={handleAddField}
            />
            <Links
              links={lookupsLinks}
              label="Links valid for"
              show={showProperties}
              onClick={handleAddField}
            />
          </Scrollbars>
        </div>
      </div>
    </div>
  );
});
Children.displayName = "Children";

export default Children;