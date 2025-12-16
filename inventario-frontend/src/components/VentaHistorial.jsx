import { useState, useEffect } from 'react'
import axios from 'axios'

const VentaHistorial = ({ shouldRefresh }) => {
    const [ventas, setVentas] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchVentas = async () => {
        try {
            const response = await axios.get('/ventas')
            setVentas(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error("Error al cargar el historial de ventas:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVentas()
    }, [shouldRefresh])

    const isVentasArray = Array.isArray(ventas)
    const ingresoTotal = isVentasArray ? ventas.reduce((acc, curr) => acc + (parseFloat(curr.montoTotal) || 0), 0) : 0
    const unidadesTotales = isVentasArray ? ventas.reduce((acc, curr) => acc + curr.cantidadVendida, 0) : 0

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Historial de Ventas</h2>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="text-success">
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#065f46' }}>Ingreso Total</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {ingresoTotal.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </span>
                </div>
                <div style={{ backgroundColor: '#e0f2fe', padding: '0.5rem', borderRadius: '6px', color: '#0369a1' }}>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#075985' }}>Unidades Vendidas</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{unidadesTotales}</span>
                </div>
            </div>

            {loading ? (
                <p className="text-center">Cargando ventas...</p>
            ) : !isVentasArray || ventas.length === 0 ? (
                <p className="text-center text-muted">No se han registrado ventas aún.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem' }}>Fecha/Hora</th>
                                <th style={{ padding: '0.75rem' }}>Producto</th>
                                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Cant.</th>
                                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta, index) => (
                                <tr key={venta.id || index} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        {new Date(venta.fechaVenta).toLocaleString('es-AR')}
                                    </td>
                                    {/* Asumiendo que el backend devuelve el objeto producto o al menos su nombre */}
                                    <td style={{ padding: '0.75rem' }}>
                                        {venta.nombreProducto || 'Producto desconocido'}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                        {venta.cantidadVendida}
                                    </td>
                                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600 }}>
                                        {venta.montoTotal ? Number(venta.montoTotal).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '$ 0.00'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default VentaHistorial
