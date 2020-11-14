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
import { toJS } from "mobx";
import { createUseStyles } from "react-jss";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import get from "lodash/get";
import isObject from "lodash/isObject";
import isString from "lodash/isString";

import queryBuilderStore from "../../../Stores/QueryBuilderStore";

import BGMessage from "../../../Components/BGMessage";
import FetchingLoader from "../../../Components/FetchingLoader";
import Breadcrumb from "../../../Components/Breadcrumb";
import ResultOptions from "./ResultOptions";

const useStyles = createUseStyles({
  container:{
    color:"var(--ft-color-loud)",
    "& td":{

    },
    "& th:first-child":{
      width:"40px"
    },
    "& table.table":{
      tableLayout:"fixed",
      "&>thead>tr>th": {
        wordBreak: "break-word"
      }
    }
  },
  fetchingPanel: {
    width: "100%",
    height: "100%",
    zIndex: 10000,
    "& .fetchingPanel": {
      width: "auto",
      padding: "30px",
      border: "1px solid var(--border-color-ui-contrast1)",
      borderRadius: "4px",
      color: "var(--ft-color-loud)",
      background: "var(--list-bg-hover)"
    }
  },
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
  },
  breadcrumb:{
    overflow:"hidden",
    marginBottom:"20px"
  },
  table: {
    color: "var(--ft-color-loud)"
  }
});

const ResultValue = observer(({name, index, value}) => {
  const classes = useStyles();

  const handleOpenCollection = () => queryBuilderStore.appendTableViewRoot(index,name);

  const getLink =  () => {
    const reg = /^https?:\/\/[^.]+\.[^.]+\.[^.]+\/relativeUrl$/;
    if (name === "relativeUrl" || reg.test(name)) {
      return value;
    }
    if (isObject(value)) {
      let result = null;
      Object.keys(value).some(n => {
        if (n === "relativeUrl" || reg.test(n)) {
          result = value[n];
          return true;
        }
      });
      return result;
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

const ResultTable = observer(() => {
  const classes = useStyles();

  const handleBreadcrumbClick = index => queryBuilderStore.returnToTableViewRoot(index);

  const handlExecuteQuery = () => queryBuilderStore.executeQuery();

  const handlClearError = () => queryBuilderStore.setRunError(null);

  let objectKeys = [];
  let subResult = {};
  if(queryBuilderStore.result){
    subResult = get(queryBuilderStore.result, toJS(queryBuilderStore.tableViewRoot));
    objectKeys = !subResult.length || isString(subResult[0])?[""]:Object.keys(subResult[0]);
  }

  return(
    <div className={classes.container}>
      <ResultOptions/>
      {queryBuilderStore.isRunning?
        <div className={classes.fetchingPanel}>
          <FetchingLoader>
            Fetching query...
          </FetchingLoader>
        </div>
        :
        queryBuilderStore.runError?
          <BGMessage icon={"ban"}>
              There was a network problem fetching the query.<br/>
              If the problem persists, please contact the support.<br/>
            <small>{queryBuilderStore.runError}</small><br/><br/>
            {queryBuilderStore.isQueryEmpty?
              <Button variant="primary" onClick={handlClearError}>
                <FontAwesomeIcon icon={"redo-alt"}/>&nbsp;&nbsp; OK
              </Button>
              :
              <Button variant="primary" onClick={handlExecuteQuery}>
                <FontAwesomeIcon icon={"redo-alt"}/>&nbsp;&nbsp; Retry
              </Button>
            }
          </BGMessage>
          :
          queryBuilderStore.result && (
            <React.Fragment>
              <Breadcrumb className={classes.breadcrumb} breadcrumb={queryBuilderStore.tableViewRoot} total={queryBuilderStore.result.total} onClick={handleBreadcrumbClick}/>
              <Table className={classes.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    {objectKeys.map( key =>
                      <th key={key}>{key}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {subResult.map((row, index) =>
                    <tr key={"row"+index}>
                      <th>{index}</th>
                      {isString(row)?
                        <td>{row}</td>
                        :
                        objectKeys.map(name => (
                          <td key={name+index}>
                            <ResultValue name={name} index={index} value={row[name]} />
                          </td>
                        ))
                      }
                    </tr>
                  )}
                </tbody>
              </Table>
            </React.Fragment>
          )
      }
    </div>
  );

});

export default ResultTable;