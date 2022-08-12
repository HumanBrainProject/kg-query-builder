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
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import API from "../../../Services/API";
import { useStores } from "../../../Hooks/UseStores";

import SpaceRestriction from "./SpaceRestriction";

const useStyles = createUseStyles({
  input: {
    color: "var(--ft-color-loud)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  },
  selectBox: {
    position: "relative",
    "& select": {
      display: "inline-block",
      paddingRight: "20px",
      color: "white",
      "-webkit-appearance": "none"
    },
    "&:after": {
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
  },
  required: {
    color: "var(--bg-color-error-normal)",
    paddingLeft: "3px",
    fontWeight: "bold"
  },
  firstRow: {
    marginBottom: "1rem"
  },
  runIt: {
    textAlign: "right"
  }
});

const QueryParameter = observer(({ parameter }) => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleChangeParameter = (e) =>
    queryBuilderStore.setResultQueryParameter(parameter.name, e.target.value);

  return (
    <Form.Group>
      <Form.Label>{parameter.name}</Form.Label>
      <Form.Control
        className={classes.input}
        type="text"
        value={parameter.value}
        placeholder=""
        onChange={handleChangeParameter}
      />
    </Form.Group>
  );
});
QueryParameter.displayName = "QueryParameter";

const QueryParameters = observer(() => {
  const { queryBuilderStore } = useStores();

  const parameters = queryBuilderStore.getQueryParameters();

  if (!parameters.length) {
    return null;
  }

  const rows = parameters.reduce((acc, p) => {
    if (acc.length && !acc[acc.length - 1].col3) {
      if (!acc[acc.length - 1].col2) {
        acc[acc.length - 1]["col2"] = p;
      } else {
        acc[acc.length - 1]["col3"] = p;
      }
    } else {
      acc.push({ col1: p });
    }
    return acc;
  }, []);

  return (
    <>
      {rows.map((row) => (
        <Row key={row.col1.name}>
          <Col xs={4}>
            <QueryParameter parameter={row.col1} />
          </Col>
          {row.col2 && (
            <Col xs={4}>
              <QueryParameter parameter={row.col2} />
            </Col>
          )}
          {row.col3 && (
            <Col xs={4}>
              <QueryParameter parameter={row.col3} />
            </Col>
          )}
        </Row>
      ))}
    </>
  );
});

const ExecutionParams = observer(() => {
  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const scopeOptions = [
    { label: "Released", value: "RELEASED" },
    { label: "In progress", value: "IN_PROGRESS" },
  ];

  const isSpaceRestricted = Array.isArray(
    queryBuilderStore.resultRestrictToSpaces
  );

  const handleChangeSize = (e) =>
    queryBuilderStore.setResultSize(e.target.value);

  const handleChangeStart = (e) =>
    queryBuilderStore.setResultStart(e.target.value);

  const handleChangeStage = (e) => queryBuilderStore.setStage(e.target.value);

  const handleChangeInstanceId = (e) =>
    queryBuilderStore.setResultInstanceId(e.target.value);

  const handlExecuteQuery = () => {
    API.trackEvent("Query", "Execute", queryBuilderStore.rootField.id);
    queryBuilderStore.executeQuery();
  };

  const title = !queryBuilderStore.isQueryEmpty
    ? "Run it"
    : "The current query specification is not valid/complete. Please select at least one field.";

  return (
    <Form>
      <Container fluid>
        <Row className={classes.firstRow}>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>
                scope<span className={classes.required}>*</span>
              </Form.Label>
              <div className={classes.selectBox}>
                <Form.Control
                  className={classes.input}
                  as="select"
                  value={queryBuilderStore.stage}
                  onChange={handleChangeStage}
                >
                  {scopeOptions.map((space) => (
                    <option value={space.value} key={space.value}>
                      {space.label}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Form.Group>
              <Form.Label>
                size<span className={classes.required}>*</span>
              </Form.Label>
              <Form.Control
                className={classes.input}
                type="number"
                value={queryBuilderStore.resultSize}
                placeholder="20"
                onChange={handleChangeSize}
              />
            </Form.Group>
          </Col>
          <Col xs={2}>
            <Form.Group>
              <Form.Label>
                start<span className={classes.required}>*</span>
              </Form.Label>
              <Form.Control
                className={classes.input}
                type="number"
                value={queryBuilderStore.resultStart}
                placeholder="0"
                onChange={handleChangeStart}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group>
              <Form.Label>instanceId</Form.Label>
              <Form.Control
                className={classes.input}
                type="text"
                value={queryBuilderStore.resultInstanceId}
                placeholder=""
                onChange={handleChangeInstanceId}
              />
            </Form.Group>
          </Col>
        </Row>
        <QueryParameters />
        {isSpaceRestricted ? (
          <>
            <Row>
              <Col xs={12}>
                <SpaceRestriction />
              </Col>
            </Row>
            <Row>
              <Col xs={9} />
              <Col xs={3} className={classes.runIt}>
                <Button
                  variant="primary"
                  className={"btn-block"}
                  disabled={queryBuilderStore.isQueryEmpty}
                  onClick={handlExecuteQuery}
                  title={title}
                >
                  Run it
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col xs={3}>
              <SpaceRestriction />
            </Col>
            <Col xs={6} />
            <Col xs={3} className={classes.runIt}>
              <Button
                variant="primary"
                className={"btn-block"}
                disabled={queryBuilderStore.isQueryEmpty}
                onClick={handlExecuteQuery}
                title={title}
              >
                Run it
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </Form>
  );
});
ExecutionParams.displayName = "ExecutionParams";

export default ExecutionParams;
