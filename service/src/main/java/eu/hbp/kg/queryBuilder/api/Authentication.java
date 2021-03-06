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
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RequestMapping("/auth")
@RestController
public class Authentication {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Value("${api.version}")
    String apiVersion;

    @Value("${eu.ebrains.kg.commit}")
    String commit;

    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    @GetMapping("/endpoint")
    public Map<?, ?> getAuthEndpoint() {
        Map data = serviceCall.get(
                String.format("%s/%s/users/authorization", kgCoreEndpoint, apiVersion),
                authContext.getAuthTokens(),
                Map.class);
        if(StringUtils.isNotBlank(commit)) {
            data.put("commit", commit);
        }
        return data;
    }
}
