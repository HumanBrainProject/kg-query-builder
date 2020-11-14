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