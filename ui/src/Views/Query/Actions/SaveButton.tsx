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

import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons/faSave";
import { useNavigate, matchPath } from "react-router-dom";
import { AxiosError } from "axios";

import useStores from "../../../Hooks/useStores";
import useAPI from "../../../Hooks/useAPI";
import Matomo from "../../../Services/Matomo";
import { Query } from "../../../Stores/Query";

import SpinnerPanel from "../../../Components/SpinnerPanel";
import ActionError from "../../../Components/ActionError";

interface SaveButtonProps {
  disabled: boolean;
}

const SaveButton = observer(({ disabled }: SaveButtonProps) => {

  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string|undefined>(undefined);

  const API = useAPI();

  const { queryBuilderStore, queriesStore, spacesStore } = useStores();

  const handleSave = () => {
    Matomo.trackEvent("Query", "Save", queryBuilderStore.queryId);
    saveQuery();
  };

  const saveQuery = async () => {
    if (!queryBuilderStore.isQueryEmpty) {
      setIsSaving(true);
      setError(undefined);
      if (!queryBuilderStore.space && spacesStore.privateSpace) {
        queryBuilderStore.setSpace(spacesStore.privateSpace);
      }
      //TODO: fix queryId undefined check after QueryBuilderStore refactoring/splitting
      const queryId = queryBuilderStore.saveAsMode
        ? queryBuilderStore.queryId
          ? queryBuilderStore.queryId
          : ""
        : queryBuilderStore.sourceQuery
        ? queryBuilderStore.sourceQuery.id
        : "";
      const querySpecification = queryBuilderStore.querySpecification;
      const spaceName = (queryBuilderStore.space?.name)?queryBuilderStore.space.name:"myspace";
      try {
        await API.saveQuery(queryId, querySpecification, spaceName);
        if (queryBuilderStore.saveAsMode) {
          const sourceQuery = {
            id: queryId,
            context: querySpecification["@context"],
            structure: querySpecification.structure,
            properties: Query.getProperties(querySpecification),
            meta: querySpecification.meta,
            label: (querySpecification.meta?.name)?querySpecification.meta.name:"",
            description: (querySpecification.meta?.description)?querySpecification.meta.description:"",
            space: spaceName
          } as Query.Query;
          queriesStore.addQuery(sourceQuery);
          queryBuilderStore.setSourceQuery(sourceQuery);
          queryBuilderStore.setQuerySaved();
          setIsSaving(false);
          const match = matchPath({path:"/queries/:id/:mode"}, location.pathname);
          const mode = match?.params?.mode;
          const path = mode
            ? `/queries/${queryId}/${mode}`
            : `/queries/${queryId}`;
          navigate(path);
        } else {
          if (!queryBuilderStore.sourceQuery) {
            const sourceQuery = queriesStore.findQuery(queryId);
            queryBuilderStore.setSourceQuery(sourceQuery);
          }
          queryBuilderStore.updateSourceQuery(querySpecification);
          queryBuilderStore.setQuerySaved();
          setIsSaving(false);
        }
      } catch (e) {
        const axiosError = e as AxiosError;
        const message = axiosError?.message;
        setError(`Error while saving query "${queryId}" (${message})`);
        setIsSaving(false);
      }
    }
  };

  const handleCancelSave = () => setError(undefined);

  return (
    <>
      <Button variant="primary" disabled={disabled} onClick={handleSave}>
        <FontAwesomeIcon icon={faSave} />&nbsp;Save
      </Button>
      <SpinnerPanel show={isSaving} text={`Saving query ${queryBuilderStore.queryId}`} />
      <ActionError error={error} onCancel={handleCancelSave} onRetry={saveQuery} />
    </>
  );
});
SaveButton.displayName = "SaveButton";

export default SaveButton;
