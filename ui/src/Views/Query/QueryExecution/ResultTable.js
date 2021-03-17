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
import Table from "react-bootstrap/Table";
import get from "lodash/get";
import isString from "lodash/isString";

import { useStores } from "../../../Hooks/UseStores";

import Breadcrumb from "../../../Components/Breadcrumb";
import ResultValue from "./ResultValue";

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
  breadcrumb:{
    overflow:"hidden",
    marginBottom:"20px"
  },
  table: {
    color: "var(--ft-color-loud)"
  }
});

const ResultTable = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleBreadcrumbClick = index => queryBuilderStore.returnToTableViewRoot(index);

  let objectKeys = [];
  let subResult = {};
  if(queryBuilderStore.result){
    subResult = get(queryBuilderStore.result, toJS(queryBuilderStore.tableViewRoot));
    objectKeys = !subResult.length || isString(subResult[0])?[""]:Object.keys(subResult[0]);
  }

  return(
    <div className={classes.container}>
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
    </div>
  );
});
ResultTable.displayName = "ResultTable";

export default ResultTable;