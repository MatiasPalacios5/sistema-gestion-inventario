package com.example.demo.service;

import com.example.demo.model.Producto;
import com.example.demo.model.Venta;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final ProductoRepository productoRepository;

    public VentaServiceImpl(VentaRepository ventaRepository, ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Venta> obtenerTodas() {
        return ventaRepository.findAll();
    }

    @Override
    @Transactional
    public void eliminarVenta(Long id) {
        // 1. Obtener la venta
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con ID: " + id));

        // 2. Intentar restaurar el stock del producto
        if (venta.getProductoId() != null) {
            // Si tenemos el ID, buscamos directamente
            productoRepository.findById(venta.getProductoId()).ifPresent(producto -> {
                reponerStock(producto, venta.getCantidadVendida());
            });
        } else {
            // Si es un dato histórico sin ID, intentamos buscar por nombre (best effort)
            // Cuidado: findByNombreContainingIgnoreCase devuelve una lista, tomamos el
            // primero si hay match exacto o asumimos riesgo
            List<Producto> productos = productoRepository.findByNombreContainingIgnoreCase(venta.getNombreProducto());
            // Filtramos para ver si hay un match exacto de nombre para ser más seguros
            productos.stream()
                    .filter(p -> p.getNombre().equalsIgnoreCase(venta.getNombreProducto()))
                    .findFirst()
                    .ifPresent(producto -> {
                        reponerStock(producto, venta.getCantidadVendida());
                    });
        }

        // 3. Eliminar la venta
        ventaRepository.deleteById(id);
    }

    private void reponerStock(Producto producto, int cantidad) {
        producto.setStock(producto.getStock() + cantidad);
        productoRepository.save(producto);
    }
}
