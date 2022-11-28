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

import React, { ChangeEvent } from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";

import Toggle from "../../../Components/Toggle";

import { useStores } from "../../../Hooks/UseStores";

const useStyles = createUseStyles({
  container: {
    display: "flex",
    alignItems: "baseline",
    whiteSpace: "nowrap"
  },
  toggle: {
    display: "inline-block",
    margin: "6px 0"
  },
  select: {
    marginBottom: 0,
    display: "inline-block",
    minWidth: "100px",
    width: "100%",
    padding: "0.375rem 20px 0.75rem 6px",
    color: "var(--ft-color-loud)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "-webkit-appearance": "none",
    "&:not(.disabled):not(:disabled):hover": {
      //backgroundColor: "#5a6268",
      //borderColor: "#5a6268"
    },
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent",
      outline: 0,
      boxShadow: "0 0 0 0.2rem rgb(0 123 255 / 25%)"
    },
    "&.disabled,&:disabled": {
      backgroundColor: "var(--bg-color-blend-contrast1)",
      color: "var(--ft-color-normal)",
      cursor: "text"
    }
  },
  selectBox: {
    flex: 1,
    position: "relative",
    marginLeft: "5px",
    "&:not(.disabled):after": {
      content: '""',
      position: "absolute",
      top: "50%",
      right: "10px",
      width: 0,
      height: 0,
      marginTop: "-3px",
      borderTop: "6px solid white",
      borderRight: "6px solid transparent",
      borderLeft: "6px solid transparent",
      pointerEvents: "none"
    }
  }
});

interface SpaceFormProps {
  className: string;
}

const SpaceForm = observer(({ className }: SpaceFormProps) => {
  const classes = useStyles();

  const { queryBuilderStore, authStore } = useStores();

  const isShared =
    queryBuilderStore.space && !queryBuilderStore.space.isPrivate;

  const isReadMode =
    !queryBuilderStore.saveAsMode ||
    !authStore.allowedSharedSpacesToCreateQueries.length;

  const sharedSpaces = isReadMode
    ? authStore.sharedSpaces
    : authStore.allowedSharedSpacesToCreateQueries;

  const sharedSpaceClass = `${classes.selectBox} ${
    isReadMode ? "disabled" : ""
  }`;

  const handleChangeSpace = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!isReadMode) {
      const space =
        authStore.getSpace(e.target.value) || authStore.privateSpace;
      if (space) {
        queryBuilderStore.setSpace(space);
      }
    }
  };

  const handleChangePrivate = (_?: string, isSpaceShared?: boolean) => {
    if (!isReadMode) {
      if (isSpaceShared && authStore.sharedSpaces.length) {
        queryBuilderStore.setSpace(authStore.sharedSpaces[0]);
      } else {
        if (authStore.privateSpace) {
          queryBuilderStore.setSpace(authStore.privateSpace);
        }
      }
    }
  };

  return (
    <div className={`${classes.container} ${className ? className : ""}`}>
      <Toggle
        className={classes.toggle}
        option={{ name: "", value: isShared ? true : undefined }}
        label="Shared"
        show={true}
        onChange={handleChangePrivate}
      />
      {isShared ? (
        <>
          &nbsp;in space
          <div className={sharedSpaceClass}>
            <select
              className={classes.select}
              value={queryBuilderStore.space?.name}
              onChange={handleChangeSpace}
              disabled={isReadMode}
            >
              {sharedSpaces.map(space => (
                <option key={space.name} value={space.name}>
                  {space.name}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <span style={{ flex: 1 }}></span>
      )}
    </div>
  );
});
SpaceForm.displayName = "SpaceForm";

export default SpaceForm;
