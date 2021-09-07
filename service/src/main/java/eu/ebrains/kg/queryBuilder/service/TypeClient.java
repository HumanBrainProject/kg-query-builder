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

import eu.ebrains.kg.queryBuilder.model.TypeEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class TypeClient {

    private final ServiceCall kg;

    public TypeClient(ServiceCall kg) {
        this.kg = kg;
    }

    public List<TypeEntity> getTypes() {
        String relativeUrl = "types?stage=IN_PROGRESS&withProperties=true&withIncomingLinks=true&withCounts=false";
        Map result = kg.client().get().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        if (result != null) {
            Object data = result.get("data");
            if (data instanceof Collection) {
                return ((Collection<?>) data).stream().filter(d -> d instanceof Map).map(d -> (Map<?, ?>) d).map(TypeEntity::fromMap).collect(Collectors.toList());
            }
        }
        return Collections.emptyList();
    }

    public Map<?, ?> getTypesByName(List<String> types) {
        String relativeUrl = "typesByName?stage=IN_PROGRESS&withProperties=true&withIncomingLinks=true";
        Map result = kg.client().post().uri(kg.url(relativeUrl))
                .body(BodyInserters.fromValue(types))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        if (result != null) {
            Map<?, ?> data = (Map<?, ?>) result.get("data");
            return data.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, d -> TypeEntity.fromMap(this.getData(d))));
        }
        return Collections.emptyMap();
    }

    private Map<?, ?> getData(Map.Entry data) {
        return (Map<?, ?>) ((Map<?, ?>) data.getValue()).get("data");
    }
}
