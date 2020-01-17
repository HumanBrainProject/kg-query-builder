package eu.hbp.kg.queryBuilder.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import eu.hbp.kg.queryBuilder.model.ServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;

class ExpiringToken {

    protected String token;
    private LocalDateTime expiryDate;

    public ExpiringToken() {
        this.token = null;
        this.expiryDate = LocalDateTime.now().minusYears(100);
    }

    public void setToken(String token, Long duration) {
        this.token = token;
        this.expiryDate = LocalDateTime.now().plusSeconds(duration);
    }

    public String getToken() {
        if (this.hasExpired()) {
            return null;
        }
        return this.token;
    }

    public boolean hasExpired() {
        return this.token == null || LocalDateTime.now().isAfter(this.expiryDate);
    }
}

@RequestMapping("/auth")
@RestController
@CacheConfig(cacheNames={"clientToken"})
public class Authentication {

    private Logger logger = LoggerFactory.getLogger(Authentication.class);

    @Autowired
    CacheManager cacheManager;

    @Value("${kgcore.endpoint}")
    String kgCoreEndpoint;

    @Value("${client.secret}")
    String clientSecret;


    @GetMapping("/endpoint")
    public Map<?, ?> getAuthEndpoint() {
        return WebClient.builder().build()
                .get()
                .uri(String.format("%s/users/authorization", kgCoreEndpoint))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    @Cacheable(value = "clientToken", unless = "#result.token==null")
    private ExpiringToken getClientExpiringToken() {

        ExpiringToken clientExpiringToken = new ExpiringToken();

        try {
            Map<?, ?> endPointResponse = WebClient.builder().build()
                    .get()
                    .uri(String.format("%s/users/authorization/tokenEndpoint", kgCoreEndpoint))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            Map<?, ?> endPointData = (Map<?, ?>) endPointResponse.get("data");
            String clientTokenEndPoint = endPointData.get("endpoint").toString();

            MultiValueMap<String, String> payload = new LinkedMultiValueMap<String, String>();
            payload.add("grant_type", "client_credentials");
            payload.add("client_id", ServiceClient.CLIENTID.getName());
            payload.add("client_secret", clientSecret);

            Map<?, ?> clientTokenResponse = WebClient.builder().build()
                    .post()
                    .uri(String.format("%s", clientTokenEndPoint))
                    .headers(h -> {
                        h.add(HttpHeaders.CACHE_CONTROL, CacheControl.noCache().getHeaderValue());
                        h.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE);
                    })
                    .body(BodyInserters.fromFormData(payload))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String clientToken = clientTokenResponse.get("access_token").toString();
            Long duration = Long.parseLong(clientTokenResponse.get("expires_in").toString());
            clientExpiringToken.setToken(clientToken, duration);
            logger.info(clientToken);
        } catch (WebClientException | NullPointerException e) {
            logger.error(e.getMessage());
        }

        return clientExpiringToken;
    }

    @GetMapping("/test")
    public String getClientToken() {
        ExpiringToken expiringToken = this.getClientExpiringToken();
        if (expiringToken.hasExpired()) {
            Objects.requireNonNull(cacheManager.getCache("clientToken")).clear();
            expiringToken = this.getClientExpiringToken();
        }
        return expiringToken.getToken();
    }
}
