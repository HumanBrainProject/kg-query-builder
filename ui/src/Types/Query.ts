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

import type { QuerySpecification } from './QuerySpecification';
import type { Permissions } from '../types';

export namespace Query {
  export interface TypeFilter {
    id: string;
    selected: boolean;
    isUnknown: boolean;
  }

  export interface Option {
    name: string;
    value?: QuerySpecification.Value;
  }

  export interface Properties {
    [name: string]: QuerySpecification.Value;
  }

  export interface Query {
    id: string;
    label: string;
    description: string;
    space: string;
    meta: QuerySpecification.Meta;
    structure: QuerySpecification.Field[];
    context: QuerySpecification.Context;
    properties: Properties;
  }

  export interface SpaceQueries {
    name: string;
    label: string;
    isPrivate: boolean;
    permissions: Permissions;
    queries: Query[];
  }

  export interface GroupedBySpaceQueries {
    [name: string]: SpaceQueries;
  }

  export interface ResultQueryParameters {
    [name: string]: {
      name: string;
      value: string;
    };
  }
}
