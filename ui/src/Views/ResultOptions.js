import React from "react";
import queryBuilderStore from "../Stores/QueryBuilderStore";
import { observer } from "mobx-react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { createUseStyles } from "react-jss";

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
    }
  },
  input: {
    color: "var(--ft-color-loud)",
    width: "calc(100% - 20px)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)"
  }
});

const scopeOptions =  [{label: "Released", value: "RELEASED" }, {label: "Curated", value: "IN_PROGRESS"}];

const ResultOptions = observer(() => {
  const classes = useStyles();

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
              <Form.Label>Select space</Form.Label>
              <Form.Control className={classes.input} componentClass="select" placeholder="minds" value={queryBuilderStore.stage} onChange={handleChangeStage} >
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

export default ResultOptions;