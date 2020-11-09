import React from "react";

import Toggle from "./Toggle";

const Flatten = ({ field, show, onChange}) => {

  const handleOnChange = (name, value) => onChange(value);

  if (!show) {
    return null;
  }

  return (
    <Toggle
      option={{
        value: field.isFlattened
      }}
      label="Flatten"
      comment="only applicable if this field has only one child field"
      show={true}
      onChange={handleOnChange}
    />
  );
};

export default Flatten;