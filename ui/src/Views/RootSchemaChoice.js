import React from "react";
import queryBuilderStore from "../Stores/QueryBuilderStore";
import typesStore from "../Stores/TypesStore";
import { observer } from "mobx-react";
import injectStyles from "react-jss";

let style = {
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
  },
};

@observer
@injectStyles(style)
class RootSchemaChoice extends React.Component {
  handleSelectRootSchema = (schema) => {
    queryBuilderStore.selectRootSchema(schema);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {typesStore.filteredWorkspaceTypeList.map(type => (
          <div className={classes.schemaSelectSchema} key={type.id} onClick={this.handleSelectRootSchema.bind(this, type)}>
            {type.label} - <small>{type.id}</small>
          </div>
        ))}
      </div>
    );
  }
}

export default RootSchemaChoice;