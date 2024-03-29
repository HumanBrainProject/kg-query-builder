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

import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
import React from 'react';
import { createUseStyles } from 'react-jss';

import Icon from '../Components/Icon';
import useStores from '../Hooks/useStores';


const useStyles = createUseStyles({
  types: {
    '& > div::before': {
      content: '\', \'',
      color: 'var(--ft-color-loud)'
    },
    '& > div:first-child::before': {
      content: '\'\''
    }
  }
});

const extractLabel = (type: string): string => {
  if (typeof type !== 'string') {
    return '<unknown filter>';
  }
  const idx = type.lastIndexOf('/');
  if (idx !== -1) {
    return type.substring(idx + 1);
  }
  return type;
};

interface TypeProps {
  type: string;
}

export const Type = ({ type }: TypeProps) => {
  const { typeStore } = useStores();

  const t = typeStore.types.get(type);
  const label = t ? t.label : extractLabel(type);
  const color = t?.color;

  return (
    <span title={typeof type === 'string' ? type : JSON.stringify(type)}>
      <Icon icon={faCircle} color={color} />
      {label}
    </span>
  );
};

interface PropertyTypesProps {
  types?: string[];
}

const PropertyTypes = ({ types }: PropertyTypesProps) => {
  const classes = useStyles();

  if (!Array.isArray(types) || !types.length) {
    return null;
  }

  return (
    <span className={classes.types}>
      {types.map((type, index) => (
        <Type type={type} key={type ? type : index} />
      ))}
    </span>
  );
};

export default PropertyTypes;
