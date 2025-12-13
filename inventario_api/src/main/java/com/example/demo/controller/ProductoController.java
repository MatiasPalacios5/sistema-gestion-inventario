package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para gestionar las operaciones CRUD de Productos.
 * <p>
 * 
 * @RestController indica que esta clase maneja peticiones HTTP y devuelve
 *                 respuestas en JSON.
 *                 @RequestMapping("/productos") define la URL base para todos
 *                 los endpoints de este controlador.
 */
@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;

    /**
     * Inyección de dependencias por constructor.
     * Spring inyecta automáticamente la instancia de ProductoService.
     */
    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Obtiene la lista completa de productos.
     * <p>
     * Endpoint: GET /productos
     * 
     * @return Lista de todos los objetos Producto en la base de datos.
     */
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoService.obtenerTodos();
    }

    /**
     * Crea un nuevo producto.
     * <p>
     * Endpoint: POST /productos
     * 
     * @param producto Objeto JSON enviado en el cuerpo de la petición.
     * @return El producto guardado con su ID generado.
     */
    @PostMapping
    public Producto guardar(@RequestBody Producto producto) {
        return productoService.guardar(producto);
    }

    /**
     * Actualiza un producto existente por su ID.
     * <p>
     * Endpoint: PUT /productos/{id}
     * 
     * @param id               Identificador del producto a actualizar.
     * @param productoDetalles Datos nuevos para actualizar (nombre, precio, stock).
     * @return ResponseEntity con el producto actualizado (200 OK) o 404 Not Found
     *         si no existe.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto productoDetalles) {
        return productoService.actualizar(id, productoDetalles)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Elimina un producto por su ID.
     * <p>
     * Endpoint: DELETE /productos/{id}
     * 
     * @param id Identificador del producto a eliminar.
     * @return ResponseEntity 204 No Content si se borró éxito, o 404 Not Found si
     *         no existía.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (productoService.eliminar(id)) {
            // Retornamos 204 (Sin contenido) para confirmar la eliminación exitosa
            return ResponseEntity.noContent().build();
        }
        // Retornamos 404 si el ID no existe en la base de datos
        return ResponseEntity.notFound().build();
    }
}
