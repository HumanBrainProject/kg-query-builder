import React from "react";
import injectStyles from "react-jss";
import {observer} from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

import Fields from "./Fields";
import queryBuilderStore from "../../Stores/QueryBuilderStore";

let styles = {
  container:{
    position:"relative",
    "&::before":{
      display:"block",
      content:"''",
      position:"absolute",
      left:"10px",
      width:"0",
      height:"calc(100% - 20px)",
      borderLeft:"1px dashed #ccc"
    },
    "&::after":{
      display:"block",
      content:"''",
      position:"absolute",
      left:"-9px",
      top:"20px",
      width:"10px",
      height:"0",
      borderTop:"1px dashed #ccc"
    },
    "&.flattenedParent::after":{
      borderTop:"3px solid #40a9f3"
    }
  },
  hasFlattenedParentExtraBox:{
    display:"block",
    content:"''",
    position:"absolute",
    top:"-1px",
    left:"-11px",
    width:"0",
    height:"24px",
    borderLeft:"3px solid #40a9f3"
  },
  label:{
    padding:"10px",
    margin:"1px",
    backgroundColor:"var(--bg-color-ui-contrast1)",
    position:"relative",
    zIndex:2,
    cursor:"pointer",
    "&:hover":{
      backgroundColor:"var(--bg-color-ui-contrast4)",
      "& $optionsButton":{
        opacity:1
      }
    },
    "&.selected":{
      backgroundColor:"var(--bg-color-ui-contrast4)",
      "& $optionsButton":{
        opacity:1
      }
    },
    "&.is-unknown": {
      backgroundColor:"var(--bg-color-warn-quiet)",
      "&&.selected": {
        backgroundColor:"var(--bg-color-warn-normal)"
      },
      "&:hover, &.selected:hover": {
        backgroundColor:"var(--bg-color-warn-loud)"
      }
    },
    "&.is-unknown.is-invalid": {
      backgroundColor:"var(--bg-color-error-quiet)",
      "&&.selected": {
        backgroundColor:"var(--bg-color-error-normal)"
      },
      "&:hover, &.selected:hover": {
        backgroundColor:"var(--bg-color-error-loud)"
      }
    },
    "& svg[data-icon=sitemap]": {
      transform: "scale(2) rotateZ(90deg)",
      color: "var(--ft-color-louder)"
    }
  },
  required:{
    color:"var(--ft-color-louder)"
  },
  rename:{
    color:"var(--ft-color-louder)",
    fontWeight:"bold"
  },
  defaultname:{
    color:"var(--ft-color-normal)",
    fontStyle:"italic"
  },
  subFields:{
    paddingLeft:"20px"
  },
  optionsButton:{
    position:"absolute",
    right:"10px",
    top:"9px",
    opacity:0.25
  }
};

@injectStyles(styles)
@observer
export default class Field extends React.Component{
  handleSelectField = () => {
    queryBuilderStore.selectField(this.props.field);
  }

  handleRemoveField = (e) => {
    e.stopPropagation();
    queryBuilderStore.removeField(this.props.field);
  }

  render(){
    const {classes, field} = this.props;

    const isFlattened = field.isFlattened;
    const hasFlattenedParent = field.parent && field.parent.isFlattened;

    return(
      <div className={`${classes.container}${isFlattened?" flattened":""}${hasFlattenedParent?" flattenedParent":""}`}>
        {hasFlattenedParent &&
          <div className={classes.hasFlattenedParentExtraBox}></div>
        }
        <div className={`${classes.label} ${field.isUnknown?"is-unknown":""} ${field.isInvalid?"is-invalid":""} ${field === queryBuilderStore.currentField?"selected":""}`} onClick={this.handleSelectField}>
          {field.isFlattened && (
            <span className={classes.required}>
              <FontAwesomeIcon transform="flip-h" icon="level-down-alt"/>&nbsp;&nbsp;
            </span>
          )}
          {field.getOption("required") && (
            <span className={classes.required}>
              <FontAwesomeIcon transform="shrink-8" icon="asterisk"/>&nbsp;&nbsp;
            </span>
          )}
          {field.isMerge?
            <FontAwesomeIcon transform="shrink-8" icon="sitemap"/>
            :
            field.isUnknown?
              <React.Fragment>
                {field.schema.simpleAttributeName}&nbsp;
                <span className={classes.canBe} title={field.schema.attribute}>( {field.schema.attributeNamespace?field.schema.attributeNamespace:field.schema.attribute} )</span>
              </React.Fragment>
              :
              <React.Fragment>
                {field.schema.label}&nbsp;
                {field.schema.canBe && field.schema.canBe.length &&
              <span className={classes.canBe}>
                ( {field.schema.canBe.map(schemaId => queryBuilderStore.findSchemaById(schemaId).label+" ")} )
              </span>}
              </React.Fragment>
          }
          {field.parent && !field.parent.isFlattened && (
            field.alias?
              <span className={classes.rename}>
                &nbsp;&nbsp;<FontAwesomeIcon icon="long-arrow-alt-right"/>&nbsp;&nbsp;
                {field.alias}
              </span>
              :
              <span className={classes.defaultname}>
                &nbsp;&nbsp;<FontAwesomeIcon icon="long-arrow-alt-right"/>&nbsp;&nbsp;
                {field.getDefaultAlias()}
              </span>
          )}
          <div className={classes.optionsButton}>
            <Button bsSize={"xsmall"} bsStyle={"primary"} onClick={this.handleRemoveField}>
              <FontAwesomeIcon icon="times"/>
            </Button>
          </div>
        </div>
        <div className={classes.subFields}>
          <Fields field={field}/>
        </div>
      </div>
    );
  }
}