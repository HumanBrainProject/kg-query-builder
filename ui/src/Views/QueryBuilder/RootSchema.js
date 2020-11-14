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