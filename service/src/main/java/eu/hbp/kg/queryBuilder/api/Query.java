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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequestMapping("/query")
@RestController
public class Query {

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
         Map result = serviceCall.get(
                String.format("%s/%s/queries?type=%s", kgCoreEndpoint, apiVersion, type),
                authContext.getAuthTokens(),
                Map.class);
        if(result != null){
            List<Map<String, Object>> data = (List<Map<String, Object>>) result.get("data");
            data.forEach(d -> {
              String[] splitId = d.get("@id").toString().split("/");
              d.put("@id", splitId[splitId.length - 1]);
            });
            return result;
        }
        return Collections.emptyMap();
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
            @RequestParam("vocab") String vocab,
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

    @DeleteMapping("/{queryId}")
    public void deleteQuery(@PathVariable("queryId") String queryId) {
        serviceCall.delete(
                String.format("%s/%s/queries/%s", kgCoreEndpoint, apiVersion, queryId),
                authContext.getAuthTokens(),
                Void.class
        );
    }

}