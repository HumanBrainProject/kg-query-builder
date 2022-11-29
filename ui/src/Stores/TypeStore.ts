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

import { TransportLayer } from "../Services/TransportLayer";
import { RootStore } from "./RootStore";
import { AxiosError } from "axios";
import { Type } from "./Type";


export class TypeStore {
  filterValue = "";
  types: Map<string, Type.Type> = new Map;
  typeList: Type.Type[] = [];
  fetchError?: string;
  isFetching = false;
  isFetched = false;
  typesQueue = new Set<string>();
  queueThreshold = 5000;
  queueTimeout = 250;
  fetchingQueueError?: string;
  isFetchingQueue = false;

  transportLayer: TransportLayer;
  rootStore: RootStore;

  constructor(transportLayer: TransportLayer, rootStore: RootStore) {
    makeObservable(this, {
      filterValue: observable,
      types: observable,
      typeList: observable,
      fetchError: observable,
      isFetching: observable,
      fetchingQueueError: observable,
      isFetchingQueue: observable,
      isFetched: observable,
      filteredTypeList: computed,
      hasTypes: computed,
      setFilterValue: action,
      fetch: action,
      addTypesToFetch: action,
      processQueue: action,
      fetchQueue: action
    });

    this.transportLayer = transportLayer;
    this.rootStore = rootStore;
  }

  get filteredTypeList() {
    return this.typeList.filter(type => type.label.toLowerCase().indexOf(this.filterValue.trim().toLowerCase()) !== -1);
  }

  get hasTypes() {
    return (
      !!this.typeList.length
    );
  }

  setFilterValue(value: string) {
    this.filterValue = value;
  }

  async fetch() {
    if (!this.isFetching) {
      this.isFetching = true;
      this.fetchError = undefined
      try {
        const response = await this.transportLayer.getTypes();
        runInAction(() => {
          const types = (Array.isArray(response.data)?response.data:[]).map(type => ({
            id: type.id,
            label: type.label,
            color: type.color,
            description: type.description,
            properties: (Array.isArray(type.properties)?type.properties:[])
              .map((p:Type.Property) => {
                if(!p.label) {
                  p.label = p.simpleAttributeName.charAt(0).toUpperCase() + p.simpleAttributeName.slice(1);
                }
                return p;
              })
              .sort((a: Type.Property, b: Type.Property) => a.label.localeCompare(b.label))
          } as Type.Type));
          this.typeList = types.sort((a, b) => a.label.localeCompare(b.label));
          types.forEach(type => this.types.set(type.id, type));
          this.isFetching = false;
          this.isFetched = true;
        });
      } catch (e) {
        const axiosError = e as AxiosError;
        const message = axiosError?.message;
        runInAction(() => {
          this.fetchError = `Error while fetching types (${message})`;
          this.isFetching = false;
          this.isFetched = false;
        });
      }
    }
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
      const response = await this.transportLayer.getTypesByName(toProcess);
      runInAction(() =>{
        toProcess.forEach(identifier => {
          const type =  response && response.data && response.data && response.data[identifier];
          if(type){
            this.types.set(identifier, type);
          }
          this.typesQueue.delete(identifier);
        });
        this.isFetchingQueue = false;
        this.processQueue();
      });
    } catch(e){
      const axiosError = e as AxiosError;
      runInAction(() =>{
        this.fetchingQueueError = `Error fetching types (${axiosError?.message})`;
        toProcess.forEach(identifier => this.typesQueue.delete(identifier));
        this.isFetchingQueue = false;
        this.processQueue();
      });
    }
  }
}

export default TypeStore;