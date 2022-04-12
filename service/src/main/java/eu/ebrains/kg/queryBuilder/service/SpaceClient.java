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
import eu.ebrains.kg.queryBuilder.model.Permissions;
import eu.ebrains.kg.queryBuilder.model.TypeEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class SpaceClient {

    private final ServiceCall kg;

    public SpaceClient(ServiceCall kg) {
        this.kg = kg;
    }

    public Map<?, ?> getSpaces() {
        String relativeUrl = "spaces?permissions=true";
        Map<String, ?> response = kg.client().get().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        final List<Map<String, ?>> data = response == null ? Collections.emptyList() : (List<Map<String, ?>>) response.get("data");
        List<Map<String, Object>> spaces = data == null ? Collections.emptyList() : data.stream()
                .filter(space -> {
                            boolean isInternalSpace = space.containsKey(SchemaFieldsConstants.META_INTERNAL_SPACE) && ((boolean) space.get(SchemaFieldsConstants.META_INTERNAL_SPACE));
                            boolean canRead = false;
                            if (space.containsKey(SchemaFieldsConstants.META_PERMISSIONS)) {
                                List<String> permissions = (List<String>) space.get(SchemaFieldsConstants.META_PERMISSIONS);
                                canRead = permissions.contains("READ_QUERY");
                            }
                            return !isInternalSpace && canRead;
                        }
                )
                .map(space -> {
                    Map<String, Object> s = new HashMap<>();
                    s.put("name", space.get(SchemaFieldsConstants.NAME));
                    List<String> permissionList = (List<String>) space.get(SchemaFieldsConstants.META_PERMISSIONS);
                    Permissions permissions = Permissions.fromPermissionList(permissionList);
                    s.put("isPrivate", "myspace".equals(space.get(SchemaFieldsConstants.NAME)));
                    s.put("permissions", permissions);
                    return s;
                })
                .sorted(new Comparator<Map<String, Object>>() {
                    @Override
                    public int compare(Map<String, Object> space1, Map<String, Object> space2) {
                        String spaceName1 = (String) space1.get("name");
                        String spaceName2 = (String) space2.get("name");
                        return spaceName1.compareTo(spaceName2);
                    }
                })
                .collect(Collectors.toList());
        Map<String, Object> result = new HashMap<>();
        result.put("data", spaces);
        result.put("size", spaces.size());
        result.put("total", spaces.size());
        return result;
    }
}
