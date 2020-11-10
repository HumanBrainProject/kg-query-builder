import React from "react";
import { observer } from "mobx-react";
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
import isInteger from "lodash/isInteger";

import queryBuilderStore from "../Stores/QueryBuilderStore";
import BGMessage from "../Components/BGMessage";
import FetchingLoader from "../Components/FetchingLoader";
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
  breadcrumbItem:{
    float:"left",
    background:"var(--list-bg-hover)",
    height:"36px",
    lineHeight:"36px",
    padding:"0 20px 0 30px",
    position:"relative",
    border:"1px solid var(--border-color-ui-contrast2)",
    "&::before":{
      display:"block",
      content:"''",
      position:"absolute",
      top:"5px",
      left:"-13px",
      height:"24px",
      width:"24px",
      transform:"rotate(45deg)",
      background:"var(--list-bg-hover)",
      borderTop:"1px solid var(--border-color-ui-contrast2)",
      borderRight:"1px solid var(--border-color-ui-contrast2)",
    },
    "&:first-child::before":{
      display:"none",
    },
    "&:first-child":{
      padding:"0 20px 0 20px",
    },
    "&.clickable":{
      cursor:"pointer",
    },
    "&.clickable:hover":{
      background:"var(--list-bg-selected)",
      "& + ::before":{
        background:"var(--list-bg-selected)",
      }
    },
    "&:last-child":{
      background:"var(--list-bg-selected)",
      cursor:"default",
    }
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
              <div className={classes.breadcrumb}>
                {queryBuilderStore.tableViewRoot.map((item, index) =>
                  <div className={`${classes.breadcrumbItem}${!isInteger(item)?" clickable":""}`} key={index} onClick={isString(item)?handleBreadcrumbClick(index):undefined}>
                    {isInteger(item)?"#"+item:item} {index === 0?`(${queryBuilderStore.result.total})`:""}
                  </div>
                )}
              </div>
              <Table>
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