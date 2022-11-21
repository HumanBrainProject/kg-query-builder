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

import React, { MouseEvent } from "react";
import Icon from "../../../../../Components/Icon";
import { createUseStyles } from "react-jss";
import { observer } from "mobx-react-lite";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";

import { PropertyGroup, Property } from "../../../../../Stores/TypeStore";
import PropertyComponent from "./Property";

const useStyles = createUseStyles({
  container: {
    color: "var(--ft-color-loud)",
    "& h5": {
      margin: "18px 0 6px 5px",
      "& small": {
        color: "var(--ft-color-quiet)",
        fontStyle: "italic"
      }
    }
  }
});

interface GroupPropertiesProps {
  group: PropertyGroup;
  prefix: string;
  onClick: (e: MouseEvent<HTMLDivElement>, property: Property) => void;
}

const GroupProperties = observer(({group, prefix, onClick }: GroupPropertiesProps) => {

  const classes = useStyles();

  const { id, label, color, properties } = group;

  if (!Array.isArray(properties) || !properties.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <h5>{prefix} <Icon icon={faCircle} color={color}/> {label} <small> - {id}</small></h5>
      {properties.map(property => (
        <PropertyComponent key={`${property.attribute}${property.reverse?"reverse":""}`} property={property} onClick={onClick} />
      ))}
    </div>
  );
});
GroupProperties.displayName = "GroupProperties";

export default GroupProperties;