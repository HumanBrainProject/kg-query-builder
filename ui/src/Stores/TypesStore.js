import { observable, action, computed, runInAction, makeObservable } from "mobx";
import debounce from "lodash/debounce";

import API from "../Services/API";

class TypesStore {
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

  constructor() {
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
        const response = await API.axios.get(API.endpoints.workspaceTypes());
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
        runInAction(() => {
          const message = e.message ? e.message : e;
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
    let toProcess = Array.from(this.typesQueue).splice(0, this.queueThreshold);
    try{
      let response = await API.axios.post(API.endpoints.types(), toProcess);
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
    }
  }
}

export default new TypesStore();