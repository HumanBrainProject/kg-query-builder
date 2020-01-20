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

package eu.hbp.kg.queryBuilder.controller;

import eu.hbp.kg.queryBuilder.service.AbstractServiceCall;
import eu.hbp.kg.queryBuilder.model.AuthTokens;
import eu.hbp.kg.queryBuilder.model.ClientAuthToken;
import eu.hbp.kg.queryBuilder.service.KeycloakSvc;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class ServiceCallWithClientSecret extends AbstractServiceCall {

    //It's ok that this is shared in a singleton -> we only have one client token application-wide
    private ClientAuthToken token;

    private final KeycloakSvc keycloakSvc;
    private final String clientId;
    private final String clientSecret;

    public ServiceCallWithClientSecret(KeycloakSvc keycloakSvc, @Value("${client.id}") String clientId, @Value("${client.secret}") String clientSecret) {
        super(WebClient.builder());
        this.keycloakSvc = keycloakSvc;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private synchronized ClientAuthToken refreshToken(){
        String token = keycloakSvc.getToken(this.clientId, this.clientSecret);
        return token == null ? null : new ClientAuthToken(token);
    }

    private ClientAuthToken getToken(boolean forceRefresh){
        if(token == null || forceRefresh){
            token = refreshToken();
        }
        return token;
    }

    @Override
    protected <T> T sendRequest(WebClient.RequestHeadersSpec<?> spec, MediaType mediaType, AuthTokens authContext, Class<T> returnType) {
        try {
            ClientAuthToken token = getToken(false);
            authContext.setClientAuthToken(token);
            return super.sendRequest(spec, mediaType, authContext, returnType);
        }
        catch(WebClientResponseException e){
            if(e.getStatusCode() == HttpStatus.UNAUTHORIZED){
                //If we receive an unauthorized error, we refresh the token and retry once.
                ClientAuthToken token = getToken(true);
                authContext.setClientAuthToken(token);
                return super.sendRequest(spec, mediaType, authContext, returnType);
            }
            else {
                throw e;
            }
        }

    }
}