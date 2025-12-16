import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductoForm from './components/ProductoForm'
import ProductoItem from './components/ProductoItem'
import VentaHistorial from './components/VentaHistorial'
import './App.css'

function App() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshHistory, setRefreshHistory] = useState(0)

  const fetchProductos = async () => {
    try {
      const response = await axios.get('/productos', {
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

  const handleVender = async (id, cantidad) => {
    try {
      await axios.put(`/productos/${id}/vender?cantidad=${cantidad}`, {}, {
        auth: {
          username: 'admin',
          password: '1234'
        }
      })
      fetchProductos()
      setRefreshHistory(prev => prev + 1)
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data)
      } else {
        console.error("Error selling product:", err)
        alert("Error al registrar la venta.")
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      await axios.delete(`/productos/${id}`, {
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

  const handleActualizar = async (id, productoActualizado) => {
    try {
      await axios.put(`/productos/${id}`, productoActualizado, {
        auth: {
          username: 'admin',
          password: '1234'
        }
      })
      fetchProductos()
    } catch (err) {
      console.error("Error updating product:", err)
      alert("Error al actualizar el producto.")
    }
  }



  return (
    <div className="container">
      <h1>Inventario de Productos</h1>

      <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }} className="text-muted">
        Valor Total del Inventario: {productos.reduce((acc, curr) => acc + (curr.precio * curr.stock), 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
      </div>

      <ProductoForm onSuccess={fetchProductos} />

      {loading && <p className="loading">Cargando productos...</p>}

      {error && <div className="text-error text-center" style={{ marginBottom: '1rem' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {productos.map((producto, index) => (
            <ProductoItem
              key={producto.id || index}
              producto={producto}
              onVender={handleVender}
              onEliminar={handleDelete}
              onActualizar={handleActualizar}
            />
          ))}
        </div>
      )}

      <VentaHistorial shouldRefresh={refreshHistory} />
    </div>
  )
}

export default App
