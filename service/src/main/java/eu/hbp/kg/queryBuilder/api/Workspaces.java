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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RequestMapping("/workspaces")
@RestController
public class Workspaces {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    @GetMapping
    public Map<?, ?> getWorkspaces() {
        return serviceCall.get(
                String.format("%s/spaces?stage=LIVE", kgCoreEndpoint),
                authContext.getAuthTokens(),
                Map.class);
    }

    @GetMapping("/{workspace}/types")
    public Map<?, ?> getWorkspaceTypes(@PathVariable("workspace") String workspace) {
        return serviceCall.get(
                String.format("%s/types?stage=LIVE&withProperties=true&workspace=%s", kgCoreEndpoint, workspace),
                authContext.getAuthTokens(),
                Map.class);
    }

}
