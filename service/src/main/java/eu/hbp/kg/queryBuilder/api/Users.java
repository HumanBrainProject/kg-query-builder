package eu.hbp.kg.queryBuilder.api;

import eu.hbp.kg.queryBuilder.model.ServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@RequestMapping("/user")
@RestController
public class Users {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @GetMapping
    public Map<?,?> getUserProfile(@RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationToken) {
        return WebClient.builder().build().get().uri(String.format("%s/users/me", kgCoreEndpoint))
                .headers(h -> {
                    h.add(HttpHeaders.AUTHORIZATION, authorizationToken);
                    h.add("Client-Authorization", ServiceClient.kgeditor.toString());
                })
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

}
