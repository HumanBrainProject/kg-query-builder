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

package eu.ebrains.kg.querybuilder.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class IdController {


    private final String kgCoreInstancesPrefix;

    public IdController(@Value("${kgcore.instancesPrefix}") String kgCoreInstancesPrefix) {
        if (kgCoreInstancesPrefix != null) {
            this.kgCoreInstancesPrefix = kgCoreInstancesPrefix.endsWith("/") ? kgCoreInstancesPrefix : kgCoreInstancesPrefix + "/";
        } else {
            this.kgCoreInstancesPrefix = null;
        }
    }

    public UUID getSimplifyFullyQualifiedId(Map<String, Object> data) {
        if (data == null) {
            return null;
        }
        String id;
        try {
            id = (String) data.get("@id");
        } catch (ClassCastException exc) {
            id = null;
        }
        if (id == null) {
            return null;
        }
        return simplifyFullyQualifiedId(id);
    }

    public UUID simplifyFullyQualifiedId(String id) {
        if (id != null && id.startsWith(this.kgCoreInstancesPrefix)) {
            String uuid = id.substring(this.kgCoreInstancesPrefix.length());
            try {
                return UUID.fromString(uuid);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }
}
