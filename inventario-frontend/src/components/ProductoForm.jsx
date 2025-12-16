import { useState, useEffect } from 'react'
import axios from 'axios'

const ProductoForm = ({ onSuccess, productoAEditar, onActualizar }) => {
    const [nombre, setNombre] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    useEffect(() => {
        if (productoAEditar) {
            setNombre(productoAEditar.nombre)
            setCantidad(productoAEditar.stock) // Nota: el backend usa 'stock', el form usa 'cantidad'
            setPrecio(productoAEditar.precio)
        }
    }, [productoAEditar])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMsg(null)

        // Validación básica
        if (!nombre || cantidad === '' || precio === '') {
            setError("Todos los campos son obligatorios")
            setLoading(false)
            return
        }

        const payload = {
            nombre,
            stock: parseInt(cantidad),
            precio: parseFloat(precio)
        }

        try {
            if (productoAEditar) {
                // Modo Edición
                await onActualizar(productoAEditar.id, payload)
                // En modo edición, no limpiamos el form necesariamente, pero podemos notificar éxito
                // La responsabilidad de cerrar el form recae en el padre (ProductoItem) si es necesario,
                // o onSuccess puede usarse para cerrar el modo edición.
                if (onSuccess) onSuccess()
            } else {
                // Modo Creación
                await axios.post('http://localhost:8080/productos', payload, {
                    auth: {
                        username: 'admin',
                        password: '1234'
                    }
                })

                setSuccessMsg("¡Producto creado con éxito!")
                // Limpiar formulario solo en creación
                setNombre('')
                setCantidad('')
                setPrecio('')

                if (onSuccess) onSuccess()
            }

        } catch (err) {
            console.error("Error saving product:", err)
            setError("Error al guardar el producto. Verifique los datos o la conexión.")
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

            <form onSubmit={handleSubmit}>
                <div className="form-group">
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
                    <label htmlFor="cantidad" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Cantidad</label>
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
                    <label htmlFor="precio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Precio</label>
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

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : (productoAEditar ? 'Guardar Cambios' : 'Crear Producto')}
                    </button>
                    {productoAEditar && onSuccess && (
                        <button
                            type="button"
                            onClick={onSuccess} // Usamos onSuccess como "Cancel/Close" también
                            style={{ marginTop: '1rem', backgroundColor: '#94a3b8', color: 'white', border: 'none' }}
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
