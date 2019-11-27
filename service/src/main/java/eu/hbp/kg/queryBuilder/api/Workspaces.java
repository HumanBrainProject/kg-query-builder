package eu.hbp.kg.queryBuilder.api;

import eu.hbp.kg.queryBuilder.model.ServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@RequestMapping("/workspaces")
@RestController
public class Workspaces {

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;


    @GetMapping
    public Map<?, ?> getWorkspaces(@RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationToken) {
        return WebClient.builder().build()
                .get()
                .uri(String.format("%s/spaces?stage=LIVE", kgCoreEndpoint))
                .headers(h -> {
                    h.add(HttpHeaders.AUTHORIZATION, authorizationToken);
                    h.add("Client-Authorization", ServiceClient.kgeditor.toString());
                })
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

}
