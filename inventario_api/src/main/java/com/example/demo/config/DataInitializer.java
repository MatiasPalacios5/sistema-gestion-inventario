package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final com.example.demo.repository.CategoriaRepository categoriaRepository;
        private final com.example.demo.repository.MarcaRepository marcaRepository;
        private final com.example.demo.repository.ProductoRepository productoRepository;

        public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
                        com.example.demo.repository.CategoriaRepository categoriaRepository,
                        com.example.demo.repository.MarcaRepository marcaRepository,
                        com.example.demo.repository.ProductoRepository productoRepository) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.categoriaRepository = categoriaRepository;
                this.marcaRepository = marcaRepository;
                this.productoRepository = productoRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                // Verificar si existe usuario admin, si no crearlo
                // Forzar recreación de usuario admin para aplicar nuevos roles y encoding
                userRepository.findByUsername("admin").ifPresent(user -> {
                        userRepository.delete(user);
                        System.out.println("Usuario admin existente eliminado para recreación.");
                });

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("password"));
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);
                System.out.println("Usuario admin RE-CREADO con password encriptada y ROLE_ADMIN.");

                // Crear/Buscar Categorías
                com.example.demo.model.Categoria elec = categoriaRepository.findByNombre("Electrónica")
                                .orElseGet(() -> categoriaRepository
                                                .save(new com.example.demo.model.Categoria("Electrónica")));
                com.example.demo.model.Categoria herr = categoriaRepository.findByNombre("Herramientas")
                                .orElseGet(() -> categoriaRepository
                                                .save(new com.example.demo.model.Categoria("Herramientas")));
                com.example.demo.model.Categoria hogar = categoriaRepository.findByNombre("Hogar")
                                .orElseGet(() -> categoriaRepository
                                                .save(new com.example.demo.model.Categoria("Hogar")));

                // Crear/Buscar Marcas
                com.example.demo.model.Marca samsung = marcaRepository.findByNombre("Samsung")
                                .orElseGet(() -> marcaRepository.save(new com.example.demo.model.Marca("Samsung")));
                com.example.demo.model.Marca bosch = marcaRepository.findByNombre("Bosch")
                                .orElseGet(() -> marcaRepository.save(new com.example.demo.model.Marca("Bosch")));
                com.example.demo.model.Marca generico = marcaRepository.findByNombre("Genérico")
                                .orElseGet(() -> marcaRepository.save(new com.example.demo.model.Marca("Genérico")));

                // Crear productos de prueba si no existen (podríamos verificar si la lista está
                // vacía)
                if (productoRepository.count() == 0) {
                        com.example.demo.model.Producto p1 = new com.example.demo.model.Producto("Smart TV 55",
                                        new java.math.BigDecimal("600.00"), 10);
                        p1.setPrecioCosto(400.00);
                        p1.setCategoria(elec);
                        p1.setMarca(samsung);
                        productoRepository.save(p1);

                        com.example.demo.model.Producto p2 = new com.example.demo.model.Producto("Taladro Percutor",
                                        new java.math.BigDecimal("120.00"), 15);
                        p2.setPrecioCosto(80.00);
                        p2.setCategoria(herr);
                        p2.setMarca(bosch);
                        productoRepository.save(p2);

                        com.example.demo.model.Producto p3 = new com.example.demo.model.Producto("Mesa Ratona",
                                        new java.math.BigDecimal("50.00"), 5);
                        p3.setPrecioCosto(20.00);
                        p3.setCategoria(hogar);
                        p3.setMarca(generico);
                        productoRepository.save(p3);

                        System.out.println("Productos de prueba creados.");
                }
        }
}
