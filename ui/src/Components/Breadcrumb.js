import React from "react";
import { observer } from "mobx-react-lite";
import BreadcrumbItem from "./BreadcrumbItem";

const Breadcrumb = observer(({classname, breadcrumb, total, onClick}) => (
  <div className={classname}>
    {breadcrumb.map((item, index) =>
      <BreadcrumbItem key={index} item={item} index={index} total={total} onClick={onClick}/>
    )}
  </div>
));

export default Breadcrumb;