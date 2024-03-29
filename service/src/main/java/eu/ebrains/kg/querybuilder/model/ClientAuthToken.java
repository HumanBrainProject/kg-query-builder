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

package eu.ebrains.kg.querybuilder.model;

public class ClientAuthToken {

    private final String clientToken;

    public ClientAuthToken(String clientToken) {
        this.clientToken = clientToken;
    }

    public String getBearerToken() {
        if (clientToken != null) {
            return clientToken.toLowerCase().startsWith("bearer ") ? clientToken : "Bearer " + clientToken;
        }
        return null;
    }

    public String getRawToken(){
        return clientToken!=null && clientToken.toLowerCase().startsWith("bearer ") ? clientToken.substring(7) : clientToken;
    }

}