package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración global de CORS (Cross-Origin Resource Sharing).
 * Esta configuración permite que clientes (como un frontend en
 * Angular/React/Vue)
 * que se ejecutan en un dominio/puerto diferente puedan consumir la API.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todos los endpoints de la API
                // Usamos allowedOriginPatterns en lugar de allowedOrigins para ser compatible
                // con allowCredentials(true)
                // y permitir comodines más flexibles.
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH") // Métodos HTTP permitidos
                .allowedHeaders("*") // Permite todos los headers (Authorization, Content-Type, etc.)
                .allowCredentials(true); // Permite enviar cookies o credenciales de autenticación
    }
}
