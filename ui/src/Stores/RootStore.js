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

import { AppStore } from "./AppStore";
import { AuthStore } from "./AuthStore";
import { TypesStore } from "./TypesStore";
import { QueryBuilderStore } from "./QueryBuilderStore";

export class RootStore {

  authStore= null
  typesStore= null
  queryBuilderStore= null

  constructor(transportLayer) {

    if (!transportLayer) {
      throw new Error("no transport layer provided!");
    }

    // Domain stores
    this.typesStore = new TypesStore(transportLayer, this);
    this.queryBuilderStore = new QueryBuilderStore(transportLayer, this);

    this.authStore = new AuthStore(transportLayer);
    transportLayer.setAuthStore(this.authStore);

    // UI stores
    this.appStore = new AppStore(this);
  }
}