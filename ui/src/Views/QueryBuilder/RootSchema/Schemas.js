import React from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

import typesStore from "../../../Stores/TypesStore";

import Schema from "./Schema";

const useStyles = createUseStyles({
  container: {
    position: "relative"
  }
});

const Schemas = observer(() =>  {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {typesStore.filteredWorkspaceTypeList.map(type => (
        <Schema key={type.id} type={type} />
      ))}
    </div>
  );

});

export default Schemas;