package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Configura la cadena de filtros de seguridad (Security Filter Chain).
     * Esta es la configuración principal de qué rutas están protegidas y cómo.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults()) // Habilitar CORS con configuración por defecto (busca un bean
                                                 // WebMvcConfigurer)
                // Deshabilitamos CSRF (Cross-Site Request Forgery) porque es una API REST
                // que será consumida por clientes no navegadores o clientes que manejan el
                // estado.
                .csrf(csrf -> csrf.disable())

                // Definimos las reglas de autorización para las peticiones HTTP
                .authorizeHttpRequests(auth -> auth
                        // .anyRequest().authenticated() asegura que CUALQUIER petición a la API
                        // requiera que el usuario esté autenticado. No hay rutas públicas.
                        .anyRequest().authenticated())

                // Habilitamos la autenticación básica HTTP (Header Authorization: Basic
                // base64(user:pass))
                // Es el mecanismo más simple para probar APIs.
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    /**
     * Configura el servicio de usuarios en memoria.
     * Aquí definimos usuarios "hardcodeados" para pruebas o desarrollo simple.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        // Creamos un usuario con el patrón Builder
        UserDetails user = User.builder()
                .username("admin")
                // {noop} indica "No Operation" para el encoding, es decir, texto plano.
                // Spring Security espera que las contraseñas tengan un identificador de
                // algoritmo.
                .password("{noop}1234")
                .roles("USER")
                .build();

        // Devolvemos el gestor de usuarios en memoria con nuestro usuario cargado
        return new InMemoryUserDetailsManager(user);
    }

    /**
     * Define el codificador de contraseñas.
     * DelegatingPasswordEncoder permite soportar múltiples formatos de encriptación
     * (bcrypt, scrypt, noop, etc.)
     * basándose en el prefijo de la contraseña (ej: {noop}, {bcrypt}).
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
