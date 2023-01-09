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

import { TransportLayer } from "../Services/TransportLayer";
import { AppStore } from "./AppStore";
import { AuthStore } from "./AuthStore";
import { TypeStore } from "./TypeStore";
import { QueriesStore } from "./QueriesStore";
import { QueryBuilderStore } from "./QueryBuilderStore";
import { QueryRunStore } from "./QueryRunStore";

export class RootStore {

  authStore: AuthStore;
  typeStore: TypeStore;
  queriesStore: QueriesStore;
  queryBuilderStore: QueryBuilderStore;
  queryRunStore: QueryRunStore;
  appStore: AppStore;
  transportLayer: TransportLayer;

  constructor(transportLayer: TransportLayer) {

    if (!transportLayer) {
      throw new Error("no transport layer provided!");
    }

    this.transportLayer = transportLayer;

    // Domain stores
    this.typeStore = new TypeStore(transportLayer, this);
    this.queriesStore = new QueriesStore(transportLayer, this);
    this.queryBuilderStore = new QueryBuilderStore(transportLayer, this);
    this.queryRunStore = new QueryRunStore(transportLayer, this);

    this.authStore = new AuthStore(transportLayer);
    transportLayer.setAuthStore(this.authStore);

    // UI stores
    this.appStore = new AppStore(this);
  }
}