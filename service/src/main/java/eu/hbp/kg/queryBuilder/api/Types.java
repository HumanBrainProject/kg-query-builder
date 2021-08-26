/*
 * Copyright 2020 EPFL/Human Brain Project PCO
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package eu.hbp.kg.queryBuilder.api;

import eu.hbp.kg.queryBuilder.controller.ServiceCallWithClientSecret;
import eu.hbp.kg.queryBuilder.model.AuthContext;
import eu.hbp.kg.queryBuilder.model.TypeEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequestMapping("/types")
@RestController
public class Types {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Value("${api.version}")
    String apiVersion;


    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    private Map<?, ?> getData(Map.Entry data) {
        return (Map<?, ?>) ((Map<?, ?>) data.getValue()).get("data");
    }

    @GetMapping
    public List<TypeEntity> getTypes() {
        Map result = serviceCall.get(
                String.format("%s/%s/types?stage=IN_PROGRESS&withProperties=true&withIncomingLinks=true&withCounts=false", kgCoreEndpoint, apiVersion),
                authContext.getAuthTokens(),
                Map.class);
        if (result != null) {
            Object data = result.get("data");
            if (data instanceof Collection) {
                return ((Collection<?>) data).stream().filter(d -> d instanceof Map).map(d -> (Map<?, ?>) d).map(TypeEntity::fromMap).collect(Collectors.toList());
            }
        }
        return Collections.emptyList();
    }

    @PostMapping
    public Map<?, ?> getTypesByName(@RequestBody List<String> payload) {
        Map result = serviceCall.post(
                String.format("%s/%s/typesByName?stage=IN_PROGRESS&withProperties=true&withIncomingLinks=true", kgCoreEndpoint, apiVersion),
                payload,
                authContext.getAuthTokens(),
                Map.class);
        if (result != null) {
            Map<?, ?> data = (Map<?, ?>) result.get("data");
            return data.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, d -> TypeEntity.fromMap(this.getData(d))));
        }
        return Collections.emptyMap();
    }

}



