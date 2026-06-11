package com.aimarketing;

import com.aimarketing.config.AiServiceProperties;
import com.aimarketing.config.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtProperties.class, AiServiceProperties.class})
public class AiMarketingBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiMarketingBackendApplication.class, args);
    }
}
