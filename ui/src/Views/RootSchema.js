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

import React, {useState} from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { Scrollbars } from "react-custom-scrollbars";

import { useStores } from "../Hooks/UseStores";

import Filter from "../Components/Filter";
import Schemas from "./RootSchema/Schemas";

const useStyles = createUseStyles({
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
  const [cursor, setCursor] = useState(undefined);

  const classes = useStyles();

  const { typeStore } = useStores();

  const handleChange = value => {
    typeStore.setFilterValue(value);
    setCursor(undefined);
  };

  const handleKeyDown = e => {
    if(cursor === undefined && (e.keyCode === 38 || e.keyCode === 40)) {
      setCursor(0);
    }
    if (e.keyCode === 38 && cursor > 0) {
      setCursor(prevCursor => prevCursor - 1);
    } else if (e.keyCode === 40 && cursor < typeStore.filteredWorkspaceTypeList.length - 1) {
      setCursor(prevCursor => prevCursor + 1);
    }
  };

  return (
    <div className={classes.panel}>
      <Filter value={typeStore.filterValue} placeholder="Filter types" onChange={handleChange} onKeyDown={handleKeyDown} />
      <div className={classes.body}>
        <Scrollbars autoHide>
          <div className={classes.content}>
            <Schemas cursor={cursor} onKeyDown={handleKeyDown} />
          </div>
        </Scrollbars>
      </div>
    </div>
  );
});
RootSchemaModal.displayName = "RootSchemaModal";

export default RootSchemaModal;