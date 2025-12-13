package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/**
 * Entidad que representa un Producto en la base de datos.
 * <p>
 * 
 * @Entity Indica que esta clase es una entidad JPA.
 * @Table Define la tabla 'producto' donde se persistirán los datos.
 */
@Entity
@Table(name = "producto")
public class Producto {

    /**
     * Identificador único del producto.
     * 
     * @Id Marca el campo como clave primaria.
     * @GeneratedValue Estrategia de generación automática (Auto-incremento en
     *                 MySQL).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre del producto. No puede ser nulo.
     */
    @Column(nullable = false, length = 255)
    private String nombre;

    /**
     * Precio del producto.
     * Se usa BigDecimal para precisión monetaria exacta.
     * precision=10, scale=2 significa hasta 10 dígitos en total, con 2 decimales.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    /**
     * Cantidad de stock disponible.
     */
    @Column(nullable = false)
    private Integer stock;

    /**
     * Constructor vacío requerido por JPA.
     */
    public Producto() {
    }

    /**
     * Constructor para crear instancias sin ID (para inserción).
     */
    public Producto(String nombre, BigDecimal precio, Integer stock) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
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

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
