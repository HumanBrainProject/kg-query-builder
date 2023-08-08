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

import { useMemo } from 'react';
import useAPI from './useAPI';
import useGenericQuery from './useGenericQuery';
import type { GenericQuery } from './useGenericQuery';
import type { Type, Property } from '../types';

const typeComparer = (a: Type, b: Type) => a.label.localeCompare(b.label);

const propertyComparer = (a: Property, b: Property) => a.label.localeCompare(b.label);

const normalizeProperty = (property: Property): Property => {
  if(!property.label) {
    property.label = property.simpleAttributeName.charAt(0).toUpperCase() + property.simpleAttributeName.slice(1);
  }
  return property;
};

const normalizeProperties = (properties?: Property[]) => {
  if (!Array.isArray(properties)) {
    return [];
  }
  return properties
    .map(property => normalizeProperty(property))
    .sort(propertyComparer);
};

const normalizeTypes = (types?: Type[]) => {
  if (!Array.isArray(types)) {
    return [];
  }
  return types
    .map(type => ({
      ...type,
      properties: normalizeProperties(type.properties)
    } as Type))
    .sort(typeComparer);
};

export type ListSpacesQuery = GenericQuery<Type[]>;

const useListSpacesQuery = (): ListSpacesQuery => {

  const API = useAPI();

  const fetch = useMemo(() => async () => {
    const data = await API.listTypes();
    return normalizeTypes(data);
  }, [API]);

  return useGenericQuery<Type[]>(fetch);
};

export default useListSpacesQuery;