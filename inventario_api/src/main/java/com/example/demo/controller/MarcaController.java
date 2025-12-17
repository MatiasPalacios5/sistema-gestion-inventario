package com.example.demo.controller;

import com.example.demo.model.Marca;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/marcas")
public class MarcaController {

    private final com.example.demo.service.MarcaService marcaService;

    public MarcaController(com.example.demo.service.MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    public List<Marca> obtenerTodas() {
        return marcaService.findAll();
    }

    @org.springframework.web.bind.annotation.PostMapping
    public Marca crearMarca(@org.springframework.web.bind.annotation.RequestBody Marca marca) {
        Marca nueva = marcaService.save(marca);
        System.out.println("Nueva Marca creada con éxito: " + nueva.getNombre());
        return nueva;
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<Marca> editarMarca(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody Marca marca) {
        return marcaService.findById(id)
                .map(existingMarca -> {
                    existingMarca.setNombre(marca.getNombre());
                    existingMarca.setCategorias(marca.getCategorias());
                    return org.springframework.http.ResponseEntity.ok(marcaService.save(existingMarca));
                })
                .orElse(org.springframework.http.ResponseEntity.notFound().build());

    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> eliminarMarca(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        marcaService.deleteMarca(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
