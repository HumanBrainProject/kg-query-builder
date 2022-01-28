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

import eu.ebrains.kg.queryBuilder.service.QueryClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

@RequestMapping("/queries")
@RestController
public class Queries {

    private final QueryClient queryClient;

    public Queries(QueryClient queryClient) {
        this.queryClient = queryClient;
    }

    @GetMapping
    public Map<?, ?> getQueries(@RequestParam("type") String type) {
        return queryClient.getQueries(type);
    }

    @GetMapping("/{queryId}/instances")
    public ResponseEntity<Map<?, ?>> executeStoredQuery(@PathVariable("queryId") String queryId,
                                        @RequestParam("from") Integer from,
                                        @RequestParam("size") Integer size,
                                        @RequestParam("vocab") String vocab,
                                        @RequestParam("stage") String stage,
                                        @RequestParam(value = "restrictToSpaces", required = false) List<String> restrictToSpaces) {
        return queryClient.executeStoredQuery(queryId, from, size, vocab, stage, restrictToSpaces);
    }

    @GetMapping("/{queryId}")
    public ResponseEntity<Map<?, ?>> getQueryById(@PathVariable("queryId") String queryId) {
        return queryClient.getQueryById(queryId);
    }

    @PostMapping
    public ResponseEntity<Map<?, ?>> executeQuery(
            @RequestBody Map<?, ?> query,
            @RequestParam("stage") String stage,
            @RequestParam("from") Integer from,
            @RequestParam("size") Integer size,
            @RequestParam(value = "instanceId", required = false) String instanceId,
            @RequestParam(defaultValue = "{}") Map<String, String> allRequestParams,
            @RequestParam(value = "restrictToSpaces", required = false) List<String> restrictToSpaces) throws UnsupportedEncodingException {
        return queryClient.executeQuery(query, stage, from, size, instanceId, allRequestParams, restrictToSpaces);
    }

    @PutMapping("/{queryId}")
    public void saveQuery(@RequestBody Map<?, ?> query, @PathVariable("queryId") String queryId, @RequestParam(value = "space", required = false) String space) {
        queryClient.saveQuery(query, queryId, space);
    }

    @DeleteMapping("/{queryId}")
    public void deleteQuery(@PathVariable("queryId") String queryId) {
        queryClient.deleteQuery(queryId);
    }

}