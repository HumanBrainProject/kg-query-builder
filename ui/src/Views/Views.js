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

import React from "react";
import { observer } from "mobx-react-lite";
import { Navigate, Routes, Route } from "react-router-dom";

import { useStores } from "../Hooks/UseStores";

import Queries from "./Queries";
import RootSchema from "./RootSchema";
import Query from "./Query";
import InvalidQueryMode from "./InvalidQueryMode";

const Views = observer(() => {

const {queryBuilderStore } = useStores();

  return (
    <Routes>
      <Route path="/" element={<RootSchema />} />
      <Route path="queries/:id" element={<Query mode="build" />} />
      <Route path="queries/:id/edit" element={<Query mode="edit" />} />
      <Route path="queries/:id/execute" element={<Query mode="execute" />} />
      <Route path="queries/:id/*" element={<InvalidQueryMode />} />
      {queryBuilderStore.hasRootSchema && <Route path="queries" element={<Queries />} />}
      <Route path="*" element={<Navigate to="/" replace={true} />} />  
    </Routes>
  );
});

export default Views;