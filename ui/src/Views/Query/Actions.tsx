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

import useStores from "../../Hooks/useStores";

import CancelButton from "./Actions/CancelButton";
import CompareButton from "./Actions/CompareButton";
import CopyAsNewQueryButton from "./Actions/CopyAsNewQueryButton";
import ResetButton from "./Actions/ResetButton";
import SaveAsButton from "./Actions/SaveAsButton";
import SaveButton from "./Actions/SaveButton";
import UndoChangesButton from "./Actions/UndoChangesButton";
import DeleteButton from "./Actions/DeleteButton";

const QuerySaveAsModeActions = observer(() => {
  const { queryBuilderStore } = useStores();
  return (
    <>
      <CancelButton />
      <SaveButton disabled={queryBuilderStore.isQueryEmpty} />
    </>
  );
});

const UpdatableQueryActions = observer(() => {

  const { queryBuilderStore } = useStores();
  const { hasQueryChanged, isQueryEmpty, hasChanged } = queryBuilderStore;

  const compareDisabled = !hasQueryChanged;
  const saveAsDisabled = isQueryEmpty;
  const saveDisabled = !hasChanged || isQueryEmpty;

  return (
    <>
      <CompareButton disabled={compareDisabled} />
      <CopyAsNewQueryButton />
      <UndoChangesButton />
      <DeleteButton />
      <SaveAsButton disabled={saveAsDisabled} />
      <SaveButton disabled={saveDisabled} />
    </>
  );
});

const ReadOnlyQueryActions = observer(() => {
  const { queryBuilderStore } = useStores();
  return (
    <>
      <CompareButton disabled={!queryBuilderStore.hasQueryChanged} />
      <UndoChangesButton />
      <CopyAsNewQueryButton  />
      <SaveAsButton disabled={queryBuilderStore.isQueryEmpty} />
    </>
  );
});

const NewQueryActions = observer(() => {
  const { queryBuilderStore } = useStores();
  return (
    <>
      <ResetButton />
      <CopyAsNewQueryButton />
      <SaveAsButton disabled={!queryBuilderStore.hasChanged} />
    </>
  );
});

const SavedQueryActions = observer(() => {
  const { queryBuilderStore } = useStores();
  if (queryBuilderStore.canSaveQuery) {
    return <UpdatableQueryActions />;
  }
  return <ReadOnlyQueryActions />;
});

const Actions = observer(() => {
  const { queryBuilderStore } = useStores();
  if (queryBuilderStore.saveAsMode) {
    return <QuerySaveAsModeActions />;
  }
  if (queryBuilderStore.isQuerySaved) {
    return <SavedQueryActions />;
  }
  return <NewQueryActions />;
});

export default Actions;
