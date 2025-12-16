import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductoForm from './components/ProductoForm'
import ProductoItem from './components/ProductoItem'
import VentaHistorial from './components/VentaHistorial'
import Login from './components/Login'
import { useAuth } from './context/AuthContext'
import './App.css'

function App() {
  const { isAuthenticated, logout, loadingAuth } = useAuth()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshHistory, setRefreshHistory] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const urlProducts = searchTerm ? `/productos?search=${searchTerm}` : '/productos'

      const [prodRes, catRes, marRes] = await Promise.all([
        axios.get(urlProducts),
        axios.get('/categorias'),
        axios.get('/marcas')
      ])

      setProductos(prodRes.data)
      setCategorias(Array.isArray(catRes.data) ? catRes.data : [])
      setMarcas(Array.isArray(marRes.data) ? marRes.data : [])
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Error al cargar los datos del sistema. Por favor reintente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loadingAuth) return;

    if (isAuthenticated) {
      fetchData()
    }
  }, [searchTerm, isAuthenticated, loadingAuth])

  const handleVender = async (id, cantidad) => {
    try {
      await axios.put(`/productos/${id}/vender?cantidad=${cantidad}`, {})
      fetchData()
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
      await axios.delete(`/productos/${id}`)
      // Recargar lista tras eliminación exitosa
      fetchData()
    } catch (err) {
      console.error("Error deleting product:", err)
      alert("Error al eliminar el producto. Inténtelo de nuevo.")
    }
  }

  const handleActualizar = async (id, productoActualizado) => {
    try {
      await axios.put(`/productos/${id}`, productoActualizado)
      fetchData()
    } catch (err) {
      console.error("Error updating product:", err)
      alert("Error al actualizar el producto.")
    }
  }

  if (loadingAuth) {
    return <div className="loading" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando sistema...</div>
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Inventario de Productos</h1>
        <button onClick={logout} style={{ backgroundColor: '#64748b', color: 'white' }}>
          Logout
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }} className="text-muted">
        Valor Total del Inventario: {productos.reduce((acc, curr) => acc + (curr.precio * curr.stock), 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
      </div>

      <ProductoForm
        onSuccess={fetchData}
        categorias={categorias}
        marcas={marcas}
      />

      {loading && <p className="loading" style={{ textAlign: 'center', margin: '2rem 0' }}>Cargando datos del sistema...</p>}

      {error && (
        <div className="text-error text-center" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          {error}
          <button onClick={fetchData} className="btn-primary" style={{ maxWidth: '200px' }}>Reintentar</button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {productos.map((producto, index) => (
            <ProductoItem
              key={producto.id || index}
              producto={producto}
              onVender={handleVender}
              onEliminar={handleDelete}
              onActualizar={handleActualizar}
              categorias={categorias}
              marcas={marcas}
            />
          ))}
        </div>
      )}

      <VentaHistorial shouldRefresh={refreshHistory} />
    </div>
  )
}

export default App
