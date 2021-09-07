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

package eu.ebrains.kg.queryBuilder.api;

import eu.ebrains.kg.queryBuilder.model.KGCoreResult;
import eu.ebrains.kg.queryBuilder.service.AuthClient;
import eu.ebrains.kg.queryBuilder.model.AuthContext;
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

    private final AuthClient authClient;

    public Authentication(AuthClient authClient) {
        this.authClient = authClient;
    }

    @GetMapping("/endpoint")
    public KGCoreResult.Single getAuthEndpoint() {
        KGCoreResult.Single response = authClient.getEndpoint();
//        Map<String, Object> data = response.getData();
//        if(StringUtils.isNotBlank(sentryUrl)) {
//            data.put("sentryUrl", sentryUrl);
//        }
//        if(StringUtils.isNotBlank(commit)) {
//            data.put("commit", commit);
//        }
        return response;
    }
}
