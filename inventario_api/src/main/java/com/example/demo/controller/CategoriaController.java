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

    private final CategoriaRepository categoriaRepository;

    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    @org.springframework.web.bind.annotation.PostMapping
    public Categoria crearCategoria(@org.springframework.web.bind.annotation.RequestBody Categoria categoria) {
        Categoria nueva = categoriaRepository.save(categoria);
        System.out.println("Nueva Categoría creada con éxito: " + nueva.getNombre());
        return nueva;
    }
}
