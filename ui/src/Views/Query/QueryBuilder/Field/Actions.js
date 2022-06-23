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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons/faArrowUp";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons/faArrowDown";

import Button from "react-bootstrap/Button";

import { useStores } from "../../../../Hooks/UseStores";

const useStyles = createUseStyles({
  container: {
    position: "absolute",
    right: "6px",
    top: "6px",
    "&>button.btn": {
      "&:not(:first-child):not(:last-child)": {
        borderRadius: 0
      },
      "&:first-child": {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      },
      "&:last-child": {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }
    }
  }
});

const Actions = observer(({ field, className }) => {
  
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleRemoveField = (e) => {
    e.stopPropagation();
    queryBuilderStore.removeField(field);
  };

  const handleMoveUpField = (e) => {
    e.stopPropagation();
    queryBuilderStore.moveUpField(field);
  };

  const handleMoveDownField = (e) => {
    e.stopPropagation();
    queryBuilderStore.moveDownField(field);
  };

  const fieldIndex = field.parent
    ? field.parent.structure.findIndex((f) => f === field)
    : -1;

  const canMoveUp = fieldIndex >= 1;
  const canMoveDown =
    fieldIndex === -1 ? false : fieldIndex < field.parent.structure.length - 1;

  if (!field.parent) {
    return null;
  }

  return (
    <div className={`${classes.container} ${className?className:""}`}>
      {canMoveUp && (
        <Button
          size="sm"
          variant="primary"
          onClick={handleMoveUpField}
          title="move up"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      )}
      {canMoveDown && (
        <Button
          size="sm"
          variant="primary"
          onClick={handleMoveDownField}
          title="move down"
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </Button>
      )}
      <Button
        size="sm"
        variant="primary"
        onClick={handleRemoveField}
        title="remove"
      >
        <FontAwesomeIcon icon={faTimes} />
      </Button>
    </div>
  );
});
Actions.displayName = "Actions";

export default Actions;
