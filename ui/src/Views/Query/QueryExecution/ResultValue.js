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
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import isObject from "lodash/isObject";

import { useStores } from "../../../Hooks/UseStores";

const useStyles = createUseStyles({
  value:{
    width:"100%",
    overflow:"hidden",
    textOverflow:"ellipsis",
    whiteSpace:"nowrap",
    "&.is-link": {
      cursor: "pointer"
    }
  },
  "@global":{
    "[id^=result-tooltip-] .tooltip-inner":{
      maxWidth:"400px",
    },
    "[id^=result-tooltip-@id] .tooltip-inner":{
      wordBreak:"break-all"
    }
  }
});

const ResultValue = observer(({name, index, value}) => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleOpenCollection = () => queryBuilderStore.appendTableViewRoot(index,name);

  const getLink =  () => {
    const reg = /^https?:\/\/[^.]+\.[^.]+\.[^.]+\/relativeUrl$/;
    if (name === "relativeUrl" || reg.test(name)) {
      return value;
    }
    if (isObject(value)) {
      const result = Object.keys(value).find(n => {
        if (n === "relativeUrl" || reg.test(n)) {
          return true;
        }
        return false;
      });
      if(result) {
        return value[result];
      }
    }
    return null;
  };

  if (Array.isArray(value)) {
    if (!value.length) {
      return (
        <em>empty collection</em>
      );
    }
    return (
      <Button size="sm" variant="primary" onClick={handleOpenCollection}>
          Collection ({value.length})
      </Button>
    );
  }

  const link = getLink();

  return (
    <OverlayTrigger placement="top" overlay={
      <Tooltip id={`result-tooltip-${name}-${index}`}>
        {isObject(value)?
          link?
            link
            :
            <em>{JSON.stringify(value)}</em>
          :value
        }
      </Tooltip>}>
      <div className={`${classes.value} ${link?"is-link":""}`}>
        {isObject(value)?
          link?
            link
            :
            <em>object</em>
          :value
        }
        <Tooltip placement="top" id={`result-tooltip-${name}-${index}-2`}>
          {isObject(value)?
            link?
              link
              :
              <em>{JSON.stringify(value)}</em>
            :value
          }
        </Tooltip>
      </div>
    </OverlayTrigger>
  );

});
ResultValue.displayName = "ResultValue";

export default ResultValue;