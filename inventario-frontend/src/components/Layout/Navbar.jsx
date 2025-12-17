import { Link, useLocation } from 'react-router-dom';
import { Package, PlusCircle, History, Settings } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav style={{
            backgroundColor: 'var(--primary)',
            padding: '0 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            boxShadow: 'var(--shadow)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', letterSpacing: '-0.025em' }}>
                System<span style={{ color: '#3b82f6' }}>Inventory</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
                <Link to="/" style={linkStyle(isActive('/'))}>
                    <Package size={18} style={{ marginRight: '6px' }} />
                    Inventario
                </Link>
                <Link to="/nuevo" style={linkStyle(isActive('/nuevo'))}>
                    <PlusCircle size={18} style={{ marginRight: '6px' }} />
                    Nuevo
                </Link>
                <Link to="/historial" style={linkStyle(isActive('/historial'))}>
                    <History size={18} style={{ marginRight: '6px' }} />
                    Ventas
                </Link>
                <Link to="/configuracion" style={linkStyle(isActive('/configuracion'))}>
                    <Settings size={18} style={{ marginRight: '6px' }} />
                    Configuración
                </Link>
            </div>
        </nav>
    );
};

const linkStyle = (isActive) => ({
    textDecoration: 'none',
    color: isActive ? 'white' : '#94a3b8',
    fontWeight: 500,
    fontSize: '0.95rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
    paddingTop: '3px', // Compensate for border
    transition: 'all 0.2s'
});

export default Navbar;
