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
import { createUseStyles } from "react-jss";
import {observer} from "mobx-react-lite";

import SavedQuery from "./SavedQuery";

const useStyles = createUseStyles({
  container:{
    color: "var(--ft-color-loud)"
  },
  title: {
    display: "flex",
    marginBottom: "10px",
    paddingBottom: "10px",
    paddingTop: "20px",
    borderBottom: "1px solid var(--border-color-ui-contrast5)",
    "& h4": {
      flex: 1,
      display: "inline-block",
      margin: 0,
      padding: 0
    }
  }
});

const SavedQueries = observer(({title, list, showUser, enableDelete}) => {
  const classes = useStyles();
  if (!list || !list.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <h4>{title}</h4>
      </div>
      {list.map(query => (
        <SavedQuery key={query.id} query={query} showUser={showUser} enableDelete={enableDelete} />
      ))}
    </div>
  );
});
SavedQueries.displayName = "SavedQueries";

export default SavedQueries;