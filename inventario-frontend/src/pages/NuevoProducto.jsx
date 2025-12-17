import ProductoForm from '../components/ProductoForm';
import { useNavigate } from 'react-router-dom';

const NuevoProducto = ({ fetchData, categorias, marcas }) => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        fetchData();
        // Redirigir al inventario tras crear
        navigate('/');
    };

    return (
        <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Registrar Nuevo Producto</h1>
            <ProductoForm
                onSuccess={handleSuccess}
                categorias={categorias}
                marcas={marcas}
            />
        </div>
    );
};

export default NuevoProducto;
