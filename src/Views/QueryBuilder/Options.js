import React from "react";
import queryBuilderStore from "../../Stores/QueryBuilderStore";
import { observer } from "mobx-react";
import MultiToggle from "../../Components/MultiToggle";
import injectStyles from "react-jss";
import {sortBy} from "lodash";
import {FormControl, Button} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactJson from "react-json-view";
import ThemeRJV from "./ThemeRJV";

const style = {
  container:{
    color:"var(--ft-color-normal)",
    "& input":{
      color:"black"
    },
    "& hr":{
      margin:"30px auto",
      maxWidth:"500px",
      borderTopColor:"var(--bg-color-ui-contrast4)"
    }
  },

  fields:{
    color:"var(--ft-color-loud)",
    "& h3":{
      fontSize:"1.7em",
      marginBottom:"10px",
      marginLeft:"10px",
      "& small":{
        color:"var(--ft-color-quiet)",
        fontStyle:"italic"
      }
    }
  },

  property:{
    color:"var(--ft-color-loud)",
    fontWeight:"normal",
    cursor: "pointer",
    padding: "10px",
    margin:"1px",
    background:"var(--bg-color-ui-contrast1)",
    "& small":{
      color:"var(--ft-color-quiet)",
      fontStyle:"italic"
    },
    "&:hover":{
      background:"var(--bg-color-ui-contrast4)",
    }
  },

  fieldOptions:{
    background:"var(--bg-color-ui-contrast3)",
    margin:"-10px -10px 30px -10px",
    padding:"10px",
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

  option:{
    marginBottom:"20px",
    "&:last-child":{
      marginBottom:0
    },
    "&.unsupported": {
      display: "flex",
      "& button": {
        alignSelf: "flex-start",
        display: "inline-block",
        margin: "0 5px 0 0",
        background: "var(--bg-color-ui-contrast1)",
        color: "var(--ft-color-loud)",
        borderColor: "var(--bg-color-ui-contrast1)",
        "&:hover": {
          background: "var(--bg-color-ui-contrast1)",
          color: "var(--ft-color-louder)",
          borderColor: "var(--bg-color-ui-contrast1)"
        }
      },
      "& $optionLabel": {
        alignSelf: "flex-start",
        display: "inline"
      },
      "& strong": {
        flex: 1,
        display: "inline-block",
        fontWeight: "normal",
        color: "var(--ft-color-loud)",
        "& .react-json-view": {
          backgroundColor: "transparent !important"
        }
      }
    }
  },
  optionLabel:{
    fontWeight:"bold",
    marginBottom:"5px",
    "& small":{
      fontWeight:"normal",
      fontStyle:"italic"
    }
  },
  stringValue: {
    color: "rgb(253, 151, 31)"
  },
  boolValue: {
    color: "rgb(174, 129, 255)"
  },
  intValue: {
    color: "rgb(204, 102, 51)"
  },
  floatValue: {
    color: "rgb(84, 159, 61)"
  },
  dateValue: {
    color: "rgb(45, 89, 168)"
  },
  typeValue: {
    fontSize: "11px",
    marginRight: "4px",
    opacity: "0.8"
  }
};

@injectStyles(style)
@observer
export default class Options extends React.Component{
  handleAddField(schema, e){
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addField(schema, queryBuilderStore.currentField, !e.ctrlKey && !e.metaKey);
  }

  handleChangeFlatten = value => {
    queryBuilderStore.currentField.isFlattened = !!value;
  }

  handleChangeName = e => {
    queryBuilderStore.currentField.alias = e.target.value;
  }

  handleChangeOption = (name, value) => {
    queryBuilderStore.currentField.setOption(name, value);
  }

  render(){
    const {classes} = this.props;

    return(
      <div className={classes.container}>
        <div className={classes.fieldOptions}>
          { queryBuilderStore.currentField !== queryBuilderStore.rootField &&
              !queryBuilderStore.currentField.parent.isFlattened &&
              <div className={classes.option}>
                <div className={classes.optionLabel}>
                  Target name <small>(only applicable if parent field is not flattened)</small>
                </div>
                <div className={classes.optionInput}>
                  <FormControl type="text"
                    onChange={this.handleChangeName}
                    value={queryBuilderStore.currentField.alias || ""}
                    placeholder={queryBuilderStore.currentField.getDefaultAlias()}/>
                </div>
              </div>
          }

          {queryBuilderStore.currentField.options.map(({name, value}) => {
            if (name === "required") {
              if (queryBuilderStore.currentField !== queryBuilderStore.rootField
                   && !queryBuilderStore.currentField.parent.isFlattened) {
                return (
                  <div key={name} className={classes.option}>
                    <div className={classes.optionLabel}>
                        Required <small>(only applicable if parent field is not flattened)</small>
                    </div>
                    <div className={classes.optionInput}>
                      <MultiToggle selectedValue={value} onChange={this.handleChangeOption.bind(this, name)}>
                        <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true}/>
                        <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined}/>
                      </MultiToggle>
                    </div>
                  </div>
                );
              }
              return null;
            } else if (name === "sort") {
              if (queryBuilderStore.currentField !== queryBuilderStore.rootField
                  && !queryBuilderStore.currentField.parent.isFlattened) {
                return (
                  <div key={name} className={classes.option}>
                    <div className={classes.optionLabel}>
                        Sort <small>(enabling sort on this field will disable sort on other fields)</small>
                    </div>
                    <div className={classes.optionInput}>
                      <MultiToggle selectedValue={value} onChange={this.handleChangeOption.bind(this, name)}>
                        <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true}/>
                        <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined}/>
                      </MultiToggle>
                    </div>
                  </div>
                );
              }
              return null;
            } else if (name === "ensure_order") {
              if (queryBuilderStore.currentField !== queryBuilderStore.rootField
                  && queryBuilderStore.currentField.schema && queryBuilderStore.currentField.schema.canBe
                  && !queryBuilderStore.currentField.parent.isFlattened) {
                return (
                  <div key={name} className={classes.option}>
                    <div className={classes.optionLabel}>
                        Ensure original order <small>(only applicable if parent field is not flattened)</small>
                    </div>
                    <div className={classes.optionInput}>
                      <MultiToggle selectedValue={value} onChange={this.handleChangeOption.bind(this, name)}>
                        <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true}/>
                        <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined}/>
                      </MultiToggle>
                    </div>
                  </div>
                );
              }
              return null;
            } else if (value !== undefined) {
              return (
                <div key={name} className={`${classes.option} unsupported`}>
                  <Button bsSize="xsmall" bsStyle="default" onClick={this.handleChangeOption.bind(this, name, undefined)} title={name === "merge"?`"${name}" property cannot be deleted`:`delete property "${name}"`} disabled={name === "merge"} >
                    <FontAwesomeIcon icon="times"/>
                  </Button>
                  <div className={classes.optionLabel}>{name}:&nbsp;</div>
                  <strong>
                    {typeof value === "string"?
                      <div className={classes.stringValue}><span className={classes.typeValue}>string</span>&quot;{value}&quot;</div>
                      :
                      typeof value === "boolean"?
                        <div className={classes.boolValue}><span className={classes.typeValue}>bool</span>{value?"true":"false"}</div>
                        :
                        typeof value === "number"?
                          Number.isInteger(value)?
                            <div className={classes.intValue}><span className={classes.typeValue}>int</span>{value}</div>
                            :
                            <div className={classes.floatValue}><span className={classes.typeValue}>float</span>{value}</div>
                          :
                          <ReactJson collapsed={true} name={false} theme={ThemeRJV} src={value} enableClipboard={false}/>
                    }
                  </strong>
                </div>
              );
            } else {
              return null;
            }
          })}

          {queryBuilderStore.currentField !== queryBuilderStore.rootField
              && queryBuilderStore.currentField.schema && queryBuilderStore.currentField.schema.canBe
              && queryBuilderStore.currentField.fields.length === 1
              && <div className={classes.option}>
                <div className={classes.optionLabel}>
                  Flatten <small>(only applicable if this field has only one child field)</small>
                </div>
                <div className={classes.optionInput}>
                  <MultiToggle selectedValue={queryBuilderStore.currentField.isFlattened} onChange={this.handleChangeFlatten}>
                    <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true}/>
                    <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={false}/>
                  </MultiToggle>
                </div>
              </div>
          }
        </div>

        {queryBuilderStore.currentField.schema && queryBuilderStore.currentField.schema.canBe &&
         !queryBuilderStore.currentField.isFlattened &&
          <div className={classes.fields}>
            {queryBuilderStore.currentField.schema.canBe && queryBuilderStore.currentField.schema.canBe.map((schemaId)=>{
              return(
                <div key={schemaId}>
                  <h3>Attributes valid for {queryBuilderStore.findSchemaById(schemaId).label} <small> - {queryBuilderStore.findSchemaById(schemaId).id}</small></h3>
                  {sortBy(queryBuilderStore.findSchemaById(schemaId).properties.filter(prop => !prop.canBe || !prop.canBe.length), ["label"]).map(propSchema => {
                    return (
                      <div className={classes.property} key={propSchema.attribute+(propSchema.reverse?"reverse":"")} onClick={this.handleAddField.bind(this, propSchema)}>
                        {propSchema.label} - <small>{propSchema.attribute}</small>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {queryBuilderStore.currentField.schema && queryBuilderStore.currentField.schema.canBe &&
            !queryBuilderStore.currentField.isFlattened &&
            queryBuilderStore.currentField.schema.canBe.map((schemaId)=>{
              return(
                <div key={schemaId}>
                  <h3>Links valid for {queryBuilderStore.findSchemaById(schemaId).label} <small> - {queryBuilderStore.findSchemaById(schemaId).id}</small></h3>
                  {sortBy(queryBuilderStore.findSchemaById(schemaId).properties.filter(prop => prop.canBe && prop.canBe.length), ["label"]).map(propSchema => {
                    return (
                      <div className={classes.property} key={propSchema.attribute+(propSchema.reverse?"reverse":"")} onClick={this.handleAddField.bind(this, propSchema)}>
                        {propSchema.label} - <small>{propSchema.attribute}</small>
                        &nbsp;&nbsp;( can be: {propSchema.canBe.map(schemaId => queryBuilderStore.findSchemaById(schemaId).label).join(", ")} )
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        }
      </div>
    );
  }
}