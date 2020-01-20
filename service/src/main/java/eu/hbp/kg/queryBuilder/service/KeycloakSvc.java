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

package eu.hbp.kg.queryBuilder.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;

import java.util.Map;

@Component
public class KeycloakSvc {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    private Logger logger = LoggerFactory.getLogger(KeycloakSvc.class);

    private String endpoint;

    private String getEndpoint() {
        if (endpoint == null) {
            endpoint = this.getTokenEndpoint();
        }
        return endpoint;
    }

    public String getTokenEndpoint(){
        String clientTokenEndPoint = null;
        try {
            Map<?, ?> endPointResponse = WebClient.builder().build()
                    .get()
                    .uri(String.format("%s/users/authorization/tokenEndpoint", kgCoreEndpoint))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            Map<?, ?> endPointData = (Map<?, ?>) endPointResponse.get("data");
            clientTokenEndPoint = endPointData.get("endpoint").toString();
        } catch (WebClientException | NullPointerException e) {
            logger.error(e.getMessage());
        }
        return clientTokenEndPoint;
    }

    public String getToken(String clientId, String clientSecret) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        Map<?,?> result = WebClient.builder().build()
                .post()
                .uri(getEndpoint())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .accept(MediaType.APPLICATION_JSON)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        return result.get("access_token") instanceof String ? (String)result.get("access_token") : null;
    }
}