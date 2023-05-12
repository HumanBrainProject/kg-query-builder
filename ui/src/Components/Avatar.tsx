/*
 * Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This open source software code was developed in part or in whole in the
 * Human Brain Project, funded from the European Union's Horizon 2020
 * Framework Programme for Research and Innovation under
 * Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 * (Human Brain Project SGA1, SGA2 and SGA3).
 *
 */

import React from "react";
import { observer } from "mobx-react-lite";
import { createUseStyles } from "react-jss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { UserProfile } from "../types";

const useStyles = createUseStyles({
  avatar: {
    verticalAlign: "middle",
    "&.picture": {
      border: 0,
      borderRadius: "50%"
    },
    "&.default": {
      transform: "scale(1.35)"
    }
  }
});

interface AvatarProps {
  user: UserProfile;
}

const Avatar = observer(({ user }: AvatarProps) => {
  const classes = useStyles();

  if (!user) {
    return null;
  }

  const userName = user.name ? user.name : user.id;

  return (
    <FontAwesomeIcon
      icon={faUser}
      title={userName}
      className={`${classes.avatar} avatar default`}
    />
  );
});
Avatar.displayName = "Avatar";

export default Avatar;
