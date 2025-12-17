import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Edit2, Trash2, Plus, Save, X } from 'lucide-react'

const CrudSection = ({ title, data, endpoint, onRefresh }) => {
    const [isCreating, setIsCreating] = useState(false)
    const [newItemName, setNewItemName] = useState('')

    // Estado para edición
    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este elemento?")) return;
        try {
            await axios.delete(`${endpoint}/${id}`)
            toast.success("Eliminado correctamente")
            onRefresh()
        } catch (error) {
            console.error(error)
            if (error.response && error.response.status === 400) {
                const mensaje = typeof error.response.data === 'string'
                    ? error.response.data
                    : (error.response.data.message || "No se puede eliminar este elemento.");
                toast.error(mensaje);
            } else {
                toast.error("Error al eliminar. Puede que esté en uso.")
            }
        }
    }

    const handleCreate = async () => {
        if (!newItemName.trim()) return toast.error("El nombre no puede estar vacío");
        try {
            await axios.post(endpoint, { nombre: newItemName })
            toast.success("Creado con éxito")
            setNewItemName('')
            setIsCreating(false)
            onRefresh()
        } catch (error) {
            console.error(error)
            toast.error("Error al crear")
        }
    }

    const startEdit = (item) => {
        setEditingId(item.id)
        setEditName(item.nombre)
    }

    const handleUpdate = async () => {
        if (!editName.trim()) return toast.error("El nombre no puede estar vacío");
        try {
            await axios.put(`${endpoint}/${editingId}`, { nombre: editName })
            toast.success("Actualizado correctamente")
            setEditingId(null)
            setEditName('')
            onRefresh()
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar")
        }
    }

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreating(true)}
                    disabled={isCreating}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem' }}
                >
                    <Plus size={18} /> Nuevo
                </button>
            </div>

            {isCreating && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={`Nombre de ${title.slice(0, -1)}`} // Truco simple para singular
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                        autoFocus
                    />
                    <button className="btn-primary" onClick={handleCreate} title="Guardar">
                        <Save size={18} />
                    </button>
                    <button
                        onClick={() => { setIsCreating(false); setNewItemName('') }}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
                        title="Cancelar"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem', width: '120px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{item.id}</td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                    {editingId === item.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #3b82f6' }}
                                        />
                                    ) : (
                                        <span style={{ fontWeight: 500 }}>{item.nombre}</span>
                                    )}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                                    {editingId === item.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={handleUpdate} className="text-success" title="Guardar" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <Save size={18} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="text-danger" title="Cancelar" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => startEdit(item)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    No hay registros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const MarcaSection = ({ data, categories, endpoint, onRefresh }) => {
    const [isCreating, setIsCreating] = useState(false)
    const [newItemName, setNewItemName] = useState('')
    const [selectedCatIds, setSelectedCatIds] = useState([])

    const [editingId, setEditingId] = useState(null)
    const [editName, setEditName] = useState('')
    const [editCatIds, setEditCatIds] = useState([])

    const toggleCat = (id, currentList, setList) => {
        if (currentList.includes(id)) {
            setList(currentList.filter(c => c !== id))
        } else {
            setList([...currentList, id])
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta marca?")) return;
        try {
            await axios.delete(`${endpoint}/${id}`)
            toast.success("Eliminado correctamente")
            onRefresh()
        } catch (error) {
            console.error(error)
            if (error.response && error.response.status === 400) {
                const mensaje = typeof error.response.data === 'string'
                    ? error.response.data
                    : (error.response.data.message || "No se puede eliminar esta marca.");
                toast.error(mensaje);
            } else {
                toast.error("Error al eliminar.")
            }
        }
    }

    const handleCreate = async () => {
        if (!newItemName.trim()) return toast.error("El nombre no puede estar vacío");
        try {
            const payload = {
                nombre: newItemName,
                categorias: selectedCatIds.map(id => ({ id }))
            }
            await axios.post(endpoint, payload)
            toast.success("Marca creada con éxito")
            setNewItemName('')
            setSelectedCatIds([])
            setIsCreating(false)
            onRefresh()
        } catch (error) {
            console.error(error)
            toast.error("Error al crear")
        }
    }

    const startEdit = (item) => {
        setEditingId(item.id)
        setEditName(item.nombre)
        setEditCatIds(item.categorias ? item.categorias.map(c => c.id) : [])
    }

    const handleUpdate = async () => {
        if (!editName.trim()) return toast.error("El nombre no puede estar vacío");
        try {
            const payload = {
                nombre: editName,
                categorias: editCatIds.map(id => ({ id }))
            }
            await axios.put(`${endpoint}/${editingId}`, payload)
            toast.success("Actualizado correctamente")
            setEditingId(null)
            setEditName('')
            setEditCatIds([])
            onRefresh()
        } catch (error) {
            console.error(error)
            toast.error("Error al actualizar")
        }
    }

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Marcas</h3>
                <button
                    className="btn-primary"
                    onClick={() => setIsCreating(true)}
                    disabled={isCreating}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '0.5rem 1rem' }}
                >
                    <Plus size={18} /> Nueva
                </button>
            </div>

            {isCreating && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="Nombre de Marca"
                            style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
                            autoFocus
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Asociar Categorías:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCat(cat.id, selectedCatIds, setSelectedCatIds)}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '15px',
                                        border: '1px solid',
                                        borderColor: selectedCatIds.includes(cat.id) ? 'var(--primary)' : '#cbd5e1',
                                        backgroundColor: selectedCatIds.includes(cat.id) ? 'var(--primary)' : 'white',
                                        color: selectedCatIds.includes(cat.id) ? 'white' : '#64748b',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-primary" onClick={handleCreate} title="Guardar">
                            <Save size={18} /> Guardar
                        </button>
                        <button
                            onClick={() => { setIsCreating(false); setNewItemName(''); setSelectedCatIds([]) }}
                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                            title="Cancelar"
                        >
                            <X size={18} /> Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Nombre</th>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Categorías</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem', width: '120px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.75rem 0.5rem', verticalAlign: 'top' }}>
                                    {editingId === item.id ? (
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #3b82f6' }}
                                        />
                                    ) : (
                                        <span style={{ fontWeight: 500 }}>{item.nombre}</span>
                                    )}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                    {editingId === item.id ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => toggleCat(cat.id, editCatIds, setEditCatIds)}
                                                    style={{
                                                        padding: '0.1rem 0.4rem',
                                                        borderRadius: '10px',
                                                        border: '1px solid',
                                                        borderColor: editCatIds.includes(cat.id) ? 'var(--primary)' : '#cbd5e1',
                                                        backgroundColor: editCatIds.includes(cat.id) ? 'var(--primary)' : 'white',
                                                        color: editCatIds.includes(cat.id) ? 'white' : '#64748b',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {cat.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {item.categorias && item.categorias.map(c => (
                                                <span key={c.id} style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                                                    {c.nombre}
                                                </span>
                                            ))}
                                            {(!item.categorias || item.categorias.length === 0) && <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Sin categorías</span>}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', verticalAlign: 'top' }}>
                                    {editingId === item.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button onClick={handleUpdate} className="text-success" title="Guardar cambios" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <Save size={18} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="text-danger" title="Cancelar" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => startEdit(item)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    No hay marcas registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Configuracion = ({ categorias, marcas, fetchData }) => {
    return (
        <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Configuración de Datos Maestros</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    <CrudSection
                        title="Categorías"
                        data={categorias}
                        endpoint="/categorias"
                        onRefresh={fetchData}
                    />
                </div>

                <MarcaSection
                    data={marcas}
                    categories={categorias}
                    endpoint="/marcas"
                    onRefresh={fetchData}
                />
            </div>
        </div>
    );
};

export default Configuracion;
