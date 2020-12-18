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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequestMapping("/workspaces")
@RestController
public class Workspaces {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Value("${api.version}")
    String apiVersion;

    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    @GetMapping
    public Map<?, ?> getWorkspaces() {
        return serviceCall.get(
                String.format("%s/%s/spaces?stage=IN_PROGRESS", kgCoreEndpoint, apiVersion),
                authContext.getAuthTokens(),
                Map.class);
    }

}
