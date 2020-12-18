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
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { createUseStyles } from "react-jss";

import { useStores } from "../../../Hooks/UseStores";

const useStyles = createUseStyles({
  container:{
    color:"var(--ft-color-loud)",
    background:"var(--bg-color-ui-contrast3)",
    margin:"-10px -10px 30px -10px",
    padding:"10px 10px 20px 10px",
    position:"relative",
    "&::after":{
      display:"block",
      content:"''",
      position:"absolute",
      bottom:"-10px",
      left:"50%",
      marginLeft:"-10px",
      width:"20px",
      height:"20px",
      background:"var(--bg-color-ui-contrast3)",
      transform:"rotate(45deg)"
    },
    "& select$input:hover": {
      backgroundColor: "var(--bg-color-ui-contrast2)"
    }
  },
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
  }
});

const scopeOptions =  [{label: "Released", value: "RELEASED" }, {label: "Curated", value: "IN_PROGRESS"}];

const ResultOptions = observer(() => {

  const classes = useStyles();

  const { queryBuilderStore } = useStores();

  const handleToggleRunStripVocab = () => queryBuilderStore.toggleRunStripVocab();

  const handleChangeSize = e => queryBuilderStore.setResultSize(e.target.value);

  const handleChangeStart = e => queryBuilderStore.setResultStart(e.target.value);

  const handleChangeStage = e => queryBuilderStore.setStage(e.target.value);

  const handlExecuteQuery = () => queryBuilderStore.executeQuery();


  return(
    <div className={classes.container}>
      <form>
        <Row>
          <Col xs={3}>
            <Form.Group>
              <Form.Label>Size</Form.Label>
              <Form.Control
                className={classes.input}
                type="number"
                value={queryBuilderStore.resultSize}
                placeholder="20"
                onChange={handleChangeSize}
              />
            </Form.Group>
          </Col>
          <Col xs={3}>
            <Form.Group>
              <Form.Label>Start</Form.Label>
              <Form.Control
                className={classes.input}
                type="number"
                value={queryBuilderStore.resultStart}
                placeholder="0"
                onChange={handleChangeStart}
              />
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Select the scope</Form.Label>
              <Form.Control className={classes.input} as="select" value={queryBuilderStore.stage} onChange={handleChangeStage} >
                {scopeOptions.map(space => (
                  <option value={space.value} key={space.value}>{space.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={9}>
            <Form.Check onChange={handleToggleRunStripVocab} checked={queryBuilderStore.runStripVocab}>Strip vocab</Form.Check>
          </Col>
          <Col xs={3}>
            <Button variant="primary" className={"btn-block"} disabled={queryBuilderStore.isQueryEmpty} onClick={handlExecuteQuery} title={!queryBuilderStore.isQueryEmpty?"Run it":"The current query specification is not valid/complete. Please select at least one field."}>
              Run it
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
});
ResultOptions.displayName = "ResultOptions";

export default ResultOptions;