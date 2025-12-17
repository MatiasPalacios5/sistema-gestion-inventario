import { useState } from 'react';
import ProductoRow from '../components/ProductoRow';
import { Search, SearchX, Loader2 } from 'lucide-react';

const Inventario = ({ productos, categorias, marcas, loading, error, onVender, onEliminar, onActualizar }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrado del lado del cliente local para esta vista
    const productosFiltrados = productos.filter(producto => {
        const term = searchTerm.toLowerCase();
        const nombreMatch = producto.nombre?.toLowerCase().includes(term);
        const categoriaMatch = producto.categoria?.nombre?.toLowerCase().includes(term);
        const marcaMatch = producto.marca?.nombre?.toLowerCase().includes(term);
        return nombreMatch || categoriaMatch || marcaMatch;
    });

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        </div>
    );

    // El error se maneja en el padre (App), pero podemos mostrar algo aquí si no hay productos
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
                <h1 style={{ marginBottom: '1rem' }}>Panel de Inventario</h1>

                <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                    <Search
                        size={20}
                        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}
                    />
                    <input
                        type="text"
                        placeholder="Buscar producto, categoría o marca..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
                    <span className="text-muted" style={{ marginRight: '10px' }}>Valor Total del Inventario:</span>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>
                        {productosFiltrados.reduce((acc, curr) => acc + (curr.precio * curr.stock), 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                    </strong>
                </div>
            </div>

            {/* Tabla de Inventario */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                        <thead style={{ backgroundColor: '#f8fafc', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Producto</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Categoría</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Marca</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Precio</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Stock</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Estado</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Venta Rápida</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
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
                    <SearchX size={48} style={{ marginBottom: '1rem', color: 'var(--text-light)' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>No se encontraron productos</h3>
                    <p>Intenta con otros términos de búsqueda.</p>
                </div>
            )}
        </div>
    );
};

export default Inventario;
