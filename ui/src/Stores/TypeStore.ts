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

import { observable, action, computed, runInAction, makeObservable } from "mobx";
import debounce from "lodash/debounce";

import API, { APIError }  from "../Services/API";
import { Type } from "../types";


export class TypeStore {
  filterValue = "";
  types: Map<string, Type> = new Map;
  typeList: Type[] = [];
  typesQueue = new Set<string>();
  queueThreshold = 5000;
  queueTimeout = 250;
  fetchingQueueError?: string;
  isFetchingQueue = false;

  api: API;

  constructor(api: API) {
    makeObservable(this, {
      filterValue: observable,
      types: observable,
      typeList: observable,
      fetchingQueueError: observable,
      isFetchingQueue: observable,
      filteredTypeList: computed,
      hasTypes: computed,
      setFilterValue: action,
      setTypes: action,
      addTypesToFetch: action,
      processQueue: action,
      fetchQueue: action
    });

    this.api = api;
  }

  get filteredTypeList() {
    return this.typeList.filter(type => type.label.toLowerCase().indexOf(this.filterValue.trim().toLowerCase()) !== -1);
  }

  get hasTypes() {
    return !!this.typeList.length;
  }

  setFilterValue(value: string) {
    this.filterValue = value;
  }

  setTypes(types: Type[]) {
    this.typeList = types;
    types.forEach(type => this.types.set(type.id, type));
  }

  addTypesToFetch(types: string[]) {
    types
      .filter(id => !this.types.has(id))
      .forEach(id => this.typesQueue.add(id));
    this.processQueue();
  }

  processQueue() {
    if(this.typesQueue.size <= 0){
      this._debouncedFetchQueue.cancel();
    } else if(this.typesQueue.size < this.queueThreshold){
      this._debouncedFetchQueue();
    } else if(!this.isFetchingQueue){
      this._debouncedFetchQueue.cancel();
      this.fetchQueue();
    }
  }

  _debouncedFetchQueue = debounce(()=>{this.fetchQueue();}, this.queueTimeout);

  async fetchQueue() {
    if(this.isFetchingQueue){
      return;
    }
    this.isFetchingQueue = true;
    const toProcess = Array.from(this.typesQueue).splice(0, this.queueThreshold);
    try{
      const typesByName = await this.api.getTypesByName(toProcess);
      runInAction(() =>{
        toProcess.forEach(identifier => {
          const type =  typesByName[identifier];
          if(type){
            this.types.set(identifier, type);
          }
          this.typesQueue.delete(identifier);
        });
        this.isFetchingQueue = false;
        this.processQueue();
      });
    } catch(e){
      const err = e as APIError;
      runInAction(() =>{
        this.fetchingQueueError = `Error fetching types (${err?.message})`;
        toProcess.forEach(identifier => this.typesQueue.delete(identifier));
        this.isFetchingQueue = false;
        this.processQueue();
      });
    }
  }
}

export default TypeStore;