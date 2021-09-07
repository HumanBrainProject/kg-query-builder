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

import eu.ebrains.kg.queryBuilder.controller.IdController;
import eu.ebrains.kg.queryBuilder.model.KGCoreResult;
import eu.ebrains.kg.queryBuilder.model.UserProfile;
import eu.ebrains.kg.queryBuilder.service.UserClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/user")
@RestController
public class Users {

    private final IdController idController;
    private final UserClient userClient;

    public Users(IdController idController, UserClient userClient) {
        this.idController = idController;
        this.userClient = userClient;
    }

    @GetMapping
    public KGCoreResult<UserProfile> getUserProfile() {
        UserProfile userProfile = userClient.getUserProfile();
        if(userProfile!=null) {
            UUID uuid = idController.simplifyFullyQualifiedId(userProfile.getId());
            if(uuid!=null) {
                userProfile.setId(uuid.toString());
            }
            Map<?, ?> userPictures = userClient.getUserPictures(Collections.singletonList(userProfile.getId()));
            if (userPictures != null && userPictures.get(userProfile.getId()) != null) {
                userProfile.setPicture(userPictures.get(userProfile.getId()).toString());
            }
            return new KGCoreResult<UserProfile>().setData(userProfile);
        }
        return null;
    }

}
