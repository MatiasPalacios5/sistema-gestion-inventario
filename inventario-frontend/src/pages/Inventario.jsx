import { useState, useMemo } from 'react';
import ProductoRow from '../components/ProductoRow';
import { Search, SearchX, Loader2, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

const MetricCard = ({ title, value, icon, color, isCurrency = true }) => {
    const getColors = (colorName) => {
        switch (colorName) {
            case 'blue': return { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: '#3b82f6' };
            case 'green': return { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', icon: '#22c55e' };
            case 'red': return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '#ef4444' };
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

const Inventario = ({ productos, categorias, marcas, loading, onVender, onEliminar, onActualizar }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrado del lado del cliente
    const productosFiltrados = useMemo(() => {
        return productos.filter(producto => {
            const term = searchTerm.toLowerCase();
            const nombreMatch = producto.nombre?.toLowerCase().includes(term);
            const categoriaMatch = producto.categoria?.nombre?.toLowerCase().includes(term);
            const marcaMatch = producto.marca?.nombre?.toLowerCase().includes(term);
            return nombreMatch || categoriaMatch || marcaMatch;
        });
    }, [productos, searchTerm]);

    // Cálculo de Métricas
    const { inversionTotal, gananciaEstimada, stockCritico } = useMemo(() => {
        return productosFiltrados.reduce((acc, curr) => {
            const costo = curr.precioCosto || 0;
            const precio = curr.precio || 0;
            const stock = curr.stock || 0;
            const minimo = curr.stockMinimo || 0;

            acc.inversionTotal += costo * stock;
            acc.gananciaEstimada += (precio - costo) * stock;
            if (stock <= minimo) acc.stockCritico += 1;

            return acc;
        }, { inversionTotal: 0, gananciaEstimada: 0, stockCritico: 0 });
    }, [productosFiltrados]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
    );

    // Estado vacío inicial (solo si no hay productos ni búsqueda)
    if (!loading && productos.length === 0) return (
        <div className="text-center text-muted" style={{ marginTop: '5rem' }}>
            <SearchX size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>No hay productos registrados</h3>
            <p>Comienza agregando nuevos productos al inventario.</p>
        </div>
    );

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>
                    Panel de Inventario
                </h1>

                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                    <Search
                        size={20}
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
                    />
                    <input
                        type="text"
                        placeholder="Buscar producto, categoría o marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>
            </div>

            {/* Tarjetas de Métricas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <MetricCard
                    title="Capital Invertido"
                    value={inversionTotal}
                    color="blue"
                    icon={<DollarSign size={24} />}
                />
                <MetricCard
                    title="Ganancia Proyectada"
                    value={gananciaEstimada}
                    color="green"
                    icon={<TrendingUp size={24} />}
                />
                <MetricCard
                    title="Alertas de Stock"
                    value={stockCritico}
                    color="red"
                    isCurrency={false}
                    icon={<AlertTriangle size={24} />}
                />
            </div>

            {/* Tabla de Inventario */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Producto</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoría</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marca</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Precio</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Venta Rápida</th>
                                <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: 'white' }}>
                            {productosFiltrados.map((producto) => (
                                <ProductoRow
                                    key={producto.id}
                                    producto={producto}
                                    onVender={onVender}
                                    onEliminar={onEliminar}
                                    onActualizar={onActualizar}
                                    categorias={categorias}
                                    marcas={marcas}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {productosFiltrados.length === 0 && (
                <div className="text-center text-muted" style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SearchX size={48} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
                    <h3 style={{ margin: 0, color: '#1e293b' }}>No se encontraron productos</h3>
                    <p style={{ color: '#64748b' }}>Intenta con otros términos de búsqueda.</p>
                </div>
            )}
        </div>
    );
};

export default Inventario;
