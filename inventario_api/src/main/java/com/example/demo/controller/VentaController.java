package com.example.demo.controller;

import com.example.demo.model.Venta;
import com.example.demo.repository.VentaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    private final VentaRepository ventaRepository;

    public VentaController(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    /**
     * Obtiene el historial completo de ventas.
     * <p>
     * Endpoint: GET /ventas
     *
     * @return Lista de todas las ventas registradas.
     */
    @GetMapping
    public List<Venta> obtenerTodasLasVentas() {
        return ventaRepository.findAll();
    }
}
