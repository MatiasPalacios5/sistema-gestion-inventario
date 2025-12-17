package com.example.demo.service;

import com.example.demo.model.Categoria;
import com.example.demo.model.Marca;
import com.example.demo.repository.CategoriaRepository;
import com.example.demo.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;
    private final CategoriaRepository categoriaRepository;
    private final com.example.demo.repository.ProductoRepository productoRepository;

    @Autowired
    public MarcaService(MarcaRepository marcaRepository, CategoriaRepository categoriaRepository,
            com.example.demo.repository.ProductoRepository productoRepository) {
        this.marcaRepository = marcaRepository;
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    public List<Marca> findAll() {
        return marcaRepository.findAll();
    }

    public Marca save(Marca marca) {
        if (marca.getCategorias() == null || marca.getCategorias().isEmpty()) {
            Categoria otros = categoriaRepository.findByNombre("Otros")
                    .orElseGet(() -> categoriaRepository.save(new Categoria("Otros")));
            marca.setCategorias(List.of(otros));
        } else {
            // Ensure categories are managed entities if they are passed detached or just
            // IDs
            // Note: If the frontend sends full objects with IDs, JPA might require them to
            // be attached.
            // But if we just look up by ID it's safer. However, for simplicity given
            // context,
            // we assume the incoming object structure is handled by Jackson/JPA or we
            // accept it as is
            // if it has IDs.
        }
        return marcaRepository.save(marca);
    }

    public Optional<Marca> findById(Long id) {
        return marcaRepository.findById(id);
    }

    public void deleteMarca(Long id) {
        if (productoRepository.countByMarcaId(id) > 0) {
            throw new RuntimeException("No se puede eliminar la marca porque tiene productos vinculados");
        }
        marcaRepository.deleteById(id);
    }
}
