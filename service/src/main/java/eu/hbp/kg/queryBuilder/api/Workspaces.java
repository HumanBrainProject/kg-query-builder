package eu.hbp.kg.queryBuilder.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.hbp.kg.queryBuilder.model.ServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private ObjectMapper objectMapper;


    @GetMapping
    public Map<?, ?> getWorkspaces(@RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationToken) {
        return WebClient.builder().build()
                .get()
                .uri(String.format("%s/spaces?stage=LIVE", kgCoreEndpoint))
                .headers(h -> {
                    h.add(HttpHeaders.AUTHORIZATION, authorizationToken);
                    h.add("Client-Authorization", "");
                })
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    @GetMapping("/{workspace}/types")
    public Map<?, ?> getWorkspaceTypes(@RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationToken, @PathVariable("workspace") String workspace) {
        return WebClient.builder().build()
                .get()
                .uri(String.format("%s/types?stage=LIVE&withProperties=true&workspace=%s", kgCoreEndpoint, workspace))
                .headers(h -> {
                    h.add(HttpHeaders.AUTHORIZATION, authorizationToken);
                    h.add("Client-Authorization", "");
                })
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

}
