package com.example.demo.config;

import com.example.demo.model.Categoria;
import com.example.demo.model.Marca;
import com.example.demo.model.Producto;
import com.example.demo.model.Venta;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.MarcaRepository;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer {

        @Bean
        @Transactional
        CommandLineRunner initData(
                        ProductoRepository productoRepository,
                        VentaRepository ventaRepository,
                        MarcaRepository marcaRepository,
                        CategoriaRepository categoriaRepository) {
                return args -> {
                        // Limpieza total
                        ventaRepository.deleteAll();
                        productoRepository.deleteAll();
                        marcaRepository.deleteAll();
                        categoriaRepository.deleteAll();

                        // 1. Crear Categorías
                        Categoria catPerifericos = new Categoria("Periféricos");
                        Categoria catMonitores = new Categoria("Monitores");
                        Categoria catLaptops = new Categoria("Laptops");
                        Categoria catAudio = new Categoria("Audio");
                        Categoria catCables = new Categoria("Cables y Adaptadores");

                        List<Categoria> categorias = Arrays.asList(catPerifericos, catMonitores, catLaptops, catAudio,
                                        catCables);
                        categoriaRepository.saveAll(categorias);

                        // 2. Crear Marcas
                        Marca marLogitech = new Marca("Logitech");
                        Marca marDell = new Marca("Dell");
                        Marca marApple = new Marca("Apple");
                        Marca marSamsung = new Marca("Samsung");
                        Marca marHyperX = new Marca("HyperX");
                        Marca marGeneric = new Marca("Genérico");

                        List<Marca> marcas = Arrays.asList(marLogitech, marDell, marApple, marSamsung, marHyperX,
                                        marGeneric);
                        marcaRepository.saveAll(marcas);

                        // 3. Crear Productos con Costos Realistas (aprox 60% del precio venta)
                        List<Producto> productos = new ArrayList<>();

                        productos.add(crearProducto("Teclado Logitech K380", 45000.0, 15, marLogitech, catPerifericos));
                        productos.add(crearProducto("Mouse Logitech M280", 35000.0, 20, marLogitech, catPerifericos));
                        productos.add(crearProducto("Mouse Logitech MX Master 3S", 120000.0, 8, marLogitech,
                                        catPerifericos));

                        productos.add(crearProducto("Monitor Dell 24", 350000.0, 5, marDell, catMonitores));
                        productos.add(crearProducto("Monitor Samsung Curvo 27", 450000.0, 4, marSamsung, catMonitores));

                        productos.add(crearProducto("MacBook Air M1", 1200000.0, 3, marApple, catLaptops));
                        productos.add(crearProducto("Dell XPS 13", 1500000.0, 2, marDell, catLaptops));

                        productos.add(crearProducto("Auriculares HyperX Cloud II", 110000.0, 10, marHyperX, catAudio));
                        productos.add(crearProducto("AirPods Pro 2", 320000.0, 6, marApple, catAudio));
                        productos.add(crearProducto("Parlante JBL Go 3", 55000.0, 12, marGeneric, catAudio)); // Usando
                                                                                                              // genérico
                                                                                                              // para
                                                                                                              // JBL por
                                                                                                              // simplicidad

                        productos.add(crearProducto("Cable HDMI 2.1", 25000.0, 50, marGeneric, catCables));
                        productos.add(crearProducto("Adaptador USB-C a HDMI", 18000.0, 30, marGeneric, catCables));
                        productos.add(crearProducto("Funda Silicone Case", 18000.0, 25, marGeneric, catPerifericos));
                        productos.add(crearProducto("Soporte Notebook", 45000.0, 15, marGeneric, catPerifericos));
                        productos.add(crearProducto("Webcam Logitech C920", 85000.0, 7, marLogitech, catPerifericos));
                        productos.add(crearProducto("Teclado Mecánico HyperX Alloy", 140000.0, 5, marHyperX,
                                        catPerifericos));

                        productoRepository.saveAll(productos);

                        // Recargar productos para tener sus IDs generados
                        List<Producto> productosGuardados = productoRepository.findAll();

                        // 4. Crear Historial de Ventas Variado
                        LocalDateTime hoy = LocalDateTime.now();
                        List<Venta> ventas = new ArrayList<>();

                        // Helper para buscar producto por nombre aproximado
                        Producto tecK380 = buscarProd(productosGuardados, "K380");
                        Producto funda = buscarProd(productosGuardados, "Funda");
                        Producto hdmi = buscarProd(productosGuardados, "HDMI");
                        Producto mouseM280 = buscarProd(productosGuardados, "M280");
                        Producto soporte = buscarProd(productosGuardados, "Soporte");
                        Producto monitor = buscarProd(productosGuardados, "Dell 24");

                        // Ventas de hoy
                        ventas.add(crearVenta(tecK380, 2, hoy));
                        ventas.add(crearVenta(funda, 5, hoy));

                        // Ventas de ayer
                        ventas.add(crearVenta(hdmi, 3, hoy.minusDays(1)));
                        ventas.add(crearVenta(mouseM280, 1, hoy.minusDays(1)));

                        // Ventas semana pasada
                        ventas.add(crearVenta(hdmi, 10, hoy.minusDays(5)));
                        ventas.add(crearVenta(soporte, 2, hoy.minusDays(7)));

                        // Ventas mes pasado
                        ventas.add(crearVenta(hdmi, 5, hoy.minusDays(30)));
                        ventas.add(crearVenta(monitor, 1, hoy.minusMonths(1).minusDays(2)));

                        ventaRepository.saveAll(ventas);

                        System.out.println("=== DATOS INICIALIZADOS CON INTEGRIDAD FINANCIERA ===");
                        System.out.println("Productos creados: " + productos.size());
                        System.out.println("Ventas creadas: " + ventas.size());
                };
        }

        private Producto crearProducto(String nombre, double precioVenta, int stock, Marca marca, Categoria categoria) {
                Producto p = new Producto();
                p.setNombre(nombre);
                p.setPrecio(BigDecimal.valueOf(precioVenta));
                p.setStock(stock);
                p.setMarca(marca);
                p.setCategoria(categoria);

                // Costo aprox 60%
                double costo = precioVenta * 0.60;
                p.setPrecioCosto(costo);

                return p;
        }

        private Venta crearVenta(Producto p, int cantidad, LocalDateTime fecha) {
                if (p == null)
                        return null; // Safety check

                double precioUnitario = p.getPrecio().doubleValue();
                double total = precioUnitario * cantidad;

                Venta v = new Venta();
                v.setNombreProducto(p.getNombre());
                v.setProductoId(p.getId());
                v.setCantidadVendida(cantidad);
                v.setPrecioUnitario(precioUnitario);
                v.setMontoTotal(total);
                v.setCostoUnitario(p.getPrecioCosto());
                v.setFechaVenta(fecha);
                return v;
        }

        private Producto buscarProd(List<Producto> productos, String query) {
                return productos.stream()
                                .filter(p -> p.getNombre().contains(query))
                                .findFirst()
                                .orElse(null);
        }
}
