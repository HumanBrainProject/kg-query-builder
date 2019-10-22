package eu.hbp.kg.queryBuilder.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@RequestMapping("/auth")
@RestController
public class Authentication {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;


    @GetMapping("/endpoint")
    public Map<?,?> getAuthEndpoint() {
        return WebClient.builder().build().get().uri(String.format("%s/users/authorization", kgCoreEndpoint))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

}
