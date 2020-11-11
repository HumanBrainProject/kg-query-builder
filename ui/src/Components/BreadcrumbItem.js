import React from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { isString, isInteger } from "lodash";

const useStyles = createUseStyles({
  breadcrumbItem: {
    marginBottom: "10px",
    float: "left",
    background: "var(--list-bg-hover)",
    height: "36px",
    lineHeight: "36px",
    padding: "0 20px 0 30px",
    position: "relative",
    border: "1px solid var(--border-color-ui-contrast2)",
    "&::before": {
      display: "block",
      content: "''",
      position: "absolute",
      top: "5px",
      left: "-13px",
      height: "24px",
      width: "24px",
      transform: "rotate(45deg)",
      background: "var(--list-bg-hover)",
      borderTop: "1px solid var(--border-color-ui-contrast2)",
      borderRight: "1px solid var(--border-color-ui-contrast2)",
    },
    "&:first-child::before": {
      display: "none",
    },
    "&:first-child": {
      padding: "0 20px 0 20px",
    },
    "&.clickable": {
      cursor: "pointer",
    },
    "&.clickable:hover": {
      background: "var(--list-bg-selected)",
      "& + ::before": {
        background: "var(--list-bg-selected)",
      }
    },
    "&:last-child": {
      background: "var(--list-bg-selected)",
      cursor: "default",
    }
  }
});


const BreadcrumbItem = observer(({ item, index, onClick, total }) => {

  const classes = useStyles();
  const className = `${classes.breadcrumbItem}${!isInteger(item) ? " clickable" : ""}`;
  const actions = {};
  if(isString(item)) {
    actions.onClick = () => onClick(index);
  }

  const totalResult = index === 0 ? `(${total})` : "";
  const name = isInteger(item) ? `#${item}`:item;

  return (
    <div className={className} {...actions}>
      {name}
      {totalResult}
    </div>
  );
});

export default BreadcrumbItem;

