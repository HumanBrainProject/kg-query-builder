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

import React, { useRef, useEffect, ChangeEvent, KeyboardEvent, RefObject } from "react";
import { createUseStyles } from "react-jss";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { IconDefinition } from "@fortawesome/fontawesome-common-types";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    color: "var(--ft-color-loud)",
    backgroundColor: "var(--bg-color-ui-contrast3)",
    borderBottom: 0
  },
  input: {
    color: "var(--ft-color-loud)",
    width: "calc(100% - 20px)",
    margin: "10px",
    border: "1px solid transparent",
    paddingLeft: "30px",
    borderRadius: "2px",
    backgroundColor: "var(--bg-color-blend-contrast1)",
    "&:focus": {
      color: "var(--ft-color-loud)",
      borderColor: "rgba(64, 169, 243, 0.5)",
      backgroundColor: "transparent"
    }
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "20px",
    transform: "translateY(-50%)",
    color: "var(--ft-color-normal)"
  }
});

interface FilterProps {
  value: string;
  className: string;
  placeholder: string;
  icon?: IconDefinition;
  onChange: (value: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Filter = ({
  value,
  className,
  placeholder = "filter...",
  icon = faSearch,
  onChange,
  onKeyDown
}: FilterProps) => {
  const classes = useStyles();

  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
    return () => {
      onChange("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) =>
    onKeyDown && onKeyDown(e);

  return (
    <div className={`${classes.container} ${className ? className : ""}`}>
      <Form.Control
        ref={ref as RefObject<HTMLInputElement>}
        className={classes.input}
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        placeholder={placeholder}
      />
      <FontAwesomeIcon icon={icon} className={classes.icon} />
    </div>
  );
};

export default Filter;
