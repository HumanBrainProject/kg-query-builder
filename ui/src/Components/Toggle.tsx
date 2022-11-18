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
import { createUseStyles } from "react-jss";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import MultiToggle from "./MultiToggle";

const useStyles = createUseStyles({
  option: {
    marginBottom: "20px",
    "&:last-child": {
      marginBottom: 0
    }
  },
  toggle: {
    display: "inline-block"
  },
  optionLabel: {
    display: "inline-block",
    fontWeight: "bold",
    marginBottom: "5px",
    marginLeft: "5px",
    "& small": {
      fontWeight: "normal",
      fontStyle: "italic"
    }
  }
});

interface Option {
  name?: string;
  value?: boolean;
}

interface ToggleProps {
  className?: string;
  option: Option;
  label?: string;
  comment?: string;
  show: boolean;
  onChange: (name: string, newValue?: boolean) => void;
}

const Toggle = ({
  className,
  option,
  label,
  comment,
  show,
  onChange
}: ToggleProps) => {
  const classes = useStyles();

  const { name, value } = option;

  const isReadOnly = typeof onChange !== "function";

  const handleChange = (newValue: any) => !isReadOnly && onChange(name, newValue);

  if (!show) {
    return null;
  }

  return (
    <div className={`${classes.option} ${className ? className : ""}`}>
      <div className={classes.toggle}>
        <MultiToggle
          selectedValue={value}
          onChange={handleChange}
        >
          <MultiToggle.Toggle
            color={value ? "#40a9f3" : "var(--ft-color-normal)"}
            icon={faCheck}
            value={true}
          />
          <MultiToggle.Toggle
            color={value ? "var(--ft-color-normal)" : "var(--ft-color-loud)"}
            icon={faTimes}
            value={undefined}
          />
        </MultiToggle>
      </div>
      <div className={classes.optionLabel}>
        {label}
        {comment && <small>({comment})</small>}
      </div>
    </div>
  );
};

export default Toggle;
