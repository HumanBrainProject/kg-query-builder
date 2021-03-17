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

import Name from "./Options/Name";
import Flatten from "./Options/Flatten";
import AddMergeButton from "./Options/AddMergeButton";
import FieldOptions from "./Options/Options";
import Attributes from "./Options/Attributes";
import Links from "./Options/Links";

const useStyles = createUseStyles({
  container: {
    height: "100%",
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
  fieldOptions: {
    position: "relative",
    marginTop: "10px"
  }
});

const Options = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scrollRef = useRef();

  const field = queryBuilderStore.currentField;
  const rootField = queryBuilderStore.rootField;
  const lookupsLinks= queryBuilderStore.currentFieldLookupsLinks;
  const lookupsAttributes = queryBuilderStore.currentFieldLookupsAttributes;
  const lookupsAdvancedAttributes = queryBuilderStore.currentFieldLookupsAdvancedAttributes;
  const parentLookupsAttributes = queryBuilderStore.currentFieldParentLookupsAttributes;
  const parentLookupsLinks = queryBuilderStore.currentFieldParentLookupsLinks;

  const handleAddField = (e, schema) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addField(schema, field, !e.ctrlKey && !e.metaKey);
  };

  const handleAddMergeField = e => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addMergeField(field, !e.ctrlKey && !e.metaKey);
  };

  const handleAddMergeChildField = (e, schema) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addMergeChildField(schema, field, !e.ctrlKey && !e.metaKey);
  };

  const handleChangeFlatten = value => field.setCurrentFieldFlattened(value);

  const handleChangeOption = (name, value) => field.setOption(name, value);

  if (!field) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Scrollbars autoHide ref={scrollRef}>
        <div className={classes.fieldOptions}>
          <Name field={field} rootField={rootField} />
          <FieldOptions field={field} rootField={rootField} lookupsLinks={lookupsLinks} options={field.options} onChange={handleChangeOption} />
          <Flatten
            field={field}
            show={field !== rootField
          && (lookupsLinks && !!lookupsLinks.length)
          && field.structure.length === 1
          && !field.isMerge
            }
            onChange={handleChangeFlatten}
          />
        </div>
        <AddMergeButton
          field={field}
          show={!field.isMerge
          && field !== rootField
          && (lookupsLinks && !!lookupsLinks.length)
          }
          onClick={handleAddMergeField}
        />
        <Attributes
          attributes={parentLookupsAttributes}
          label="attributes valid for"
          isMerge={true}
          show={field.isRootMerge && field !== rootField}
          onClick={handleAddMergeChildField}
        />
        <Links
          links={parentLookupsLinks}
          label="links valid for"
          isMerge={true}
          show={field.isRootMerge && field !== rootField}
          onClick={handleAddMergeChildField}
        />
        <Attributes
          attributes={lookupsAttributes}
          label="Attributes valid for"
          show={!field.isFlattened
          || (field.isMerge
            && (field.isRootMerge
              || (!field.isRootMerge && (!field.structure || !field.structure.length))
            )
          )
          }
          onClick={handleAddField}
        />
        <Attributes
          attributes={lookupsAdvancedAttributes}
          label="Advanced attributes valid for"
          show={!field.isFlattened
          || (field.isMerge
            && (field.isRootMerge
              || (!field.isRootMerge && (!field.structure || !field.structure.length))
            )
          )
          }
          onClick={handleAddField}
        />
        <Links
          links={lookupsLinks}
          label="Links valid for"
          show={!field.isFlattened
          || (field.isMerge
            && (field.isRootMerge
              || (!field.isRootMerge && (!field.structure || !field.structure.length))
            )
          )
          }
          onClick={handleAddField}
        />
      </Scrollbars>
    </div>
  );
});
Options.displayName = "Options";

export default Options;