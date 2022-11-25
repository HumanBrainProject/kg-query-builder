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

import React from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import { Scrollbars } from "react-custom-scrollbars-2";

import { useStores } from "../../../Hooks/UseStores";

import Field from "./Field";

const useStyles = createUseStyles({
  container: {
    position:"relative",
    background: "linear-gradient(135deg, rgba(15,35,45,0.2) 0%, rgba(5,20,35,0.6) 100%)",
    border: "1px solid var(--border-color-ui-contrast1)",
    color:"var(--ft-color-normal)"
  }
});

interface RepresentationProps {
  className: string;
}

const Representation = observer(({ className }:RepresentationProps) => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();


  if (!queryBuilderStore.rootField) {
    return null;
  }
  return (
    <div className={`${classes.container} ${className}`}>
      <Scrollbars autoHide>
        <Field field={queryBuilderStore.rootField} />
      </Scrollbars>
    </div>
  );
});
Representation.displayName = "Representation";

export default Representation;