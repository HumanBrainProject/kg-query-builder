/*  Copyright 2018 - 2021 Swiss Federal Institute of Technology Lausanne (EPFL)
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0.
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  This open source software code was developed in part or in whole in the
 *  Human Brain Project, funded from the European Union's Horizon 2020
 *  Framework Programme for Research and Innovation under
 *  Specific Grant Agreements No. 720270, No. 785907, and No. 945539
 *  (Human Brain Project SGA1, SGA2 and SGA3).
 *
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
 *
 */
import { BrowserOptions } from "@sentry/browser";
import { KeycloakConfig } from "keycloak-js";
import { PiwikOptions } from "react-piwik";

export type UUID = string;

export interface Settings {
    commit: string;
    keycloak: KeycloakConfig;
    matomo?: PiwikOptions; 
    sentry?: BrowserOptions;
}

export interface Permissions {
    canCreate: boolean;
    canDelete: boolean;
    canWrite: boolean;
}

export interface Space {
    name: string;
    isPrivate: boolean;
    permissions: Permissions;
}

export interface UserProfile {
    id: string;
    username: string;
    name: string;
    givenName: string;
    familyName: string;
    email: string;
}

export type Stage = "IN_PROGRESS" | "RELEASED";

export interface KGCoreError {
    code: number;
    message: string;
    instanceId: UUID;
}

export interface KGCoreResult<T> {
    data: T;
    message: string;
    error: KGCoreError;
    total: number;
    size: number;
    from: number;
}

export interface Type {
    id: string;
    description?: string;
    label: string;
    color?: string;
    properties: Property[];
}

export interface Property {
    attribute: string;
    canBe?: string[];
    label: string;
    simpleAttributeName: string;
    reverse?: boolean;
}  

export interface PropertyGroup {
    id: string;
    label: string;
    color?: string;
    properties: Property[];
}

export interface TypesByName {
    [key: string]: Type
}

export interface QueryExecutionResult {
    data: object[];
    startTime: number;
    durationInMs: number;
    total: number;
    size: number;
    from: number;
}