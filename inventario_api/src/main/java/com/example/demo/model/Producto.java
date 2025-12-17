package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
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
     * Precio de costo del producto.
     */
    @Column(name = "precio_costo")
    private Double precioCosto;

    /**
     * Stock mínimo para alertas. Valor por defecto 5.
     */
    @Column(name = "stock_minimo")
    private Integer stockMinimo = 5;

    @ManyToOne
    @jakarta.persistence.JoinColumn(name = "categoria_id")
    private Categoria categoria;

    @ManyToOne
    @jakarta.persistence.JoinColumn(name = "marca_id")
    private Marca marca;

    /**
     * Calcula el margen de ganancia en porcentaje.
     * 
     * @return Porcentaje de ganancia o 0 si no hay costo definido.
     */
    @jakarta.persistence.Transient
    public Double getMargenGanancia() {
        if (precioCosto == null || precioCosto == 0) {
            return 0.0;
        }
        if (precio == null) {
            return 0.0;
        }
        return ((precio.doubleValue() - precioCosto) / precioCosto) * 100;
    }

    /**
     * Constructor vacío requerido por JPA.
     */
    public Producto() {
    }

    /**
     * Constructor simple (existente).
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

    public Double getPrecioCosto() {
        return precioCosto;
    }

    public void setPrecioCosto(Double precioCosto) {
        this.precioCosto = precioCosto;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }
}
