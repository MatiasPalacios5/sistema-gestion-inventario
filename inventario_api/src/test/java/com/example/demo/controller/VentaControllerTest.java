package com.example.demo.controller;

import com.example.demo.model.Venta;
import com.example.demo.repository.VentaRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VentaController.class)
public class VentaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VentaRepository ventaRepository;

    @MockBean
    private com.example.demo.config.JwtUtils jwtUtils;

    @MockBean
    private com.example.demo.service.UserDetailsServiceImpl userDetailsService;

    @Test
    @WithMockUser(username = "admin", roles = "USER")
    public void obtenerTodasLasVentas_DebeRetornarListaConMontoTotal() throws Exception {
        Venta venta = new Venta();
        venta.setId(1L);
        venta.setNombreProducto("Producto Test");
        venta.setCantidadVendida(2);
        venta.setPrecioUnitario(10.0);
        venta.setMontoTotal(20.0);
        venta.setFechaVenta(LocalDateTime.now());

        List<Venta> ventas = Arrays.asList(venta);

        given(ventaRepository.findAll()).willReturn(ventas);

        mockMvc.perform(get("/ventas")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].montoTotal", is(20.0)));
    }
}
