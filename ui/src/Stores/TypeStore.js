/*
*   Copyright (c) 2020, EPFL/Human Brain Project PCO
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*/

import { observable, action, computed, runInAction, makeObservable } from "mobx";
import debounce from "lodash/debounce";

export class TypeStore {
  filterValue = "";
  types = {};
  workspaceTypeList = [];
  fetchError = null;
  isFetching = false;
  typesQueue = new Set();
  queueThreshold = 5000;
  queueTimeout = 250;
  fetchingQueueError = null;
  isFetchingQueue = false;

  transportLayer = null;
  rootStore = null;

  constructor(transportLayer, rootStore) {
    makeObservable(this, {
      filterValue: observable,
      types: observable,
      workspaceTypeList: observable,
      fetchError: observable,
      isFetching: observable,
      fetchingQueueError: observable,
      isFetchingQueue: observable,
      isFetched: computed,
      filteredWorkspaceTypeList: computed,
      hasTypes: computed,
      setFilterValue: action,
      fetch: action,
      addTypesToTetch: action,
      processQueue: action,
      fetchQueue: action
    });

    this.transportLayer = transportLayer;
    this.rootStore = rootStore;
  }

  get isFetched() {
    return !this.fetchError && this.workspaceTypeList.length;
  }

  get filteredWorkspaceTypeList() {
    return this.workspaceTypeList.filter(type => type.label.toLowerCase().indexOf(this.filterValue.trim().toLowerCase()) !== -1);
  }

  get hasTypes() {
    return (
      !!this.workspaceTypeList.length
    );
  }

  setFilterValue(value) {
    this.filterValue = value;
  }

  async fetch(forceFetch=false) {
    if (!this.isFetching && (!this.types.length || !!forceFetch)) {
      this.isFetching = true;
      this.fetchError = null;
      try {
        const response = await this.transportLayer.getWorkspaceTypes(this.rootStore.appStore.currentWorkspace);
        runInAction(() => {
          const types = (Array.isArray(response.data)?response.data:[]).map(type => ({
            id: type.id,
            label: type.label,
            color: type.color,
            properties: (Array.isArray(type.properties)?type.properties:[])
              .map(p => {
                if(p.canBe) {
                  p.canBe  = p.canBe.map(v => v["https://core.kg.ebrains.eu/vocab/meta/type"]);
                }
                if(!p.label) {
                  p.label = p.simpleAttributeName.charAt(0).toUpperCase() + p.simpleAttributeName.slice(1);
                }
                return p;
              })
              .sort((a, b) => a.label.localeCompare(b.label))
          }));
          this.workspaceTypeList = types.sort((a, b) => a.label.localeCompare(b.label));
          types.forEach(type => this.types[type.id] = type);
          this.isFetching = false;
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        runInAction(() => {
          this.fetchError = `Error while fetching types (${message})`;
          this.isFetching = false;
        });
      }
    }
  }

  addTypesToTetch(types) {
    types
      .filter(id => !this.types[id])
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
      const response = await this.transportLayer.getTypes(toProcess);
      runInAction(() =>{
        toProcess.forEach(identifier => {
          const type =  response && response.data && response.data && response.data[identifier];
          if(type){
            this.types[identifier] = type;
          }
          this.typesQueue.delete(identifier);
        });
        this.isFetchingQueue = false;
        this.processQueue();
      });
    } catch(e){
      runInAction(() =>{
        this.fetchingQueueError = `Error fetching types (${e.message?e.message:e})`;
        toProcess.forEach(identifier => this.typesQueue.delete(identifier));
        this.isFetchingQueue = false;
        this.processQueue();
      });
      this.transportLayer.captureException(e);
    }
  }
}

export default TypeStore;