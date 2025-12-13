package com.example.demo.service;

import com.example.demo.model.Producto;
import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> obtenerTodos();

    Producto guardar(Producto producto);

    Optional<Producto> actualizar(Long id, Producto productoDetalles);

    boolean eliminar(Long id);
}
