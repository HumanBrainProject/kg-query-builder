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

import {
  observable,
  action,
  computed,
  makeObservable
} from "mobx";

import RootStore from "./RootStore";
import { Query } from "../Types/Query";
import { Space } from "../types";

const queriesCompare = (a: Query.Query, b: Query.Query): number => {
  if (a.label && b.label) {
    return a.label.localeCompare(b.label);
  }
  if (a.label) {
    return -1;
  }
  if (b.label) {
    return 1;
  }
  return a.id.localeCompare(b.id);
};

const queriesFilter = (
  query: Query.Query,
  filter: string
): boolean =>
  (!!query.label && query.label.toLowerCase().includes(filter)) ||
  (!!query.description && query.description.toLowerCase().includes(filter)) ||
  (!!query.id && query.id.toLowerCase().includes(filter));

  const spaceQueriesCompare = (
    a: Query.SpaceQueries,
    b: Query.SpaceQueries
  ): number => {
    if (a.isPrivate) {
      return -1;
    }
    if (b.isPrivate) {
      return 1;
    }
    return a.name.localeCompare(b.name);
  };

class QueriesStore {
  type?: string;
  queries: Query.Query[] = [];
  filter = "";
  showSavedQueries = false;


  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeObservable(this, {
      type: observable,
      queries: observable,
      hasQueries: computed,
      groupedQueries: computed,
      groupedFilteredQueries: computed,
      filter: observable,
      setFilter: action,
      setQueries: action,
      clearQueries: action,
      findQuery: action,
      addQuery: action,
      removeQuery: action,
      showSavedQueries: observable,
      toggleShowSavedQueries: action
    });

    this.rootStore = rootStore;
  }

  toggleShowSavedQueries(show: boolean) {
    this.showSavedQueries = show;
  }

  clearQueries() {
    this.type = undefined;
    this.queries = [];
    this.filter = "";
  }

  setQueries(type: string|undefined, queries: Query.Query[]) {
    this.type = type;
    this.queries = queries;
  }

  setFilter(value: string) {
    this.filter = value;
  }

  get hasQueries(): boolean {
    return this.queries.length > 0;
  }

  get groupedQueries(): Query.SpaceQueries[] {
    const groups: Query.GroupedBySpaceQueries = {};
    const spacesStore = this.rootStore.spacesStore;
    this.queries.forEach(query => {
      if (query.space) {
        const space: Space | undefined = spacesStore.getSpace(query.space);
        if (space) {
          if (!groups[query.space]) {
            groups[query.space] = {
              name: space.name,
              label: space.isPrivate
                ? "My private queries"
                : `Shared queries in space ${space.name}`,
              isPrivate: space.isPrivate,
              permissions: { ...space.permissions },
              queries: []
            };
          }
          groups[query.space].queries = [
            ...groups[query.space].queries,
            query
          ].sort(queriesCompare);
        }
      }
    });
    return Object.values(groups)
      .filter(group => group.queries.length)
      .sort(spaceQueriesCompare);
  }

  get groupedFilteredQueries(): Query.SpaceQueries[] {
    const filter = this.filter.toLowerCase();
    if (!filter) {
      return this.groupedQueries;
    }
    return this.groupedQueries.reduce((acc: Query.SpaceQueries[], group) => {
      const queries = group.queries.filter(query => queriesFilter(query, filter));
      if (queries.length) {
        acc.push({
          name: group.name,
          label: group.label,
          permissions: { ...group.permissions },
          queries: queries
        } as Query.SpaceQueries);
      }
      return acc;
    }, []);
  }

  findQuery(queryId: string) {
    return this.queries.find(q => q.id === queryId);
  }

  addQuery(query: Query.Query) {
    const index = this.queries.findIndex(q => q.id === query.id);
    if (index !== -1) {
      this.queries[index] = query;
    } else {
      this.queries.push(query);
    }
  }

  removeQuery(queryId: string) {
    const index = this.queries.findIndex(q => q.id === queryId);
    if (index !== -1) {
      this.queries.splice(index, 1);
    }
  }

}

export default QueriesStore;
