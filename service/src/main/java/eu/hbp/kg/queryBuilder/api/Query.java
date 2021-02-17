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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static eu.hbp.kg.queryBuilder.constants.SchemaFieldsConsts.META_USER;
import static eu.hbp.kg.queryBuilder.constants.SchemaFieldsConsts.USER_PICTURE;

@RequestMapping("/query")
@RestController
public class Query {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Value("${api.version}")
    String apiVersion;

    @Autowired
    private ServiceCallWithClientSecret serviceCall;

    @Autowired
    private AuthContext authContext;

    @GetMapping
    public Map<?, ?> getQueries(@RequestParam("type") String type) {
        Map queriesResult = serviceCall.get(
                String.format("%s/%s/queries?type=%s", kgCoreEndpoint, apiVersion, type),
                authContext.getAuthTokens(),
                Map.class);
        List<Map<String, Object>> data = (List<Map<String, Object>>) queriesResult.get("data");
        data.forEach(query -> {
            String[] splitQueryId = query.get("@id").toString().split("/");
            String queryId = splitQueryId[splitQueryId.length - 1];
            query.put("@id", queryId);
        });
        return queriesResult;
//        if(queriesResult != null){ //TODO: Fetch user info from new alternatives endpoint (not ready yet)
//            List<Map<String, Object>> data = (List<Map<String, Object>>) queriesResult.get("data");
//            List<String> userIds = data.stream().map(query -> {
//                String[] splitQueryId = query.get("@id").toString().split("/");
//                String queryId = splitQueryId[splitQueryId.length - 1];
//                query.put("@id", queryId);
//                Map<String, Object> user = (Map<String, Object>) query.get(META_USER);
//                String[] splitUserId = user.get("@id").toString().split("/");
//                String userId = splitUserId[splitUserId.length - 1];
//                user.put("@id", userId);
//              return userId;
//            }).distinct().collect(Collectors.toList());
//            try {
//                Map<String, String> picturesResult = serviceCall.post(
//                        String.format("%s/%s/users/pictures", kgCoreEndpoint, apiVersion),
//                        userIds,
//                        authContext.getAuthTokens(),
//                        Map.class);
//                if(picturesResult != null) {
//                    data.forEach(query -> {
//                        Map<String, Object> user = (Map<String, Object>) query.get(META_USER);
//                        String userId = (String) user.get("@id");
//                        String picture = picturesResult.get(userId);
//                        if (picture != null) {
//                            user.put(USER_PICTURE, picture);
//                        }
//                    });
//                }
//            } catch (RuntimeException e) {
//                logger.info(String.format("Could not fetch users' pictures. Error:\n%s\n", e.getMessage()));
//            }
//            return queriesResult;
//        }
//        return Collections.emptyMap();
    }

    @GetMapping("/{workspace}/{queryId}")
    public Map<?, ?> executeQueryWithQueryId(@PathVariable("workspace") String workspace,
                                             @PathVariable("queryId") String queryId,
                                             @RequestParam("from") Integer from,
                                             @RequestParam("size") Integer size,
                                             @RequestParam("vocab") String vocab,
                                             @RequestParam("stage") String stage) {
        return serviceCall.get(
                String.format("%s/%s/queries/%s/instances?space=%s&from=%s&size=%s&vocab=%s&stage=%s", kgCoreEndpoint, apiVersion, queryId, workspace, from, size, vocab, stage),
                authContext.getAuthTokens(),
                Map.class);
    }

    @PostMapping
    public Map<?, ?> executeQuery(
            @RequestBody Map<?, ?> query,
            @RequestParam("from") Integer from,
            @RequestParam("size") Integer size,
            @RequestParam(value = "vocab", required = false) String vocab,
            @RequestParam("stage") String stage) {
        return serviceCall.post(
                String.format("%s/%s/queries?from=%d&size=%d&vocab=%s&stage=%s", kgCoreEndpoint, apiVersion, from, size, vocab, stage),
                query,
                authContext.getAuthTokens(),
                Map.class);
    }

    @PutMapping("/{workspace}/{queryId}")
    public void saveQuery(@RequestBody Map<?, ?> query, @PathVariable("workspace") String workspace, @PathVariable("queryId") String queryId) {
        serviceCall.put(
                String.format("%s/%s/queries/%s?space=%s", kgCoreEndpoint, apiVersion, queryId, workspace),
                query,
                authContext.getAuthTokens(),
                Void.class
        );
    }

    @DeleteMapping("/{workspace}/{queryId}")
    public void deleteQuery(@PathVariable("workspace") String workspace, @PathVariable("queryId") String queryId) {
        serviceCall.delete(
                String.format("%s/%s/queries/%s?space=%s", kgCoreEndpoint, apiVersion, queryId, workspace),
                authContext.getAuthTokens(),
                Void.class
        );
    }

}