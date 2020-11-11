import React from "react";
import { observer } from "mobx-react-lite";

import typesStore from "../Stores/TypesStore";

import Component from "../Components/Filter";

const Filter = observer(() => {

  const handleChange = value => typesStore.setFilterValue(value);

  return (
    <Component value={typesStore.filterValue} placeholder="Filter types" onChange={handleChange} />
  );
});

export default Filter;