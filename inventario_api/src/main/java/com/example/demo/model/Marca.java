package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "marca")
public class Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    public Marca() {
    }

    public Marca(String nombre) {
        this.nombre = nombre;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "marca_categoria", joinColumns = @JoinColumn(name = "marca_id"), inverseJoinColumns = @JoinColumn(name = "categoria_id"))
    private java.util.List<Categoria> categorias;

    public java.util.List<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(java.util.List<Categoria> categorias) {
        this.categorias = categorias;
    }
}
