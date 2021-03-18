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

import Link from "./Link";

const Links = ({ links, label, isMerge, show, onClick }) => {

  if (!show) {
    return null;
  }

  return (
    links.map(link => (
      <Link key={link.id} link={link} label={label} isMerge={isMerge} onClick={onClick} />
    ))
  );
};

export default Links;