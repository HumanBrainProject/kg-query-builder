import React from "react";

import Option from "./Option";

const Options = ({ field, rootField, lookupsLinks, options, onChange }) => (
  options.map(option => (
    <Option key={option.name} field={field} rootField={rootField} lookupsLinks={lookupsLinks} option={option} onChange={onChange} />
  ))
);

export default Options;