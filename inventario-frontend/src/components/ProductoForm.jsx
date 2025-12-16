import { useState, useEffect } from 'react'
import axios from 'axios'

const ProductoForm = ({ onSuccess, productoAEditar, onActualizar, categorias = [], marcas = [] }) => {
    const [nombre, setNombre] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [precioCosto, setPrecioCosto] = useState('')
    const [stockMinimo, setStockMinimo] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [marcaId, setMarcaId] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)



    useEffect(() => {
        if (productoAEditar) {
            setNombre(productoAEditar.nombre)
            setCantidad(productoAEditar.stock)
            setPrecio(productoAEditar.precio)
            setPrecioCosto(productoAEditar.precioCosto || '')
            setStockMinimo(productoAEditar.stockMinimo || '')
            setCategoriaId(productoAEditar.categoria ? productoAEditar.categoria.id : '')
            setMarcaId(productoAEditar.marca ? productoAEditar.marca.id : '')
        }
    }, [productoAEditar])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMsg(null)

        if (!nombre || cantidad === '' || precio === '' || categoriaId === '' || marcaId === '') {
            setError("Todos los campos obligatorios deben completarse")
            setLoading(false)
            return
        }

        const payload = {
            nombre,
            stock: parseInt(cantidad),
            precio: parseFloat(precio),
            precioCosto: precioCosto ? parseFloat(precioCosto) : null,
            stockMinimo: stockMinimo ? parseInt(stockMinimo) : null,
            categoria: { id: parseInt(categoriaId) },
            marca: { id: parseInt(marcaId) }
        }

        try {
            if (productoAEditar) {
                await onActualizar(productoAEditar.id, payload)
                if (onSuccess) onSuccess()
            } else {
                await axios.post('/productos', payload)

                setSuccessMsg("¡Producto creado con éxito!")
                setNombre('')
                setCantidad('')
                setPrecio('')
                setPrecioCosto('')
                setStockMinimo('')
                setCategoriaId('')
                setMarcaId('')

                if (onSuccess) onSuccess()
            }

        } catch (err) {
            console.error("Error saving product:", err)
            setError("Error al guardar el producto. Verifique los datos.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card" style={productoAEditar ? { border: 'none', shadow: 'none', padding: 0, margin: 0 } : {}}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                {productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

            {successMsg && <div className="text-success text-center">{successMsg}</div>}
            {error && <div className="text-error text-center">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label htmlFor="nombre" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nombre</label>
                    <input
                        id="nombre"
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Laptop Gamer"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="categoria" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Categoría</label>
                    <select
                        id="categoria"
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        className="form-control"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    >
                        <option value="">Seleccione...</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="marca" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Marca</label>
                    <select
                        id="marca"
                        value={marcaId}
                        onChange={(e) => setMarcaId(e.target.value)}
                        className="form-control"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    >
                        <option value="">Seleccione...</option>
                        {marcas.map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="precio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Precio Venta</label>
                    <input
                        id="precio"
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="precioCosto" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Precio Costo</label>
                    <input
                        id="precioCosto"
                        type="number"
                        value={precioCosto}
                        onChange={(e) => setPrecioCosto(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cantidad" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock Actual</label>
                    <input
                        id="cantidad"
                        type="number"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        placeholder="0"
                        min="0"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="stockMinimo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stock Mínimo</label>
                    <input
                        id="stockMinimo"
                        type="number"
                        value={stockMinimo}
                        onChange={(e) => setStockMinimo(e.target.value)}
                        placeholder="0"
                        min="0"
                        disabled={loading}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', gridColumn: 'span 2', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ flex: 1 }}
                    >
                        {loading ? 'Guardando...' : (productoAEditar ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                    {productoAEditar && onSuccess && (
                        <button
                            type="button"
                            onClick={onSuccess}
                            style={{ flex: 1, backgroundColor: '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ProductoForm
