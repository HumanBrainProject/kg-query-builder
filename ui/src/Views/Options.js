import React from "react";
import { observer } from "mobx-react";
import { createUseStyles } from "react-jss";

import queryBuilderStore from "../Stores/QueryBuilderStore";

import Name from "./Options/Name";
import Flatten from "./Options/Flatten";
import AddMergeButton from "./Options/AddMergeButton";
import FieldOptions from "./Options/Options";
import Attributes from "./Options/Attributes";
import Links from "./Options/Links";

const useStyles = createUseStyles({
  container: {
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
    background: "var(--bg-color-ui-contrast3)",
    margin: "-10px -10px 30px -10px",
    padding: "10px",
    position: "relative",
    "&::after": {
      display: "block",
      content: "''",
      position: "absolute",
      bottom: "-10px",
      left: "50%",
      marginLeft: "-10px",
      width: "20px",
      height: "20px",
      background: "var(--bg-color-ui-contrast3)",
      transform: "rotate(45deg)"
    }
  }
});

const Options = observer(() => {

  const classes = useStyles();

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

  return (
    <div className={classes.container}>
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
        attributes={parentLookupsLinks}
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
        attributes={lookupsLinks}
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
    </div>
  );
});

export default Options;