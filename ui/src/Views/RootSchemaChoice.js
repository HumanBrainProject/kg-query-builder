import React from "react";
import queryBuilderStore from "../Stores/QueryBuilderStore";
import typesStore from "../Stores/TypesStore";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Icon from "../Components/Icon";

const useStyles = createUseStyles({
  container: {
    color: "var(--ft-color-loud)"
  },
  schemaSelectGroup: {
    fontSize: "1.25em",
    fontWeight: "bold",
    marginBottom: "10px",
    "& h3": {
      paddingLeft: "10px"
    }
  },
  schemaSelectSchema: {
    fontSize: "0.8em",
    fontWeight: "normal",
    cursor: "pointer",
    padding: "10px",
    margin: "1px",
    background: "var(--bg-color-ui-contrast1)",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "&:hover": {
      background: "var(--bg-color-ui-contrast4)",
    }
  }
});

const RootSchemaChoice = observer(() =>  {
  const classes = useStyles();

  const handleSelectRootSchema = schema => queryBuilderStore.selectRootSchema(schema);

  return (
    <div className={classes.container}>
      {typesStore.filteredWorkspaceTypeList.map(type => (
        <div className={classes.schemaSelectSchema} key={type.id} onClick={()=>handleSelectRootSchema(type)}>
          <Icon icon="circle" color={type.color}/>
          {type.label} - <small>{type.id}</small>
        </div>
      ))}
    </div>
  );

});

export default RootSchemaChoice;