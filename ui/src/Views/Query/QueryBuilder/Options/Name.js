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
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = createUseStyles({
  option: {
    marginBottom: "20px",
    "&:last-child": {
      marginBottom: 0
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
  aliasError: {
    marginTop: "6px",
    color: "var(--ft-color-error)"
  },
  targetInput: {
    color: "var(--ft-color-loud) !important",
    width: "calc(100% - 20px)",
    border: "1px solid transparent",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "&:focus":{
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  }
});


const Name = observer(({ field, rootField }) => {

  const classes = useStyles();

  const handleChangeName = e => field.setAlias(e.target.value);

  if (field === rootField
    || field.parent.isFlattened
    || (field.isMerge && !field.isRootMerge)
  ) {
    return null;
  }

  return (
    <div className={classes.option} >
      {field.isRootMerge ?
        <div className={classes.optionLabel}>
          <strong><FontAwesomeIcon transform="shrink-8" icon="asterisk" /></strong>Merge name
        </div>
        :
        <div className={classes.optionLabel}>
            Target name <small>(only applicable if parent field is not flattened)</small>
        </div>
      }
      <div>
        <Form.Control className={classes.targetInput} type="text" required={field.isRootMerge} value={field.alias || ""} placeholder={field.defaultAlias} onChange={handleChangeName} />
        {field.aliasError && (
          <div className={classes.aliasError}>
            <FontAwesomeIcon icon="exclamation-triangle" />&nbsp;Empty value is not accepted
          </div>
        )}
      </div>
    </div>
  );
});
Name.displayName = "Name";

export default Name;