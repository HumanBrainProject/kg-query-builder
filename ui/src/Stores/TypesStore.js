import { observable, action, computed, runInAction } from "mobx";
import { debounce } from "lodash";
import API from "../Services/API";

class TypesStore {
  @observable types = {};
  @observable workspaceTypeList = [];
  @observable fetchError = null;
  @observable isFetching = false;
  typesQueue = new Set();
  queueThreshold = 5000;
  queueTimeout = 250;
  @observable fetchingQueueError = null;
  @observable isFetchingQueue = false;

  @computed
  get typeList() {
    return Object.values(this.types);
  }

  @computed
  get isFetched() {
    return !this.fetchError && this.workspaceTypeList.length;
  }

  @computed
  get hasTypes() {
    return (
      !!this.workspaceTypeList.length
    );
  }

  @action
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
            properties: (Array.isArray(type.properties)?type.properties:[])
              .sort((a, b) => a.label < b.label ? -1 : a.label > b.label ? 1 : 0)
          }));
          // types = types.filter(type => {
          //   if (type.id === "http://schema.org/Man") {
          //     man = type;
          //     return false;
          //   }
          //   return true;
          // });
          this.workspaceTypeList = types;
          types.forEach(type => this.types[type.id] = type);
          this.isFetching = false;
        });
      } catch (e) {
        const message = e.message ? e.message : e;
        this.fetchError = `Error while fetching types (${message})`;
        this.isFetching = false;
      }
    }
  }

  @action
  addTypesToTetch(types) {
    types
      .filter(id => !this.types[id])
      .forEach(id => this.typesQueue.add(id));
    this.processQueue();
  }

  @action
  processQueue(){
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

  @action
  async fetchQueue(){
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