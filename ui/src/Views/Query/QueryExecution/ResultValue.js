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
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import isObject from "lodash/isObject";

import { useStores } from "../../../Hooks/UseStores";

const useStyles = createUseStyles({
  value: {
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&.is-link": {
      cursor: "pointer",
    },
  },
  "@global": {
    "[id^=result-tooltip-] .tooltip-inner": {
      maxWidth: "400px",
    },
    "[id^=result-tooltip-@id] .tooltip-inner": {
      wordBreak: "break-all",
    },
  },
});

const TooltipContent = observer((value, link) => {
  if (isObject(value)) {
    if (link) {
      return link;
    }
    return <em>{JSON.stringify(value)}</em>;
  }
  return value;
});

const ResultValue = observer(({ name, index, value }) => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleOpenCollection = () =>
    queryBuilderStore.appendTableViewRoot(index, name);

  const getLink = () => {
    const reg = /^https?:\/\/[^.]+\.[^.]+\.[^.]+\/relativeUrl$/;
    if (name === "relativeUrl" || reg.test(name)) {
      return value;
    }
    if (isObject(value)) {
      const result = Object.keys(value).find((n) => {
        if (n === "relativeUrl" || reg.test(n)) {
          return true;
        }
        return false;
      });
      if (result) {
        return value[result];
      }
    }
    return null;
  };

  if (Array.isArray(value)) {
    if (!value.length) {
      return <em>empty collection</em>;
    }
    return (
      <Button size="sm" variant="primary" onClick={handleOpenCollection}>
        Collection ({value.length})
      </Button>
    );
  }

  const link = getLink();

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={`result-tooltip-${name}-${index}`}>
          <TooltipContent value={value} link={link} />
        </Tooltip>
      }
    >
      <div className={`${classes.value} ${link ? "is-link" : ""}`}>
        {isObject(value) ? link ? link : <em>object</em> : value}
        <Tooltip placement="top" id={`result-tooltip-${name}-${index}-2`}>
          <TooltipContent value={value} link={link} />
        </Tooltip>
      </div>
    </OverlayTrigger>
  );
});

export default ResultValue;
