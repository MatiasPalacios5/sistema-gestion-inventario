import { useState } from 'react'
import ProductoForm from './ProductoForm'

function ProductoItem({ producto, onVender, onEliminar, onActualizar }) {
    const [cantidad, setCantidad] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <ProductoForm
                productoAEditar={producto}
                onActualizar={onActualizar}
                onSuccess={() => setIsEditing(false)}
            />
        )
    }

    return (
        <div className="card" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3 style={{ marginTop: 0 }}>{producto.nombre}</h3>
            <div className="product-details" style={{ width: '100%', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div>
                    <strong>Categoría:</strong> <span className="text-muted">{producto.categoria ? producto.categoria.nombre : '-'}</span>
                </div>
                <div>
                    <strong>Marca:</strong> <span className="text-muted">{producto.marca ? producto.marca.nombre : '-'}</span>
                </div>
                <div>
                    <strong>Precio:</strong> ${producto.precio}
                </div>
                <div>
                    <strong>Stock:</strong>
                    <span style={producto.stock <= (producto.stockMinimo || 0) ? { color: '#ef4444', fontWeight: 'bold' } : {}}>
                        {producto.stock}
                    </span>
                    {producto.stock <= (producto.stockMinimo || 0) && <span style={{ fontSize: '0.8rem', color: '#ef4444', marginLeft: '4px' }}>⚠</span>}
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <strong>Margen:</strong>
                    <span style={{
                        color: (producto.margenGanancia || 0) < 15 ? '#f97316' : 'green',
                        fontWeight: 'bold',
                        marginLeft: '4px'
                    }}>
                        {producto.margenGanancia ? `${producto.margenGanancia}%` : 'N/A'}
                    </span>
                    {(producto.margenGanancia || 0) < 15 && <span style={{ fontSize: '0.8rem', color: '#f97316', marginLeft: '4px' }}>(Bajo)</span>}
                </div>
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="number"
                        min="1"
                        max={producto.stock}
                        value={cantidad}
                        onChange={(e) => {
                            const val = e.target.value
                            // Permitir vacio o numero positivo
                            if (val === '' || /^\d+$/.test(val)) {
                                setCantidad(val)
                            }
                        }}
                        placeholder="1"
                        style={{ width: '80px', padding: '0.5rem' }}
                    />
                    <button
                        style={{
                            backgroundColor: 'transparent',
                            color: 'var(--primary)',
                            border: '1px solid var(--border)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            flex: 1
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => {
                            if (cantidad === '') {
                                onVender(producto.id, 1)
                                setCantidad('')
                                return
                            }

                            const val = parseInt(cantidad)
                            if (!val || val < 1) {
                                alert("Por favor ingrese una cantidad válida mayor a 0.")
                                return
                            }

                            onVender(producto.id, val)
                            setCantidad('')
                        }}
                    >
                        Vender
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            flex: 1
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Editar
                    </button>
                    <button
                        className="btn-delete"
                        onClick={() => onEliminar(producto.id)}
                        style={{ flex: 1 }}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductoItem
