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

package eu.ebrains.kg.queryBuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableAutoConfiguration
@ComponentScan
public class KgQueryBuilderApplication extends WebSecurityConfigurerAdapter {

    public static void main(String[] args) {
        SpringApplication.run(KgQueryBuilderApplication.class, args);
    }

    @SuppressWarnings("java:S4502") //We suppress the csrf disable warning because we have a stateless, token-base API (also see https://www.baeldung.com/spring-security-csrf#stateless-spring-api ).
    protected void configure(HttpSecurity http) throws Exception {
        /**
         *  The http security is quite simple here because we're just fast-forwarding the token
         *  ( {@link eu.ebrains.kg.service.configuration.OauthClient ) to KG core and
         *  let this one manage the access permissions....
         */
        http.csrf().disable();
        http.authorizeRequests(a -> a.anyRequest().permitAll());
    }

}