package com.example.demo.service;

import com.example.demo.model.Producto;
import com.example.demo.model.Venta;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.VentaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class ProductoServiceImplTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private VentaRepository ventaRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @Test
    public void venderProducto_DebeCrearVentaConMontosCorrectos() {
        // Arrange
        Long productoId = 1L;
        int cantidadVenta = 2;
        BigDecimal precio = new BigDecimal("100.00");
        int stockInicial = 10;

        Producto producto = new Producto("Test Product", precio, stockInicial);
        producto.setId(productoId);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);
        when(ventaRepository.save(any(Venta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        productoService.venderProducto(productoId, cantidadVenta);

        // Assert
        // Verificar que el stock bajó
        assertEquals(stockInicial - cantidadVenta, producto.getStock());

        // Verificar que se guardó la venta con los valores correctos
        verify(ventaRepository, times(1))
                .save(org.mockito.ArgumentMatchers.argThat(venta -> venta.getNombreProducto().equals("Test Product") &&
                        venta.getCantidadVendida() == cantidadVenta &&
                        venta.getPrecioUnitario() == 100.00 &&
                        venta.getMontoTotal() == 200.00));
    }
}
