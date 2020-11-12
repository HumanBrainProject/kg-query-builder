import React from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import typesStore from "../../Stores/TypesStore";

import Filter from "../../Components/Filter";
import Schemas from "./RootSchema/Schemas";

const useStyles = createUseStyles({
  container: {
    position: "relatif",
    display: "grid",
    gridTemplateRows: "auto 1fr"
  },
  panel: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "auto 1fr",
    height: "85vh",
    width: "90%",
    margin: "auto",
    marginTop: "5vh",
    background: "var(--bg-color-ui-contrast2)",
    color: "var(--ft-color-normal)",
    border: "1px solid var(--border-color-ui-contrast2)",
    overflow: "hidden",
    "@media screen and (min-width:1024px)": {
      width: "900px"
    }
  },
  body: {
    padding: "10px 0",
    background: "var(--bg-color-ui-contrast2)"
  },
  content: {
    padding: "0 10px",
  }
});

const RootSchemaModal = observer(() => {

  const classes = useStyles();

  const handleChange = value => typesStore.setFilterValue(value);

  return (
    <div className={classes.container}>
      <div className={classes.panel}>
        <Filter value={typesStore.filterValue} placeholder="Filter types" onChange={handleChange} />
        <div className={classes.body}>
          <Scrollbars autoHide>
            <div className={classes.content}>
              <Schemas />
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
});

export default RootSchemaModal;