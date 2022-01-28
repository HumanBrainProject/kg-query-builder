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
import eu.ebrains.kg.queryBuilder.controller.IdController;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.reactive.function.BodyInserters;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class QueryClient {

    private final ServiceCall kg;

    private final IdController idController;

    public QueryClient(ServiceCall kg, IdController idController) {
        this.kg = kg;
        this.idController = idController;
    }

    public Map<?, ?> getQueries(@RequestParam("type") String type) {
        String relativeUrl = String.format("queries?type=%s", type);
        Map queriesResult = kg.client().get().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        List<Map<String, Object>> data = (List<Map<String, Object>>) queriesResult.get("data");
        data.forEach(query -> {
            UUID resolvedQueryId = idController.getSimplifyFullyQualifiedId(query);
            if (resolvedQueryId != null) {
                query.put("@id", resolvedQueryId.toString());
            }
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

    public ResponseEntity<Map<?, ?>> executeStoredQuery(String queryId,
                                        Integer from,
                                        Integer size,
                                        String vocab,
                                        String stage,
                                        List<String> restrictToSpaces) {
        String relativeUrl = String.format("queries/%s/instances?from=%s&size=%s&vocab=%s&stage=%s", queryId, from, size, vocab, stage);
        if (restrictToSpaces != null && !restrictToSpaces.isEmpty()) {
            List<String> encodedSpaces = restrictToSpaces.stream().map(space -> {
                try {
                    return encodeValue(space);
                } catch (UnsupportedEncodingException e) {
                    return null;
                }
            }).filter(Objects::nonNull).collect(Collectors.toList());
            if (encodedSpaces.size() != restrictToSpaces.size()) {
                return ResponseEntity.badRequest().build();
            }
            relativeUrl += String.format("&restrictToSpaces=%s", String.join(",", restrictToSpaces));
        }
        Map<?, ?> result =kg.client().get().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        return ResponseEntity.ok(result);
    }

    public ResponseEntity<Map<?, ?>> getQueryById(String queryId) {
        String relativeUrl = String.format("queries/%s", queryId);
        Map<?, ?> result = kg.client().get().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        if (result != null) {
            Map<String, Object> query = (Map<String, Object>) result.get("data");
            UUID resolvedQueryId = idController.getSimplifyFullyQualifiedId(query);
            if (resolvedQueryId != null) {
                query.put("@id", resolvedQueryId.toString());
            }
            List<Map<String, Object>> userList = (List<Map<String, Object>>) query.get(SchemaFieldsConstants.META_USER);
            if (!CollectionUtils.isEmpty(userList)) {
                Map<String, Object> user = userList.get(0);
                UUID userId = idController.getSimplifyFullyQualifiedId(user);
                if (userId != null) {
                    query.put(SchemaFieldsConstants.META_USER, userId.toString());
                }
            }
            return ResponseEntity.ok(query);
        }
        return ResponseEntity.notFound().build();
    }

    private String paramsToString(Map<String, String> map) throws UnsupportedEncodingException {
        StringBuilder mapAsString = new StringBuilder("");
        for (String key : map.keySet()) {
            mapAsString.append("&").append(encodeValue(key)).append("=").append(encodeValue(map.get(key)));
        }
        return mapAsString.toString();
    }

    private String encodeValue(String value) throws UnsupportedEncodingException {
        return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
    }

    public ResponseEntity<Map<?, ?>> executeQuery(
            Map<?, ?> query,
            String stage,
            Integer from,
            Integer size,
            String instanceId,
            Map<String, String> allRequestParams,
            List<String> restrictToSpaces) throws UnsupportedEncodingException {
        //Remove the non-dynamic parameters from the map
        allRequestParams.remove("stage");
        allRequestParams.remove("instanceId");
        allRequestParams.remove("from");
        allRequestParams.remove("size");
        String relativeUrl = String.format("queries?from=%d&size=%d&stage=%s%s", from, size, stage, paramsToString(allRequestParams));
        if (instanceId != null) {
            relativeUrl += String.format("&instanceId=%s", instanceId);
        }
        if (restrictToSpaces != null && !restrictToSpaces.isEmpty()) {
            List<String> encodedSpaces = restrictToSpaces.stream().map(space -> {
                try {
                    return encodeValue(space);
                } catch (UnsupportedEncodingException e) {
                    return null;
                }
            }).filter(Objects::nonNull).collect(Collectors.toList());
            if (encodedSpaces.size() != restrictToSpaces.size()) {
                return ResponseEntity.badRequest().build();
            }
            relativeUrl += String.format("&restrictToSpaces=%s", String.join(",", restrictToSpaces));
        }
        Map<?, ?> result = kg.client().post().uri(kg.url(relativeUrl))
                .body(BodyInserters.fromValue(query))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        return ResponseEntity.ok(result);
    }

    public void saveQuery(Map<?, ?> query, String queryId, String space) {
        String relativeUrl = String.format("queries/%s?space=%s", queryId, space);
        kg.client().put().uri(kg.url(relativeUrl))
                .body(BodyInserters.fromValue(query))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void deleteQuery(String queryId) {
        String relativeUrl = String.format("queries/%s", queryId);
        kg.client().delete().uri(kg.url(relativeUrl))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
