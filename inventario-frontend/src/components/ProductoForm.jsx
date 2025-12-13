import { useState } from 'react'
import axios from 'axios'

const ProductoForm = ({ onSuccess }) => {
    const [nombre, setNombre] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMsg(null)

        // Validación básica
        if (!nombre || !cantidad || !precio) {
            setError("Todos los campos son obligatorios")
            setLoading(false)
            return
        }

        try {
            // Mapeamos 'cantidad' a 'stock' para la API
            const payload = {
                nombre,
                stock: parseInt(cantidad), // Asegurar que sea número
                precio: parseFloat(precio) // Asegurar que sea número con decimales
            }

            await axios.post('http://localhost:8080/productos', payload, {
                auth: {
                    username: 'admin',
                    password: '1234'
                }
            })

            setSuccessMsg("¡Producto creado con éxito!")
            // Limpiar formulario
            setNombre('')
            setCantidad('')
            setPrecio('')

            // Notificar al padre si existe la función
            if (onSuccess) onSuccess()

        } catch (err) {
            console.error("Error creating product:", err)
            setError("Error al crear el producto. Verifique los datos o la conexión.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Nuevo Producto</h2>

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

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Crear Producto'}
                </button>
            </form>
        </div>
    )
}

export default ProductoForm

