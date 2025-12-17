import { useState } from 'react'
import ProductoForm from './ProductoForm'
import { DollarSign, Edit2, Trash2, AlertTriangle, TrendingDown } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ProductoRow = ({ producto, onVender, onEliminar, onActualizar }) => {
    const [cantidad, setCantidad] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    // Calculos de negocio en el cliente para feedback inmediato
    const stockBajo = producto.stock <= (producto.stockMinimo || 0);
    const margen = producto.margenGanancia || 0;

    let margenColor = '#ef4444'; // Rojo (< 10%)
    if (margen > 20) margenColor = '#10b981'; // Verde (> 20%)
    else if (margen >= 10) margenColor = '#f97316'; // Naranja (10-20%)

    if (isEditing) {
        return (
            <tr style={{ backgroundColor: '#f8fafc' }}>
                <td colSpan="8" style={{ padding: '0' }}>
                    <div style={{ padding: '2rem', border: '2px solid var(--primary)', borderRadius: '12px', margin: '1rem' }}>
                        <ProductoForm
                            productoAEditar={producto}
                            onActualizar={onActualizar}
                            onSuccess={() => setIsEditing(false)}
                        // Las categorias y marcas se pasan via Context o Props si fuera necesario, 
                        // pero ProductoForm debería recibirlas. 
                        // Nota: En la implementación de tabla, el prop drilling de cats/marcas es necesario si el Form las usa.
                        // Asumiremos que Inventario -> ProductoRow -> ProductoForm las pasa.
                        />
                    </div>
                </td>
            </tr>
        )
    }

    return (
        <tr style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s' }} className="hover:bg-slate-50">
            <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{producto.nombre}</div>
            </td>
            <td style={{ padding: '1rem' }}>
                {producto.categoria ? (
                    <span className="badge badge-primary">{producto.categoria.nombre}</span>
                ) : (
                    <span className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>Sin asignar</span>
                )}
            </td>
            <td style={{ padding: '1rem' }}>
                {producto.marca ? (
                    <span className="badge">{producto.marca.nombre}</span>
                ) : (
                    <span className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>Sin asignar</span>
                )}
            </td>
            <td style={{ padding: '1rem', fontWeight: 600 }}>
                ${producto.precio}
            </td>
            <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                        color: stockBajo ? '#ef4444' : 'inherit',
                        fontWeight: stockBajo ? 700 : 400,
                        fontSize: stockBajo ? '1.1rem' : '1rem'
                    }}>
                        {producto.stock}
                    </span>
                    {stockBajo && (
                        <span title="Stock Crítico" className="blink">
                            <AlertTriangle size={18} color="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                        </span>
                    )}
                </div>
            </td>
            <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                        fontWeight: 700,
                        color: margenColor
                    }}>
                        {margen}%
                    </span>
                    {margen < 10 && (
                        <span title="Rentabilidad Crítica (<10%)" style={{ display: 'flex' }}>
                            <TrendingDown size={16} color={margenColor} />
                        </span>
                    )}
                </div>
            </td>
            <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            placeholder="1"
                            style={{ width: '60px', padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.6rem', minWidth: 'auto' }}
                        onClick={() => {
                            if (cantidad === '') {
                                onVender(producto.id, 1)
                                setCantidad('')
                                return
                            }
                            const val = parseInt(cantidad)
                            if (!val || val <= 0) {
                                toast.error("Cantidad inválida")
                                return
                            }
                            onVender(producto.id, val)
                            setCantidad('')
                        }}
                        title="Vender"
                    >
                        <DollarSign size={16} />
                    </button>
                </div>
            </td>
            <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ padding: '0.4rem', border: '1px solid var(--border)', backgroundColor: 'white', color: 'var(--text-muted)' }}
                        title="Editar"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        className="btn-delete"
                        onClick={() => onEliminar(producto.id)}
                        style={{ padding: '0.4rem' }}
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default ProductoRow
