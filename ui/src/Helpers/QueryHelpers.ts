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

import jsonld from 'jsonld';

import type { Query } from '../Types/Query';
import type { QuerySpecification } from '../Types/QuerySpecification';

export const rootFieldReservedProperties: string[] = [
  'root_schema',
  'schema:root_schema',
  'http://schema.org/root_schema', //NOSONAR it's a schema
  'identifier',
  'schema:identifier',
  'http://schema.org/identifier', //NOSONAR it's a schema
  '@id',
  '@type',
  '@context',
  'meta',
  'structure',
  'merge',
  '_collection',
  '_id',
  '_identifiers',
  '_indexTimestamp',
  '_inferenceOf',
  '_key',
  '_rev',
  '_timestamp',
  'https://core.kg.ebrains.eu/vocab/meta/revision',
  'https://core.kg.ebrains.eu/vocab/meta/space',
  'https://core.kg.ebrains.eu/vocab/meta/user',
  'https://core.kg.ebrains.eu/vocab/meta/alternative'
];

export const optionsToKeepOnFlattenendField: string[] = ['ensureOrder', 'required', 'singleValue'];

export const fieldReservedProperties: string[]  = ['propertyName', 'path', 'merge', 'structure'];

export const namespaceReg = /^(.+):(.+)$/;//NOSONAR
export const attributeReg = /^https?:\/\/.+\/(.+)$/;//NOSONAR
export const modelReg = /^\/?((.+)\/(.+)\/(.+)\/(.+))$/;//NOSONAR

export const DEFAULT_RESPONSE_VOCAB = 'https://schema.hbp.eu/myQuery/';

export const defaultContext = (): QuerySpecification.Context => ({
  '@vocab': 'https://core.kg.ebrains.eu/vocab/query/',
  query: DEFAULT_RESPONSE_VOCAB,
  propertyName: {
    '@id': 'propertyName',
    '@type': '@id'
  },
  path: {
    '@id': 'path',
    '@type': '@id'
  }
});

export const getProperties = (query: QuerySpecification.QuerySpecification): Query.Properties => {
  if (!query) {
    return {};
  }
  return Object.entries(query)
    .filter(([name]) => !rootFieldReservedProperties.includes(name))
    .reduce((result, [name, value]) => {
      result[name] = value;
      return result;
    }, {} as Query.Properties);
};


export const normalizeQuery = async (jsonSpec: QuerySpecification.QuerySpecification): Promise<Query.Query> => {
  const queryId = jsonSpec['@id'];
  jsonSpec['@context'] = defaultContext();
  const expanded = await jsonld.expand(jsonSpec as jsonld.JsonLdDocument);
  const compacted = await jsonld.compact(expanded, jsonSpec['@context'] as jsonld.ContextDefinition);
  const meta = compacted.meta as QuerySpecification.Meta;
  return {
    id: queryId,
    context: compacted['@context'] as QuerySpecification.Context,
    structure: compacted.structure as QuerySpecification.Field[],
    properties: getProperties(compacted as QuerySpecification.QuerySpecification),
    meta: meta,
    label: meta.name ? meta.name  : '',
    description: meta.description ? meta.description : '',
    space: jsonSpec['https://core.kg.ebrains.eu/vocab/meta/space'],
  } as Query.Query;
};
