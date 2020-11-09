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