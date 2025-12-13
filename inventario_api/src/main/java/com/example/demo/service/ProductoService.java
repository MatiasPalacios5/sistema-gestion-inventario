package com.example.demo.service;

import com.example.demo.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> obtenerTodos();

    Producto guardar(Producto producto);

    Optional<Producto> actualizar(Long id, Producto productoDetalles);

    boolean eliminar(Long id);

    /**
     * Realiza la venta de una unidad de un producto.
     * Decrementa el stock en 1 si es posible.
     *
     * @param id ID del producto a vender.
     * @return El producto con el stock actualizado.
     */
    Producto venderProducto(Long id, int cantidad);
}
