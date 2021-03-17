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

import MultiToggle from "../../../../Components/MultiToggle";

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
  }
});


const Toggle = ({ option, label, comment, show, onChange }) => {

  const classes = useStyles();

  const { name, value } = option;

  const handleChange = newValue => onChange(name, newValue);

  if (!show) {
    return null;
  }

  return (
    <div className={classes.option}>
      <div className={classes.optionLabel}>
        {label}{comment && (
          <small>({comment})</small>
        )}
      </div>
      <div>
        <MultiToggle selectedValue={value} onChange={handleChange}>
          <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"check"} value={true} />
          <MultiToggle.Toggle color={"var(--ft-color-loud)"} icon={"times"} value={undefined} />
        </MultiToggle>
      </div>
    </div>
  );
};

export default Toggle;