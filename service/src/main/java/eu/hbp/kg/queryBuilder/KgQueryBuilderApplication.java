package eu.hbp.kg.queryBuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class KgQueryBuilderApplication {

    public static void main(String[] args) {
        SpringApplication.run(KgQueryBuilderApplication.class, args);
    }

}
