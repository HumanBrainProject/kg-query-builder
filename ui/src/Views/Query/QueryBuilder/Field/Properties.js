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

import React, { useRef }  from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars-2";

import { useStores } from "../../../../Hooks/UseStores";

import Filter from "../../../../Components/Filter";
import Groups from "./Properties/Groups";
import List from "./Properties/List";
import Toggle from "../../../../Components/Toggle";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    height: "100%",
    color: "var(--ft-color-normal)",
    "& input": {
      color: "black"
    },
    "& hr": {
      margin: "30px auto",
      maxWidth: "500px",
      borderTopColor: "var(--bg-color-ui-contrast4)"
    },
    "&.has-options": {
      marginTop: "10px",
      "& $panel": {
        height: "calc(100% - 25px)"
      }
    }
  },
  panel: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    border: "1px solid var(--bg-color-ui-contrast4)",
    height: "100%"
  },
  filter: {
    border: 0
  },
  body: {
    padding: "0 10px 10px 10px",
    borderTop: "1px solid var(--bg-color-ui-contrast4)"
  },
  advancedPropertiesToggle: {
    padding: "10px",
    borderTop: "1px solid var(--bg-color-ui-contrast4)"
  }
});

const Properties = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scrollRef = useRef();

  const field = queryBuilderStore.currentField;

  if (!field || !queryBuilderStore.currentFieldLookups.length) {
    return null;
  }

  const lookupsCommonsAttributes = queryBuilderStore.currentFieldLookupsCommonAttributes;
  const lookupsAttributes = queryBuilderStore.currentFieldLookupsAttributes;
  const lookupsCommonsLinks = queryBuilderStore.currentFieldLookupsCommonLinks;
  const lookupsLinks = queryBuilderStore.currentFieldLookupsLinks;

  const handleAddField = (e, schema) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addField(schema, field, !e.ctrlKey && !e.metaKey);
  };

  const handleChildrenFilterChange = value => queryBuilderStore.setChildrenFilterValue(value);

  const handleToggleAdvancedProperties = () => queryBuilderStore.toggleIncludeAdvancedAttributes();

  return (
    <div className={`${classes.container} ${queryBuilderStore.currentField === queryBuilderStore.rootField?"":"has-options"}`}>
      <div className={classes.panel}>
        <Filter className={classes.filter} value={queryBuilderStore.childrenFilterValue} placeholder="Filter properties" onChange={handleChildrenFilterChange} />
        <div className={classes.body}>
          <Scrollbars autoHide ref={scrollRef}>
            <List
              properties={lookupsCommonsAttributes}
              label="Attributes"
              onClick={handleAddField}
            />
            <Groups
              groups={lookupsAttributes}
              prefix="Attributes specific to"
              onClick={handleAddField}
            />
            <List
              properties={lookupsCommonsLinks}
              label="Links"
              onClick={handleAddField}
            />
            <Groups
              groups={lookupsLinks}
              prefix="Links specific to"
              onClick={handleAddField}
            />
          </Scrollbars>
        </div>
        <div className={classes.advancedPropertiesToggle} >
          <Toggle
            label="Show advanced properties"
            option={{
              name: "Show advanced properties",
              value: queryBuilderStore.includeAdvancedAttributes?true:undefined
            }}
            show={true}
            onChange={handleToggleAdvancedProperties} />
        </div>
      </div>
    </div>
  );
});
Properties.displayName = "Properties";

export default Properties;