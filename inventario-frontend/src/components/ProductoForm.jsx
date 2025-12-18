import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Plus, X, Save } from 'lucide-react'

const ProductoForm = ({ onSuccess, productoAEditar, onActualizar, categorias = [], marcas = [], onRefreshData }) => {
    const [nombre, setNombre] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [precio, setPrecio] = useState('')
    const [precioCosto, setPrecioCosto] = useState('')
    const [stockMinimo, setStockMinimo] = useState('')
    const [categoriaId, setCategoriaId] = useState('')
    const [marcaId, setMarcaId] = useState('')

    const [loading, setLoading] = useState(false)

    // Estado para Modal de Creación Rápida
    const [showModal, setShowModal] = useState(null) // 'categoria' | 'marca' | null
    const [newItemName, setNewItemName] = useState('')
    const [savingItem, setSavingItem] = useState(false)

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

        if (!nombre || cantidad === '' || precio === '' || categoriaId === '' || marcaId === '') {
            toast.error("Todos los campos obligatorios deben completarse")
            setLoading(false)
            return
        }

        if (parseFloat(precio) < parseFloat(precioCosto)) {
            toast.error("El Precio de Venta no puede ser menor al Costo. ¡Perderías dinero!");
            setLoading(false)
            return;
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

                toast.success("¡Producto creado con éxito!")
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
            let errorFeedback = "Error al guardar el producto.";
            if (err.response) {
                const status = err.response.status;
                const data = err.response.data;
                const backendMessage = data?.message || (typeof data === 'string' ? data : JSON.stringify(data));
                errorFeedback = `Error (${status}): ${backendMessage || 'Sin detalles del servidor'}`;
            }
            toast.error(errorFeedback, { duration: 5000 });
        } finally {
            setLoading(false)
        }
    }

    const brandsAreEmpty = (m) => !m || m.length === 0;

    // --- Lógica de Creación Rápida ---

    const handleSelectChange = (e, type) => {
        const value = e.target.value;
        if (value === '__NEW__') {
            setShowModal(type);
            setNewItemName('');
        } else {
            if (type === 'categoria') setCategoriaId(value);
            if (type === 'marca') setMarcaId(value);
        }
    };

    const handleSaveNewItem = async () => {
        if (!newItemName.trim()) return toast.error("El nombre no puede estar vacío");
        setSavingItem(true);
        try {
            let endpoint = showModal === 'categoria' ? '/categorias' : '/marcas';

            // Si es marca, intentamos vincularla a la categoría seleccionada (si existe)
            const payload = { nombre: newItemName };
            if (showModal === 'marca' && categoriaId) {
                payload.categorias = [{ id: parseInt(categoriaId) }];
            }

            const response = await axios.post(endpoint, payload);
            const newItem = response.data; // El backend debería devolver el objeto creado con ID

            toast.success(`${showModal === 'categoria' ? 'Categoría' : 'Marca'} creada y seleccionada`);

            // Recargar listas desde el padre
            if (onRefreshData) {
                await onRefreshData(); // Actualiza props categorias y marcas
            }

            // Seleccionar automáticamente
            if (newItem && newItem.id) {
                if (showModal === 'categoria') setCategoriaId(newItem.id);
                if (showModal === 'marca') setMarcaId(newItem.id);
            }

            setShowModal(null);
            setNewItemName('');

        } catch (error) {
            console.error(error);
            toast.error("Error al crear el elemento");
        } finally {
            setSavingItem(false);
        }
    };

    return (
        <div className="card" style={{ position: 'relative', ...(productoAEditar ? { border: 'none', shadow: 'none', padding: 0, margin: 0 } : {}) }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                {productoAEditar ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>

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
                        onChange={(e) => handleSelectChange(e, 'categoria')}
                        className="form-control"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    >
                        <option value="">Seleccione...</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                        <option value="__NEW__" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Agregar nueva...</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="marca" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Marca</label>
                    <select
                        id="marca"
                        value={marcaId}
                        onChange={(e) => handleSelectChange(e, 'marca')}
                        className="form-control"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                    >
                        <option value="">Seleccione...</option>
                        {marcas.filter(m => {
                            if (!categoriaId) return true;
                            if (!m.categorias || m.categorias.length === 0) return false;
                            return m.categorias.some(c => c.id == categoriaId || c.nombre === 'Otros');
                        }).map(m => (
                            <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                        <option value="__NEW__" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>+ Agregar nueva...</option>
                    </select>
                </div>

                {/* Resto del formulario... */}
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

            {/* MODAL para Crear Categoría/Marca */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(2px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                    borderRadius: '12px'
                }}>
                    <div className="fade-in" style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                        width: '90%',
                        maxWidth: '400px'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#334155' }}>
                            Agregar Nueva {showModal === 'categoria' ? 'Categoría' : 'Marca'}
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Nombre</label>
                            <input
                                autoFocus
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder={`Nombre de la nueva ${showModal}`}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                            {showModal === 'marca' && categoriaId && (
                                <p style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '0.5rem' }}>
                                    * Se vinculará automáticamente a la categoría seleccionada.
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={handleSaveNewItem}
                                className="btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                disabled={savingItem}
                            >
                                {savingItem ? 'Guardando...' : <><Save size={18} /> Guardar</>}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowModal(null); setNewItemName(''); }}
                                style={{ flex: 1, background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                disabled={savingItem}
                            >
                                <X size={18} /> Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductoForm
