import VentaHistorial from '../components/VentaHistorial';

const HistorialVentas = ({ refreshTrigger }) => {
    return (
        <div className="fade-in">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Registro de Transacciones</h1>
            <VentaHistorial shouldRefresh={refreshTrigger} />
        </div>
    );
};

export default HistorialVentas;
