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

import React, { KeyboardEvent } from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";

import useStores from "../../../Hooks/useStores";

import Type from "./Type";

const useStyles = createUseStyles({
  container: {
    position: "relative"
  },
  activeSchema: {
    "& > div": {
      background: "var(--bg-color-ui-contrast4)",
      "&:focus": {
        outline: 0
      }
    }
  }
});

interface ListProps {
  cursor?: number;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

const List = observer(({cursor, onKeyDown}: ListProps) =>  {

  const classes = useStyles();

  const { typeStore } = useStores();

  return (
    <div className={classes.container}>
      {typeStore.filteredTypeList.map((type, index) =>
        (<div className={cursor === index ? classes.activeSchema: ""} key={type.id}>
          <Type key={type.id} type={type} enableFocus={cursor === index} onKeyDown={onKeyDown}/>
        </div>)
      )}
    </div>
  );
});
List.displayName = "List";

export default List;