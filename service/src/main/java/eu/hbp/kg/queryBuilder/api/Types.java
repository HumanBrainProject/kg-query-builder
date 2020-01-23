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

import java.lang.reflect.Type;
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

    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    private Map<?, ?> getData(Map.Entry data) {
        return (Map<?, ?>)((Map<?, ?>) data.getValue()).get("data");
    }

    @PostMapping
    public Map<?, ?> getTypesByName(@RequestBody List<String> payload) {
        Map result = serviceCall.post(
                String.format("%s/typesByName?stage=LIVE&withProperties=true", kgCoreEndpoint),
                payload,
                authContext.getAuthTokens(),
                Map.class);
        if(result != null){
            Map<?, ?> data = (Map<?, ?>) result.get("data");
            return data.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, d -> TypeEntity.fromMap(this.getData(d))));
        }
        return Collections.emptyMap();
    }

}



