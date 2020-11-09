import React from "react";
import { observer } from "mobx-react";
import MultiToggle from "../Components/MultiToggle";
import { createUseStyles } from "react-jss";
import { FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactJson from "react-json-view";

import queryBuilderStore from "../Stores/QueryBuilderStore";
import typesStore from "../Stores/TypesStore";

import ThemeRJV from "./ThemeRJV";
import Icon from "../Components/Icon";

import Name from "./Options/Name";

const useStyles = createUseStyles({
  container: {
    color: "var(--ft-color-normal)",
    "& input": {
      color: "black"
    },
    "& hr": {
      margin: "30px auto",
      maxWidth: "500px",
      borderTopColor: "var(--bg-color-ui-contrast4)"
    }
  },

  fields: {
    color: "var(--ft-color-loud)",
    "& h3": {
      fontSize: "1.7em",
      marginBottom: "10px",
      marginLeft: "10px",
      "& small": {
        color: "var(--ft-color-quiet)",
        fontStyle: "italic"
      }
    },
    "& .merge": {
      "& h3": {
        "& strong": {
          color: "greenyellow"
        }
      }
    }
  },

  property: {
    color: "var(--ft-color-loud)",
    fontWeight: "normal",
    cursor: "pointer",
    padding: "10px",
    margin: "1px",
    background: "var(--bg-color-ui-contrast1)",
    "& small": {
      color: "var(--ft-color-quiet)",
      fontStyle: "italic"
    },
    "&:hover": {
      background: "var(--bg-color-ui-contrast4)",
    }
  },

  fieldOptions: {
    background: "var(--bg-color-ui-contrast3)",
    margin: "-10px -10px 30px -10px",
    padding: "10px",
    position: "relative",
    "&::after": {
      display: "block",
      content: "''",
      position: "absolute",
      bottom: "-10px",
      left: "50%",
      marginLeft: "-10px",
      width: "20px",
      height: "20px",
      background: "var(--bg-color-ui-contrast3)",
      transform: "rotate(45deg)"
    }
  },

  option: {
    marginBottom: "20px",
    "&:last-child": {
      marginBottom: 0
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
  optionLabel: {
    fontWeight: "bold",
    marginBottom: "5px",
    "& small": {
      fontWeight: "normal",
      fontStyle: "italic"
    },
    "& strong": {
      color: "var(--ft-color-loud)"
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
});

const Options = observer(() => {

  const classes = useStyles();

  const handleAddField = (schema, e) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addField(schema, queryBuilderStore.currentField, !e.ctrlKey && !e.metaKey);
  };

  const handleAddMergeField = e => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addMergeField(queryBuilderStore.currentField, !e.ctrlKey && !e.metaKey);
  };

  const handleAddMergeChildField = (e, schema) => {
    //Don't got to newly chosen field options if ctrl is pressed (or cmd)
    queryBuilderStore.addMergeChildField(schema, queryBuilderStore.currentField, !e.ctrlKey && !e.metaKey);
  };

  const handleChangeFlatten = value => {
    queryBuilderStore.currentField.isFlattened = !!value;
  };

  const handleChangeOption = (name, value) => {
    queryBuilderStore.currentField.setOption(name, value);
  };

  return (
    <div className={classes.container}>
      <div className={classes.fieldOptions}>
        <Name field={queryBuilderStore.currentField} rootField={queryBuilderStore.rootField} />

        {queryBuilderStore.currentField.options.map(({ name, value }) => {
          if (name === "required") {
            return queryBuilderStore.currentField !== queryBuilderStore.rootField
              && !queryBuilderStore.currentField.parent.isFlattened
              && (!queryBuilderStore.currentField.isMerge || queryBuilderStore.currentField.isRootMerge)
              && (
                <div key={name} className={classes.option}>
                  <div className={classes.optionLabel}>
                    Required <small>(only applicable if parent field is not flattened)</small>
                  </div>
                  <div>
                    <MultiToggle selectedValue={value} onChange={() => handleChangeOption(name)}>
                      <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true} />
                      <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined} />
                    </MultiToggle>
                  </div>
                </div>
              );
          } else if (name === "sort") {
            return queryBuilderStore.currentField !== queryBuilderStore.rootField
              && !(queryBuilderStore.currentFieldLookupsLinks && !!queryBuilderStore.currentFieldLookupsLinks.length)
              && !queryBuilderStore.currentField.isMerge
              && (
                <div key={name} className={classes.option}>
                  <div className={classes.optionLabel}>
                    Sort <small>(enabling sort on this field will disable sort on other fields)</small>
                  </div>
                  <div>
                    <MultiToggle selectedValue={value} onChange={() => handleChangeOption(name)}>
                      <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true} />
                      <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined} />
                    </MultiToggle>
                  </div>
                </div>
              );
          } else if (name === "ensure_order") {
            return queryBuilderStore.currentField !== queryBuilderStore.rootField
              && (queryBuilderStore.currentFieldLookupsLinks && !!queryBuilderStore.currentFieldLookupsLinks.length)
              && !queryBuilderStore.currentField.parent.isFlattened
              && (!queryBuilderStore.currentField.isMerge || queryBuilderStore.currentField.isRootMerge)
              && (
                <div key={name} className={classes.option}>
                  <div className={classes.optionLabel}>
                    Ensure original order <small>(only applicable if parent field is not flattened)</small>
                  </div>
                  <div>
                    <MultiToggle selectedValue={value} onChange={() => handleChangeOption(name)}>
                      <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true} />
                      <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined} />
                    </MultiToggle>
                  </div>
                </div>
              );
          } else if (value !== undefined && (!queryBuilderStore.currentField.isMerge || queryBuilderStore.currentField.isRootMerge)) {
            return (
              <div key={name} className={`${classes.option} unsupported`}>
                <Button bsSize="xsmall" bsStyle="default" onClick={() => handleChangeOption(name, undefined)} title={name === "merge" ? `"${name}" property cannot be deleted` : `delete property "${name}"`} disabled={name === "merge"} >
                  <FontAwesomeIcon icon="times" />
                </Button>
                <div className={classes.optionLabel}>{name}:&nbsp;</div>
                <strong>
                  {typeof value === "string" ?
                    <div className={classes.stringValue}><span className={classes.typeValue}>string</span>&quot;{value}&quot;</div>
                    :
                    typeof value === "boolean" ?
                      <div className={classes.boolValue}><span className={classes.typeValue}>bool</span>{value ? "true" : "false"}</div>
                      :
                      typeof value === "number" ?
                        Number.isInteger(value) ?
                          <div className={classes.intValue}><span className={classes.typeValue}>int</span>{value}</div>
                          :
                          <div className={classes.floatValue}><span className={classes.typeValue}>float</span>{value}</div>
                        :
                        <ReactJson collapsed={true} name={false} theme={ThemeRJV} src={value} enableClipboard={false} />
                  }
                </strong>
              </div>
            );
          } else {
            return null;
          }
        })}

        {queryBuilderStore.currentField !== queryBuilderStore.rootField
          && (queryBuilderStore.currentFieldLookupsLinks && !!queryBuilderStore.currentFieldLookupsLinks.length)
          && queryBuilderStore.currentField.structure.length === 1
          && !queryBuilderStore.currentField.isMerge
          && (
            <div className={classes.option}>
              <div className={classes.optionLabel}>
                Flatten <small>(only applicable if this field has only one child field)</small>
              </div>
              <div>
                <MultiToggle selectedValue={queryBuilderStore.currentField.isFlattened} onChange={handleChangeFlatten}>
                  <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true} />
                  <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={false} />
                </MultiToggle>
              </div>
            </div>
          )}
      </div>

      {!queryBuilderStore.currentField.isMerge
        && queryBuilderStore.currentField !== queryBuilderStore.rootFields
        && (queryBuilderStore.currentFieldLookupsLinks && !!queryBuilderStore.currentFieldLookupsLinks.length)
        && (
          <div className={classes.option}>
            <div className={classes.optionLabel}>
              <Button onClick={handleAddMergeField}>Add a merge field</Button>
            </div>
          </div>
        )}

      {queryBuilderStore.currentField.isRootMerge
        && queryBuilderStore.currentField !== queryBuilderStore.rootField
        && (
          <div className={classes.fields}>
            {queryBuilderStore.currentFieldParentLookupsAttributes.map(({ id, label, color, properties }) => (
              <div className="merge" key={id}>
                <h3><strong>Merge</strong> attributes valid for <Icon icon="circle" color={color}/> {label} <small> - {id}</small></h3>
                {properties.map(propSchema => (
                  <div className={classes.property} key={propSchema.attribute + (propSchema.reverse ? "reverse" : "")} onClick={e => handleAddMergeChildField(e, propSchema)}>
                    {propSchema.label} - <small>{propSchema.attribute}</small>
                  </div>
                ))}
              </div>
            ))}

            {queryBuilderStore.currentFieldParentLookupsLinks.map(({ id, label, color, properties }) => (
              <div className="merge" key={id}>
                <h3><strong>Merge</strong> links valid for <Icon icon="circle" color={color}/> {label} <small> - {id}</small></h3>
                {properties.map(propSchema => (
                  <div className={classes.property} key={propSchema.attribute + (propSchema.reverse ? "reverse" : "")} onClick={e => handleAddMergeChildField(e, propSchema)}>
                    {propSchema.label} - <small>{propSchema.attribute}</small>
                    &nbsp;&nbsp;( can be: {propSchema.canBe.map(t => {
                      const type = typesStore.types[t];
                      const label = type?type.label:t;
                      const color = type?type.color:null;
                      return (
                        <React.Fragment key={label} >
                          <Icon icon="circle" color={color} />{label}
                        </React.Fragment>
                      );
                    })} )
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      }

      {(!queryBuilderStore.currentField.isFlattened
        || (queryBuilderStore.currentField.isMerge
          && (queryBuilderStore.currentField.isRootMerge
            || (!queryBuilderStore.currentField.isRootMerge && (!queryBuilderStore.currentField.structure || !queryBuilderStore.currentField.structure.length))
          )
        )
      ) && (
        <div className={classes.fields}>
          {queryBuilderStore.currentFieldLookupsAttributes.map(({ id, label, color, properties }) => (
            <div key={id}>
              <h3>Attributes valid for <Icon icon="circle" color={color}/> {label} <small> - {id}</small></h3>
              {properties.map(propSchema => (
                <div className={classes.property} key={propSchema.attribute + (propSchema.reverse ? "reverse" : "")} onClick={e => handleAddField(e, propSchema)}>
                  {propSchema.label} - <small>{propSchema.attribute}</small>
                </div>
              ))}
            </div>
          ))}
          {queryBuilderStore.currentFieldLookupsAdvancedAttributes.map(({ id, label, color, properties }) => (
            <div key={id}>
              <h3>Advanced attributes valid for <Icon icon="circle" color={color}/> {label} <small> - {id}</small></h3>
              {properties.map(propSchema => (
                <div className={classes.property} key={propSchema.attribute + (propSchema.reverse ? "reverse" : "")} onClick={e => handleAddField(e, propSchema)}>
                  {propSchema.label} - <small>{propSchema.attribute}</small>
                </div>
              ))}
            </div>
          ))}
          {queryBuilderStore.currentFieldLookupsLinks.map(({ id, label, color, properties }) => (
            <div key={id}>
              <h3>Links valid for <Icon icon="circle" color={color}/> {label} <small> - {id}</small></h3>
              {properties.map(propSchema => (
                <div className={classes.property} key={propSchema.attribute + (propSchema.reverse ? "reverse" : "")} onClick={e => handleAddField(e, propSchema)}>
                  {propSchema.label} - <small>{propSchema.attribute}</small>
                  &nbsp;&nbsp;( can be: {propSchema.canBe.map(t => {
                    const type = typesStore.types[t];
                    const label = type?type.label:t;
                    const color = type?type.color:null;
                    return (
                      <React.Fragment key={label} >
                        <Icon icon="circle" color={color} />{label}
                      </React.Fragment>
                    );
                  })} )
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default Options;