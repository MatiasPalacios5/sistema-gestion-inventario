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

    @Test
    public void venderProducto_StockInsuficiente_DebeLanzarExcepcion() {
        // Arrange
        Long productoId = 1L;
        int cantidadVenta = 10;
        int stockInicial = 5; // Stock menor que la venta

        Producto producto = new Producto("Escasez", new BigDecimal("50.00"), stockInicial);
        producto.setId(productoId);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));

        // Act & Assert
        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class, () -> {
            productoService.venderProducto(productoId, cantidadVenta);
        }, "Stock insuficiente para realizar la venta");

        // Verify no sale was saved
        verify(ventaRepository, times(0)).save(any(Venta.class));
    }

    @Test
    public void venderProducto_DebeRegistrarPrecioSnapshot() {
        // Arrange
        Long productoId = 2L;
        int cantidadVenta = 1;
        BigDecimal precioOriginal = new BigDecimal("1000.00");
        int stockInicial = 5;

        Producto producto = new Producto("Snapshot Item", precioOriginal, stockInicial);
        producto.setId(productoId);

        when(productoRepository.findById(productoId)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenReturn(producto);
        when(ventaRepository.save(any(Venta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        productoService.venderProducto(productoId, cantidadVenta);

        // Assert
        // Verificamos que la venta guardada tenga el precio original (1000)
        verify(ventaRepository)
                .save(org.mockito.ArgumentMatchers.argThat(venta -> venta.getPrecioUnitario() == 1000.00));

        // Simular cambio de precio en el producto POSTERIOR a la venta no debería
        // afectar la venta ya guardada
        // (Esto es implícito por el diseño, pero confirmamos que se usó el valor
        // numérico)
    }
}
