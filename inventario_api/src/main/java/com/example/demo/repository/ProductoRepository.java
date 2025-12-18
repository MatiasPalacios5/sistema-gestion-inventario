package com.example.demo.repository;

import com.example.demo.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositorio de acceso a datos para la entidad Producto.
 * <p>
 * Extiende de JpaRepository para obtener automáticamente métodos CRUD
 * estándard:
 * - save()
 * - findById()
 * - findAll()
 * - deleteById()
 * ... y soporte de paginación y ordenamiento.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    // Aquí se pueden definir métodos de consulta derivados (Query Methods)
    // Ej: List<Producto> findByNombre(String nombre);

    /**
     * Busca productos cuyo nombre contenga la cadena proporcionada,
     * ignorando mayúsculas y minúsculas.
     * 
     * @param nombre Parte del nombre a buscar.
     * @return Lista de productos encontrados.
     */
    java.util.List<Producto> findByNombreContainingIgnoreCase(String nombre);
}
