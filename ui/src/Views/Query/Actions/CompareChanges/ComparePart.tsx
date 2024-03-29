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

import React from 'react';
import { createUseStyles } from 'react-jss';
import type { Change } from 'diff';

const useStyles = createUseStyles({
  removed: {
    background: '#FADBD7',
    textDecoration: 'line-through',
    '& + $added': {
      marginLeft: '3px'
    }
  },
  added: {
    background: '#A5EBC3',
    '& + $removed': {
      marginLeft: '3px'
    }
  },
  unchanged: {}
});

interface ComparePartProps {
  part: Change
}

const ComparePart = ({ part }: ComparePartProps) => {
  const classes = useStyles();

  if (!part.value) {
    return null;
  }

  const getClassname = () => {
    if (part.added) {
      return classes.added;
    }
    if (part.removed) {
      return classes.removed;
    }
    return classes.unchanged;
  };

  const className = getClassname();

  return <span className={className}>{part.value}</span>;
};

export default ComparePart;
