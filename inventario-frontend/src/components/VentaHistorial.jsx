import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { DollarSign, TrendingUp, ShoppingBag, Loader2, Calendar, Search, ArrowUp, ArrowDown } from 'lucide-react'

// Reutilizamos el componente de Tarjeta para consistencia visual
const MetricCard = ({ title, value, icon, color, isCurrency = true }) => {
    const getColors = (colorName) => {
        switch (colorName) {
            case 'blue': return { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' };
            case 'green': return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' };
            case 'purple': return { bg: '#faf5ff', border: '#e9d5ff', text: '#6b21a8', icon: '#a855f7' };
            default: return { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', icon: '#94a3b8' };
        }
    };

    const styles = getColors(color);

    return (
        <div className="fade-in" style={{
            backgroundColor: styles.bg,
            border: `1px solid ${styles.border}`,
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ color: styles.text, fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {title}
                </span>
                <div style={{
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '50%',
                    color: styles.icon,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    {icon}
                </div>
            </div>
            <strong style={{ fontSize: '1.75rem', color: '#1e293b', fontWeight: 700 }}>
                {isCurrency
                    ? value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
                    : value}
            </strong>
        </div>
    );
};

const VentaHistorial = ({ shouldRefresh }) => {
    const [ventas, setVentas] = useState([])
    const [loading, setLoading] = useState(true)

    // Filtros
    const [fechaDesde, setFechaDesde] = useState('')
    const [fechaHasta, setFechaHasta] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Estado de Ordenamiento
    const [sortConfig, setSortConfig] = useState({ key: 'fechaVenta', direction: 'desc' });

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

    // Función para manejar el clic en encabezados
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Helper para íconos de ordenamiento
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    // Lógica de filtrado y ordenamiento unificada
    const ventasProcesadas = useMemo(() => {
        if (!Array.isArray(ventas)) return [];

        let resultado = [...ventas];

        // 1. Filtrado por Fecha
        if (fechaDesde || fechaHasta) {
            resultado = resultado.filter(venta => {
                if (!venta.fechaVenta) return false;
                const ventaDate = new Date(venta.fechaVenta);
                ventaDate.setHours(0, 0, 0, 0);

                if (fechaDesde) {
                    const desde = new Date(fechaDesde);
                    desde.setMinutes(desde.getMinutes() + desde.getTimezoneOffset());
                    if (ventaDate < desde) return false;
                }
                if (fechaHasta) {
                    const hasta = new Date(fechaHasta);
                    hasta.setMinutes(hasta.getMinutes() + hasta.getTimezoneOffset());
                    if (ventaDate > hasta) return false;
                }
                return true;
            });
        }

        // 2. Filtrado por Búsqueda (Texto)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            resultado = resultado.filter(venta => {
                const prodName = venta.nombreProducto?.toLowerCase() || '';
                // Asumimos que la API podría devolver marca o categoría si estuvieran pobladas, 
                // pero por ahora filtramos por nombre de producto que es lo visible.
                return prodName.includes(term);
            });
        }

        // 3. Ordenamiento
        if (sortConfig.key) {
            resultado.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Manejo especial para claves compuestas o no directas si fuera necesario
                if (sortConfig.key === 'nombreProducto') {
                    aValue = (a.nombreProducto || '').toLowerCase();
                    bValue = (b.nombreProducto || '').toLowerCase();
                } else if (sortConfig.key === 'montoTotal' || sortConfig.key === 'cantidadVendida') {
                    aValue = parseFloat(aValue || 0);
                    bValue = parseFloat(bValue || 0);
                } else if (sortConfig.key === 'fechaVenta') {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return resultado;
    }, [ventas, fechaDesde, fechaHasta, searchTerm, sortConfig]);

    // Calcular métricas sobre datos PROCESADOS
    const { totalVendido, utilidadReal, nroOperaciones } = useMemo(() => {
        if (ventasProcesadas.length === 0) {
            return { totalVendido: 0, utilidadReal: 0, nroOperaciones: 0 };
        }

        return ventasProcesadas.reduce((acc, venta) => {
            const monto = parseFloat(venta.montoTotal) || 0;
            const precioCosto = venta.precioCostoSnapshot || (venta.producto && venta.producto.precioCosto) || 0;
            const cantidad = venta.cantidadVendida || 0;

            acc.totalVendido += monto;
            const costoTotalVenta = precioCosto * cantidad;
            acc.utilidadReal += (monto - costoTotalVenta);
            acc.nroOperaciones += 1;
            return acc;
        }, { totalVendido: 0, utilidadReal: 0, nroOperaciones: 0 });
    }, [ventasProcesadas]);


    // Botones rápidos
    const setQuickFilter = (type) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        if (type === 'today') {
            setFechaDesde(todayStr);
            setFechaHasta(todayStr);
        } else if (type === 'week') {
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);
            const lw_yyyy = lastWeek.getFullYear();
            const lw_mm = String(lastWeek.getMonth() + 1).padStart(2, '0');
            const lw_dd = String(lastWeek.getDate()).padStart(2, '0');

            setFechaDesde(`${lw_yyyy}-${lw_mm}-${lw_dd}`);
            setFechaHasta(todayStr);
        } else if (type === 'month') {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const fd_yyyy = firstDay.getFullYear();
            const fd_mm = String(firstDay.getMonth() + 1).padStart(2, '0');
            const fd_dd = String(firstDay.getDate()).padStart(2, '0');

            setFechaDesde(`${fd_yyyy}-${fd_mm}-${fd_dd}`);
            setFechaHasta(todayStr);
        } else if (type === 'clear') {
            setFechaDesde('');
            setFechaHasta('');
        }
    }

    // Estilos comunes para TH
    const thStyle = {
        padding: '1rem',
        textAlign: 'left',
        fontWeight: 600,
        color: '#64748b',
        borderBottom: '1px solid #e2e8f0',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'background-color 0.2s'
    };

    return (
        <div style={{ marginTop: '2rem' }}>

            {/* Panel de Control (Filtros y Búsqueda) */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Header y Filtros Rápidos */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={20} /> Historial y Auditoría
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {/* ... Botones rápidos ... */}
                            <button onClick={() => setQuickFilter('today')} className="btn-filter">Hoy</button>
                            <button onClick={() => setQuickFilter('week')} className="btn-filter">7 Días</button>
                            <button onClick={() => setQuickFilter('month')} className="btn-filter">Mes Actual</button>
                            <button onClick={() => setQuickFilter('clear')} className="btn-filter-clear">Ver Todo</button>
                        </div>
                    </div>

                    {/* Inputs de Fecha y Búsqueda */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Desde</label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                className="input-date"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Hasta</label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="input-date"
                            />
                        </div>

                        {/* Buscador General */}
                        <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Buscar Transacción</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Buscar por producto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ fontSize: '0.9rem', color: '#64748b', paddingBottom: '0.5rem', whiteSpace: 'nowrap' }}>
                            <strong>{ventasProcesadas.length}</strong> resultados
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Cards (Basado en datos procesados) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <MetricCard
                    title="Total Vendido"
                    value={totalVendido}
                    color="blue"
                    icon={<DollarSign size={24} />}
                />
                <MetricCard
                    title="Utilidad Real"
                    value={utilidadReal}
                    color="green"
                    icon={<TrendingUp size={24} />}
                />
                <MetricCard
                    title="Nro. de Operaciones"
                    value={nroOperaciones}
                    color="purple"
                    isCurrency={false}
                    icon={<ShoppingBag size={24} />}
                />
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                </div>
            ) : ventasProcesadas.length === 0 ? (
                <div className="card text-center text-muted" style={{ padding: '3rem' }}>
                    <p>No se encontraron ventas con los filtros actuales.</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '0.95rem' }}>
                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                <tr>
                                    <th onClick={() => handleSort('fechaVenta')} style={thStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            Fecha {getSortIcon('fechaVenta')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('nombreProducto')} style={thStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            Producto {getSortIcon('nombreProducto')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('cantidadVendida')} style={{ ...thStyle, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                                            Cant. {getSortIcon('cantidadVendida')}
                                        </div>
                                    </th>
                                    <th onClick={() => handleSort('montoTotal')} style={{ ...thStyle, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end' }}>
                                            Total {getSortIcon('montoTotal')}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventasProcesadas.map((venta, index) => (
                                    <tr
                                        key={venta.id || index}
                                        style={{ transition: 'background-color 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', color: '#334155' }}>
                                            {new Date(venta.fechaVenta).toLocaleString('es-AR')}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', fontWeight: 500 }}>
                                            {venta.nombreProducto || 'Producto desconocido'}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                                            {venta.cantidadVendida}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>
                                            {venta.montoTotal ? Number(venta.montoTotal).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' }) : '$ 0.00'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <style>{`
                .btn-filter {
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    border: 1px solid #cbd5e1;
                    background: white;
                    font-size: 0.85rem;
                    cursor: pointer;
                    font-weight: 500;
                    color: #475569;
                    transition: all 0.2s;
                }
                .btn-filter:hover {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                }
                .btn-filter-clear {
                    padding: 0.4rem 0.8rem;
                    border-radius: 6px;
                    border: 1px solid #cbd5e1;
                    background: #f1f5f9;
                    font-size: 0.85rem;
                    cursor: pointer;
                    font-weight: 500;
                    color: #64748b;
                }
                .btn-filter-clear:hover {
                    background: #e2e8f0;
                    color: #475569;
                }
                .input-date {
                    padding: 0.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    color: #334155;
                    font-family: inherit;
                }
                .input-date:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                }
            `}</style>
        </div>
    )
}

export default VentaHistorial
