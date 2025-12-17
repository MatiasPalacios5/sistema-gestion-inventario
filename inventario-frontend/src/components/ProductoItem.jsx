import { useState } from 'react'
import ProductoForm from './ProductoForm'
import { DollarSign, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

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
            <div style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{producto.categoria ? producto.categoria.nombre : 'Sin Categoría'}</span>
                    <span className="badge">{producto.marca ? producto.marca.nombre : 'Sin Marca'}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.95rem' }}>
                    <div>
                        <span className="text-muted">Precio</span>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>${producto.precio}</div>
                    </div>
                    <div>
                        <span className="text-muted">Stock</span>
                        <div style={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: producto.stock <= (producto.stockMinimo || 0) ? 'var(--danger)' : 'inherit'
                        }}>
                            {producto.stock}
                            {producto.stock <= (producto.stockMinimo || 0) && <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>⚠</span>}
                        </div>
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>Margen de Ganancia</span>
                        <div style={{
                            color: (producto.margenGanancia || 0) < 15 ? 'var(--warning)' : 'var(--success)',
                            fontWeight: 700
                        }}>
                            {producto.margenGanancia ? `${producto.margenGanancia}%` : 'N/A'}
                            {(producto.margenGanancia || 0) < 15 && <span style={{ fontSize: '0.8rem', marginLeft: '4px' }}>(Bajo)</span>}
                        </div>
                    </div>
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
                        className="btn-primary"
                        style={{ flex: 1, backgroundColor: 'white', color: 'var(--primary)', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = 'var(--primary)'; }}
                        onClick={() => {
                            if (cantidad === '') {
                                onVender(producto.id, 1)
                                setCantidad('')
                                return
                            }

                            const val = parseInt(cantidad)
                            if (!val || val < 1) {
                                toast.error("Por favor ingrese una cantidad válida mayor a 0.")
                                return
                            }

                            onVender(producto.id, val)
                            setCantidad('')
                        }}
                        title="Vender"
                    >
                        <DollarSign size={18} /> Vender
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            border: '1px solid var(--border)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontWeight: 500,
                            transition: 'all 0.2s',
                            flex: 1,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        title="Editar Producto"
                    >
                        <Edit2 size={16} /> Editar
                    </button>
                    <button
                        className="btn-delete"
                        onClick={() => onEliminar(producto.id)}
                        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                        title="Eliminar Producto"
                    >
                        <Trash2 size={16} /> Eliminar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductoItem
