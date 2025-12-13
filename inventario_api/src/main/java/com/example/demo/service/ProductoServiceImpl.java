package com.example.demo.service;

import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }

    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Optional<Producto> actualizar(Long id, Producto productoDetalles) {
        return productoRepository.findById(id).map(producto -> {
            producto.setNombre(productoDetalles.getNombre());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setStock(productoDetalles.getStock());
            return productoRepository.save(producto);
        });
    }

    @Override
    public boolean eliminar(Long id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Implementación de la lógica de venta.
     * Busca el producto, valida que exista stock disponible (> 0)
     * y decrementa la cantidad.
     *
     * @param id ID del producto.
     * @return El producto actualizado.
     * @throws RuntimeException si el producto no existe o no hay stock.
     */
    @Override
    @org.springframework.transaction.annotation.Transactional
    public Producto venderProducto(Long id, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente para realizar la venta");
        }

        producto.setStock(producto.getStock() - cantidad);
        return productoRepository.save(producto);
    }
}
