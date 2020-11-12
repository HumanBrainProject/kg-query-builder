import React, { useEffect} from "react";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import queryBuilderStore from "../Stores/QueryBuilderStore";
import typesStore from "../Stores/TypesStore";

import RootSchema from "./QueryBuilder/RootSchema";
import Query from "./QueryBuilder/Query";
import QueryPanels from "./QueryBuilder/QueryPanels";
import QueriesDrawer from "./QueryBuilder/QueriesDrawer";
import BGMessage from "../Components/BGMessage";
import FetchingLoader from "../Components/FetchingLoader";

const rootPath = window.rootPath || "";

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100%",
    color: "var(--ft-color-normal)",
    backgroundImage: `url('${window.location.protocol}//${window.location.host}${rootPath}/assets/graph.png')`,
  },
  fetchingPanel: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 10000,
    background: "var(--bg-color-blend-contrast1)",
    "& .fetchingPanel": {
      width: "auto",
      padding: "30px",
      border: "1px solid var(--border-color-ui-contrast1)",
      borderRadius: "4px",
      color: "var(--ft-color-loud)",
      background: "var(--list-bg-hover)"
    }
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridGap: "10px",
    padding: "10px",
    height: "100%"
  }
});

const QueryBuilder = observer(() => {

  const classes = useStyles();

  useEffect(() => fetchStructure(true), []);

  const fetchStructure = (forceFetch=false) => typesStore.fetch(forceFetch);

  const handleRetryFetchStructure = () => fetchStructure(true);

  if (typesStore.isFetching) {
    return (
      <div className={classes.container}>
        <div className={classes.fetchingPanel}>
          <FetchingLoader>
              Fetching api structure...
          </FetchingLoader>
        </div>
      </div>
    );
  }

  if (typesStore.fetchError) {
    return (
      <div className={classes.container}>
        <BGMessage icon={"ban"}>
          There was a network problem fetching the api structure.<br />
          If the problem persists, please contact the support.<br />
          <small>{typesStore.fetchError}</small><br /><br />
          <Button variant="primary" onClick={handleRetryFetchStructure}>
            <FontAwesomeIcon icon={"redo-alt"} />&nbsp;&nbsp; Retry
          </Button>
        </BGMessage>
      </div>
    );
  }

  if (!typesStore.hasTypes) {
    return (
      <div className={classes.container}>
        <BGMessage icon={"tools"}>
            No types available.<br />
            If the problem persists, please contact the support.<br /><br />
          <Button variant="primary" onClick={handleRetryFetchStructure}>
            <FontAwesomeIcon icon={"redo-alt"} />&nbsp;&nbsp; Retry
          </Button>
        </BGMessage>
      </div>
    );
  }

  if (!queryBuilderStore.hasRootSchema) {
    return (
      <div className={classes.container}>
        <RootSchema />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.layout}>
        <Query />
        <QueryPanels />
        <QueriesDrawer />
      </div>
    </div>
  );

});

export default QueryBuilder;