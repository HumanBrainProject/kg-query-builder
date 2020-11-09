import React from "react";

import Option from "./Option";

const Options = ({ field, rootField, lookupsLinks, options, onChange }) => (
  <React.Fragment>
    {options.map(option => (
      <Option key={option.name} field={field} rootField={rootField} lookupsLinks={lookupsLinks} option={option} onChange={onChange} />
    ))}
  </React.Fragment>
);

export default Options;