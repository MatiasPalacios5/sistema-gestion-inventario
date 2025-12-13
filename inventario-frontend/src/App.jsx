import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductoForm from './components/ProductoForm'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/productos', {
        auth: {
          username: 'admin',
          password: '1234'
        }
      })
      setProductos(response.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Error al cargar los productos. Verifique las credenciales o el servidor.")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductos()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      await axios.delete(`http://localhost:8080/productos/${id}`, {
        auth: {
          username: 'admin',
          password: '1234'
        }
      })
      // Recargar lista tras eliminación exitosa
      fetchProductos()
    } catch (err) {
      console.error("Error deleting product:", err)
      alert("Error al eliminar el producto. Inténtelo de nuevo.")
    }
  }



  return (
    <div className="container">
      <h1>Inventario de Productos</h1>

      <ProductoForm onSuccess={fetchProductos} />

      {loading && <p className="loading">Cargando productos...</p>}

      {error && <div className="text-error text-center" style={{ marginBottom: '1rem' }}>{error}</div>}

      {!loading && !error && (
        <div className="card">
          <ul>
            {productos.map((producto, index) => (
              <li key={producto.id || index} className="product-item">
                <div className="product-info">
                  <strong>{producto.nombre}</strong>
                  <div className="product-details">
                    <span>Stock: {producto.stock}</span>
                    <span>Precio: ${producto.precio}</span>
                  </div>
                </div>

                <button
                  className="btn-delete"
                  onClick={() => handleDelete(producto.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
