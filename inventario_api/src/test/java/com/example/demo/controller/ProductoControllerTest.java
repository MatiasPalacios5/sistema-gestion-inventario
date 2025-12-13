package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductoController.class)
public class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductoService productoService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void obtenerTodos_DebeRetornarListaDeProductosYStatus200() throws Exception {
        Producto p1 = new Producto("Laptop", new BigDecimal("1500.00"), 10);
        p1.setId(1L);
        Producto p2 = new Producto("Mouse", new BigDecimal("25.00"), 50);
        p2.setId(2L);
        List<Producto> productos = Arrays.asList(p1, p2);

        Mockito.when(productoService.obtenerTodos()).thenReturn(productos);

        mockMvc.perform(get("/productos"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nombre", is("Laptop")))
                .andExpect(jsonPath("$[1].nombre", is("Mouse")));
    }

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void guardar_DebeRetornarProductoGuardadoYStatus200() throws Exception {
        // Nota: Actualmente el controlador retorna 200 OK por defecto, no 201 Created.
        Producto productoParaGuardar = new Producto("Teclado", new BigDecimal("45.00"), 20);
        Producto productoGuardado = new Producto("Teclado", new BigDecimal("45.00"), 20);
        productoGuardado.setId(3L);

        Mockito.when(productoService.guardar(any(Producto.class))).thenReturn(productoGuardado);

        mockMvc.perform(post("/productos")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productoParaGuardar)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.nombre", is("Teclado")));
    }

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void actualizar_ExisteId_DebeRetornarProductoActualizadoYStatus200() throws Exception {
        Long id = 1L;
        Producto productoDetalles = new Producto("Monitor HD", new BigDecimal("350.00"), 10);

        Producto productoActualizado = new Producto("Monitor HD", new BigDecimal("350.00"), 10);
        productoActualizado.setId(id);

        Mockito.when(productoService.actualizar(eq(id), any(Producto.class)))
                .thenReturn(Optional.of(productoActualizado));

        mockMvc.perform(put("/productos/{id}", id)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productoDetalles)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", is("Monitor HD")))
                .andExpect(jsonPath("$.precio", is(350.00)));
    }

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void actualizar_NoExisteId_DebeRetornarStatus404() throws Exception {
        Long id = 99L;
        Producto productoDetalles = new Producto("Tablet", new BigDecimal("200.00"), 15);

        Mockito.when(productoService.actualizar(eq(id), any(Producto.class)))
                .thenReturn(Optional.empty());

        mockMvc.perform(put("/productos/{id}", id)
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productoDetalles)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void eliminar_ExisteId_DebeRetornarStatus204() throws Exception {
        Long id = 1L;

        Mockito.when(productoService.eliminar(id)).thenReturn(true);

        mockMvc.perform(delete("/productos/{id}", id)
                .with(csrf()))
                .andExpect(status().isNoContent()); // 204
    }

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void eliminar_NoExisteId_DebeRetornarStatus404() throws Exception {
        Long id = 99L;

        Mockito.when(productoService.eliminar(id)).thenReturn(false);

        mockMvc.perform(delete("/productos/{id}", id)
                .with(csrf()))
                .andExpect(status().isNotFound()); // 404
    }
}
