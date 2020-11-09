import React from "react";
import { createUseStyles } from "react-jss";
import Avatar from "./Avatar";

const useStyles = createUseStyles({
  user: {
    "& .avatar.default": {
      margin: "0 5px"
    },
    "& .avatar.picture": {
      margin: "0 2px 0 5px"
    }
  }
});

const User = ({user}) =>  {
  const classes = useStyles();
  if (!user) {
    return null;
  }
  return (
    <span className={`${classes.user} user`}><Avatar user={user} />
      <span className="name">{user.name?user.name:user.id}</span>
    </span>
  );
};

export default User;