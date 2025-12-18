package com.example.demo.service;

import com.example.demo.model.Venta;
import java.util.List;

public interface VentaService {
    List<Venta> obtenerTodas();

    void eliminarVenta(Long id);
}
