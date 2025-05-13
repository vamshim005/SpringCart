package com.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("https://shop.vamshimaya.com", "https://shop.vamshimaya.com") // add all frontend ports you use
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
