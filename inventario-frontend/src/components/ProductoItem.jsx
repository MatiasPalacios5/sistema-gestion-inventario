import { useState } from 'react'

function ProductoItem({ producto, onVender, onEliminar }) {
    const [cantidad, setCantidad] = useState(1)

    return (
        <div className="card" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3 style={{ marginTop: 0 }}>{producto.nombre}</h3>
            <div className="product-details" style={{ width: '100%', marginBottom: '1rem' }}>
                <span style={{ marginRight: '1rem' }}>Precio: ${producto.precio}</span>
                <span>Stock: {producto.stock}</span>
            </div>

            <div style={{ marginTop: 'auto', width: '100%' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <input
                        type="number"
                        min="1"
                        max={producto.stock}
                        value={cantidad}
                        onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 0))}
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
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => onVender(producto.id, cantidad)}
                    >
                        Vender
                    </button>
                </div>

                <button
                    className="btn-delete"
                    onClick={() => onEliminar(producto.id)}
                    style={{ width: '100%' }}
                >
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default ProductoItem
