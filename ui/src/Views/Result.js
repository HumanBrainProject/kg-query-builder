import React from "react";
import ReactJson from "react-json-view";
import { observer } from "mobx-react";
import { createUseStyles } from "react-jss";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ThemeRJV from "./ThemeRJV";
import queryBuilderStore from "../Stores/QueryBuilderStore";
import BGMessage from "../Components/BGMessage";
import FetchingLoader from "../Components/FetchingLoader";
import ResultOptions from "./ResultOptions";

const useStyles = createUseStyles({
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
  }
});

const Result = observer(() => {
  const classes = useStyles();

  const handlExecuteQuery = () => {
    queryBuilderStore.executeQuery();
  };

  const handlClearError = () => {
    queryBuilderStore.runError = null;
  };

  return(
    <div>
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
              <Button bsStyle={"primary"} onClick={handlClearError}>
                <FontAwesomeIcon icon={"redo-alt"}/>&nbsp;&nbsp; OK
              </Button>
              :
              <Button bsStyle={"primary"} onClick={handlExecuteQuery}>
                <FontAwesomeIcon icon={"redo-alt"}/>&nbsp;&nbsp; Retry
              </Button>
            }
          </BGMessage>
          :
          queryBuilderStore.result && (
            <ReactJson collapsed={1} name={false} theme={ThemeRJV} src={queryBuilderStore.result} />
          )
      }
    </div>
  );

});

export default Result;