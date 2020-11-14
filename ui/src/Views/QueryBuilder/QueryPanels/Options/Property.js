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
import { createUseStyles } from "react-jss";
import Icon from "../../../../Components/Icon";
import typesStore from "../../../../Stores/TypesStore";

const Type = ({ type: t }) => {
  const type = typesStore.types[t];
  const label = type?type.label:t;
  const color = type?type.color:null;
  return (
    <React.Fragment key={label} >
      <Icon icon="circle" color={color} />{label}
    </React.Fragment>
  );
};

const Types = ({ types }) => {
  if (!Array.isArray(types)) {
    return null;
  }

  return (
    <span>&nbsp;&nbsp;
      {types.map(type => (
        <Type key={type} type={type} />
      ))}
    </span>
  );
};

const useStyles = createUseStyles({
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
  }
});

const Property = ({ property, onClick }) => {

  const classes = useStyles();

  const { attribute, label, canBe } = property;

  const handleClick = e => onClick(e, property);

  return (
    <div className={classes.property} onClick={handleClick}>
      {label} - <small>{attribute}</small>
      <Types types={canBe} />
    </div>
  );
};

export default Property;