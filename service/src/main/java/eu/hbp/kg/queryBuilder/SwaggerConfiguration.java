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
package eu.hbp.kg.queryBuilder;

import com.google.gson.*;
import org.springframework.boot.autoconfigure.gson.GsonBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.*;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.json.Json;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger.web.ApiKeyVehicle;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


@Configuration
@EnableSwagger2
public class SwaggerConfiguration {


    @Bean
    public GsonBuilder gsonBuilder(List<GsonBuilderCustomizer> customizers) {
        GsonBuilder builder = new GsonBuilder();
        customizers.forEach((c) -> c.customize(builder));
        return builder.registerTypeAdapter(springfox.documentation.spring.web.json.Json.class, new SpringfoxJsonToGsonAdapter());
    }

    public class SpringfoxJsonToGsonAdapter implements JsonSerializer<Json> {
        @Override
        public JsonElement serialize(springfox.documentation.spring.web.json.Json json, Type type, JsonSerializationContext context) {
            final JsonParser parser = new JsonParser();
            return parser.parse(json.value());
        }
    }




    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("KG Query Builder")
                .license("Apache 2.0")
                .licenseUrl("https://www.apache.org/licenses/LICENSE-2.0.html")
                .termsOfServiceUrl("https://kg.ebrains.eu")
                .version("1.0.0")
                .contact(new Contact("", "", "kg@ebrains.eu"))
                .build();
    }

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2).select()
                .apis(RequestHandlerSelectors.basePackage("eu.hbp.kg")).paths(PathSelectors.regex("^(?!/error).*"))
                .build().apiInfo(apiInfo()).securitySchemes(getSecuritySchemes()).securityContexts(Collections.singletonList(securityContext()));
    }

    private SecurityContext securityContext() {
        return SecurityContext.builder()
                .securityReferences(Collections.singletonList(new SecurityReference("HBP token", new AuthorizationScope[0])))
                .forPaths(PathSelectors.regex(".*"))
                .build();
    }

    List<GrantType> grantTypes() {
        GrantType grantType = new ImplicitGrantBuilder()
                .loginEndpoint(new LoginEndpoint("https://iam-dev.ebrains.eu/auth/realms/hbp/protocol/openid-connect/auth"))
                .build();
        return Arrays.asList(grantType);
    }

    @Bean
    public SecurityConfiguration securityInfo() {
        return new SecurityConfiguration("kg", "", "hbp", "HBP Knowledge Graph", "", ApiKeyVehicle.HEADER, "Authorization", ",");
    }

    private List<SecurityScheme> getSecuritySchemes() {
        return Collections.singletonList(new OAuthBuilder().name("HBP token").grantTypes(grantTypes()).build());
    }

}
