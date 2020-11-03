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

import eu.hbp.kg.queryBuilder.constants.SchemaFieldsConsts;
import eu.hbp.kg.queryBuilder.controller.ServiceCallWithClientSecret;
import eu.hbp.kg.queryBuilder.model.AuthContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.print.attribute.standard.Media;
import java.util.Base64;
import java.util.Map;

@RequestMapping("/user")
@RestController
public class Users {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Value("${api.version}")
    String apiVersion;

    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    @GetMapping
    public Map<?, ?> getUserProfile() {
        Map<String, Object> result = serviceCall.get(
                String.format("%s/%s/users/me", kgCoreEndpoint, apiVersion),
                authContext.getAuthTokens(),
                Map.class);
//        Map<String, Object> data = (Map<String, Object>) result.get("data");
//        String userId = data.get(SchemaFieldsConsts.USER_ID).toString();
//        String userPicture = serviceCall.get(
//                String.format("%s/%s/users/%s/picture", kgCoreEndpoint, apiVersion, userId),
//                authContext.getAuthTokens(),
//                String.class);
//        data.put(SchemaFieldsConsts.USER_PICTURE, userPicture);
        return result;
    }

}
