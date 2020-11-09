import React from "react";
import {observer} from "mobx-react";
import Field from "./Field";
import uniqueId from "lodash/uniqueId";


const Fields = observer(({ field }) => (
  <div>
    {field.merge && !!field.merge.length && field.merge.map(field => {
      return(
        <Field field={field} key={uniqueId("merge_")} />
      );
    })}
    {field.structure && !!field.structure.length && field.structure.map(field => {
      return(
        <Field field={field} key={uniqueId("field_")} />
      );
    })}
  </div>
));

export default Fields;