import React from "react";
import injectStyles from "react-jss";

import Avatar from "./Avatar";

const styles = {
  user: {
    "& .avatar.default": {
      margin: "0 5px"
    },
    "& .avatar.picture": {
      margin: "0 2px 0 5px"
    }
  }
};

@injectStyles(styles)
class User extends React.Component {

  render() {
    const {classes, user} = this.props;

    if (!user) {
      return null;
    }

    return (
      <span className={`${classes.user} user`}><Avatar user={user} />
        <span className="name">{user.name?user.name:user.id}</span>
      </span>
    );
  }
}

export default User;