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

import {faAsterisk} from '@fortawesome/free-solid-svg-icons/faAsterisk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { createUseStyles } from 'react-jss';
import type { FieldProps } from '../Field';

const useStyles = createUseStyles({
  container: {
    color: 'var(--ft-color-louder)'
  },
});

const RequiredFlag = observer(({ field }: FieldProps) => {

  const classes = useStyles();

  if (!field.getOption('required') || (field.parent?.isFlattened)) {
    return null;
  }

  return (
    <span className={classes.container}>
      <FontAwesomeIcon transform="shrink-8" icon={faAsterisk} />
      &nbsp;&nbsp;
    </span>
  );
});
RequiredFlag.displayName = 'RequiredFlag';

export default RequiredFlag;
