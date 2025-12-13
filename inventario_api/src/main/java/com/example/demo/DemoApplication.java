package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada principal para la aplicación Spring Boot de Inventario API.
 * <p>
 * 
 * @SpringBootApplication es una anotación de conveniencia que agrega:
 *                        - @Configuration: Permite registrar beans extra en el
 *                        contexto o importar otras clases de configuración.
 *                        - @EnableAutoConfiguration: Habilita el mecanismo de
 *                        configuración automática de Spring Boot.
 *                        - @ComponentScan: Habilita el escaneo de componentes
 *                        (@Component, @Service, @Repository, @Controller) en el
 *                        paquete actual y subpaquetes.
 */
@SpringBootApplication
public class DemoApplication {

	/**
	 * Método main que inicia la ejecución de la aplicación.
	 * 
	 * @param args Argumentos de línea de comandos.
	 */
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
