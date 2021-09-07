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

package eu.ebrains.kg.queryBuilder.service;

import eu.ebrains.kg.queryBuilder.constants.SchemaFieldsConstants;
import eu.ebrains.kg.queryBuilder.model.TypeEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class SpaceClient {

    private final ServiceCall kg;

    public SpaceClient(ServiceCall kg) {
        this.kg = kg;
    }

    public Map<?, ?> getSpaces() {
        String relativeUrl = "spaces?stage=IN_PROGRESS";
        Map<String, Object> result = kg.client().get().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        List<Map<String, Object>> spaces = ((List<Map<String, Object>>) result.get("data")).stream()
                .filter(space -> {
                            boolean isClientSpace = space.containsKey(SchemaFieldsConstants.META_CLIENT_SPACE) && ((boolean) space.get(SchemaFieldsConstants.META_CLIENT_SPACE));
                            boolean isInternalSpace = space.containsKey(SchemaFieldsConstants.META_INTERNAL_SPACE) && ((boolean) space.get(SchemaFieldsConstants.META_INTERNAL_SPACE));
                            return !(isClientSpace || isInternalSpace);
                        }
                ).collect(Collectors.toList());
        result.put("data", spaces);
        result.put("size", spaces.size());
        result.put("total", spaces.size());
        return result;
    }
}
