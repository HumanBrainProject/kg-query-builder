import React from "react";
import queryBuilderStore from "../Stores/QueryBuilderStore";
import { observer } from "mobx-react";
import { Button, Row, Col, FormGroup, FormControl, ControlLabel, Checkbox } from "react-bootstrap";
import injectStyles from "react-jss";

const styles = {
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
  }
};

const scopeOptions =  [{label: "Released", value: "RELEASED" }, {label: "Curated", value: "INFERRED"}];

@injectStyles(styles)
@observer
class ResultOptions extends React.Component{
  handleToggleRunStripVocab = () => {
    queryBuilderStore.toggleRunStripVocab();
  }

  handleChangeSize = (event, field) => {
    queryBuilderStore.setResultSize(field.getValue());
  }

  handleChangeStart = (event, field) => {
    queryBuilderStore.setResultStart(field.getValue());
  }

  handlExecuteQuery = () => {
    queryBuilderStore.executeQuery();
  }

  handleChangeScope = (event, field) => {
    queryBuilderStore.setDatabaseScope(field.getValue());
  }

  render(){
    const { classes } = this.props;
    return(
      <div className={classes.container}>
        <form>
          <Row>
            <Col xs={3}>
              <FormGroup>
                <ControlLabel>Size</ControlLabel>
                <FormControl
                  type="number"
                  value={queryBuilderStore.resultSize}
                  placeholder="20"
                  onChange={this.handleChangeSize}
                />
              </FormGroup>
            </Col>
            <Col xs={3}>
              <FormGroup>
                <ControlLabel>Start</ControlLabel>
                <FormControl
                  type="number"
                  value={queryBuilderStore.resultStart}
                  placeholder="0"
                  onChange={this.handleChangeStart}
                />
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup>
                <ControlLabel>Select space</ControlLabel>
                <FormControl componentClass="select" placeholder="minds" value={queryBuilderStore.databaseScope} onChange={this.handleChangeScope} >
                  {scopeOptions.map(space => (
                    <option value={space.value} key={space}>{space.label}</option>
                  ))}
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={9}>
              <Checkbox  onChange={this.handleToggleRunStripVocab} checked={queryBuilderStore.runStripVocab}>Strip vocab</Checkbox>
            </Col>
            <Col xs={3}>
              <Button bsStyle={"primary"} className={"btn-block"} disabled={queryBuilderStore.isQueryEmpty} onClick={this.handlExecuteQuery} title={!queryBuilderStore.isQueryEmpty?"Run it":"The current query specification is not valid/complete. Please select at least one field."}>
              Run it
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default ResultOptions;