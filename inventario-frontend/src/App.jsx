import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

// Context & Utils
import { useAuth } from './context/AuthContext'
import './App.css'

// Layout & Components
import Navbar from './components/Layout/Navbar'
import Login from './components/Login'

// Pages
import Inventario from './pages/Inventario'
import NuevoProducto from './pages/NuevoProducto'
import HistorialVentas from './pages/HistorialVentas'
import Configuracion from './pages/Configuracion'

function App() {
  const { isAuthenticated, logout, loadingAuth } = useAuth()

  // Estado Global de Datos
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])

  // Estado UI Global
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Estado para disparar recargas en componentes hijos
  const [refreshHistory, setRefreshHistory] = useState(0)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Cargamos todo de una vez
      const [prodRes, catRes, marRes] = await Promise.all([
        axios.get('/productos'),
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
  }, [])

  // Carga inicial al autenticarse
  useEffect(() => {
    if (loadingAuth) return;
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, loadingAuth, fetchData])

  // --- Manejadores Globales (passed down to pages) ---

  const handleVender = async (id, cantidad) => {
    try {
      await axios.put(`/productos/${id}/vender?cantidad=${cantidad}`, {})
      fetchData() // Recarga productos
      setRefreshHistory(prev => prev + 1) // Avisa al historial
      toast.success("Venta registrada con éxito")
    } catch (err) {
      if (err.response && err.response.status === 400) {
        toast.error(err.response.data)
      } else {
        console.error("Error selling product:", err)
        toast.error("Error al registrar la venta.")
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      await axios.delete(`/productos/${id}`)
      fetchData()
      toast.success("Producto eliminado correctamente")
    } catch (err) {
      console.error("Error deleting product:", err)
      toast.error("Error al eliminar el producto. Inténtelo de nuevo.")
    }
  }

  const handleActualizar = async (id, productoActualizado) => {
    try {
      await axios.put(`/productos/${id}`, productoActualizado)
      fetchData()
      toast.success("Producto actualizado")
    } catch (err) {
      console.error("Error updating product:", err)
      toast.error("Error al actualizar el producto.")
    }
  }

  // --- Renderizado Condicional de Auth ---

  if (loadingAuth) {
    return <div className="loading" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 className="animate-spin" size={48} />
    </div>
  }

  if (!isAuthenticated) {
    return <Login />
  }

  // Si está autenticado, mostramos el Router con el Layout principal
  return (
    <Router>
      <div className="app-container">
        <Toaster position="top-right" />
        <Navbar />

        {/* Header con Logout rápido */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '2rem' }}>
          <button onClick={logout} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#e2e8f0', color: '#475569' }}>
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <div className="text-error text-center" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {error}
            <button onClick={fetchData} className="btn-primary" style={{ maxWidth: '200px' }}>Reintentar Sincronización</button>
          </div>
        )}

        {/* Contenido principal enrutado */}
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <Inventario
                  productos={productos}
                  categorias={categorias}
                  marcas={marcas}
                  loading={loading}
                  error={error}
                  onVender={handleVender}
                  onEliminar={handleDelete}
                  onActualizar={handleActualizar}
                  onRefresh={fetchData}
                />
              }
            />
            <Route
              path="/nuevo"
              element={
                <NuevoProducto
                  fetchData={fetchData}
                  categorias={categorias}
                  marcas={marcas}
                />
              }
            />
            <Route
              path="/historial"
              element={
                <HistorialVentas refreshTrigger={refreshHistory} />
              }
            />
            <Route
              path="/configuracion"
              element={
                <Configuracion
                  categorias={categorias}
                  marcas={marcas}
                  fetchData={fetchData}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
