import React from "react";

import Attribute from "./Attribute";

const Attributes = ({ attributes, label, isMerge, show, onClick }) => {

  if (!show) {
    return null;
  }

  return (
    attributes.map(attribute => (
      <Attribute key={attribute.id} attribute={attribute} label={label} isMerge={isMerge} onClick={onClick} />
    ))
  );
};

export default Attributes;