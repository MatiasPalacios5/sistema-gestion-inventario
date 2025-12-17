package com.example.demo.controller;

import com.example.demo.model.Categoria;
import com.example.demo.repository.CategoriaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final com.example.demo.service.CategoriaService categoriaService;

    public CategoriaController(com.example.demo.service.CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> obtenerTodas() {
        return categoriaService.findAll();
    }

    @org.springframework.web.bind.annotation.PostMapping
    public Categoria crearCategoria(@org.springframework.web.bind.annotation.RequestBody Categoria categoria) {
        Categoria nueva = categoriaService.save(categoria);
        System.out.println("Nueva Categoría creada con éxito: " + nueva.getNombre());
        return nueva;
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> eliminarCategoria(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        categoriaService.deleteCategoria(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}
