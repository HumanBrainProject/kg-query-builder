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

import PropertyTypes from "../../../PropertyTypes";
import Types from "./Types";
import { QuerySpecification } from "../../../../Stores/QueryBuilderStore/QuerySpecification";
import Field from "../../../../Stores/Field";

interface TypeProps {
  field: Field;
}

const Type = observer(({ field }: TypeProps) => {
  if (field.isUnknown && field.parent) {
    if (field.schema?.simpleAttributeName) {
      const attributeNameSpace = field.schema.attributeNamespace
        ? field.schema.attributeNamespace
        : field.schema.attribute;
      return (
        <>
          {field.schema.simpleAttributeName}&nbsp;
          <span title={field.schema?.attribute}>
            (` ${attributeNameSpace} `)
          </span>
        </>
      );
    }
    return <>{field.schema?.attribute}</>;
  }

  if (field.parent) {
    return (
      <>
        {field.schema?.label}
        <Types field={field} />
      </>
    );
  }

  const rootSchema = field.schema as QuerySpecification.Schema;

  return (
    <>
      <PropertyTypes types={rootSchema?.canBe} />
      &nbsp;- <small>{rootSchema.id}</small>
    </>
  );
});
Type.displayName = "Type";

export default Type;
