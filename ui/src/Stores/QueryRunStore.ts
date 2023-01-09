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
  makeObservable
} from "mobx";

import { TransportLayer } from "../Services/TransportLayer";
import { RootStore } from "./RootStore";
import { Query } from "./Query";

const defaultResultSize = 20;

export class QueryRunStore {
  stage = "RELEASED";
  size = `${defaultResultSize}`;
  start = "0";
  instanceId = "";
  spaces?: string[];
  parameters: Query.ResultQueryParameters = {};

  transportLayer: TransportLayer;
  rootStore: RootStore;

  constructor(transportLayer: TransportLayer, rootStore: RootStore) {
    makeObservable(this, {
      stage: observable,
      size: observable,
      start: observable,
      instanceId: observable,
      parameters: observable,
      spaces: observable,
      setSpaces: action,
      updateParameters: action,
      setSize: action,
      setStart: action,
      setInstanceId: action,
      setParameter: action,
      setStage: action
    });

    this.transportLayer = transportLayer;
    this.rootStore = rootStore;
  }

  setSpaces(spaces: string[]|undefined) {
    this.spaces = spaces;
  }

  setSize(size: string) {
    this.size = size;
  }

  setStart(start: string) {
    this.start = start;
  }

  setInstanceId(instanceId: string) {
    this.instanceId = instanceId;
  }

  setParameter(name: string, value: string) {
    if (this.parameters[name]) {
      this.parameters[name].value = value;
    } else {
      this.parameters[name] = {
        name: name,
        value: value
      };
    }
  }

  setStage(scope: string) {
    this.stage = scope;
  }

  updateParameters(parameters: string[]) {
    parameters.forEach(name => {
      if (!this.parameters[name]) {
        this.parameters[name] = {
          name: name,
          value: ""
        };
      }
    });
  }

}

export default QueryRunStore;
