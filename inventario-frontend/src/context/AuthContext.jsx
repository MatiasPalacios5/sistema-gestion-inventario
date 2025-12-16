import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);

    // Función para configurar el token en Axios
    const setupAxiosInterceptor = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    useEffect(() => {
        // Verificar si hay un token al cargar la app
        const token = localStorage.getItem('token');
        if (token) {
            setupAxiosInterceptor(token);
            setIsAuthenticated(true);
        }
        setLoadingAuth(false);

        // Configurar interceptor de Axios como respaldo
        const interceptor = axios.interceptors.request.use(
            config => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = token;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username,
                password
            });

            if (response.data && response.data.token) {
                const token = `Bearer ${response.data.token}`;
                localStorage.setItem('token', token);
                // Configuración inmediata
                setupAxiosInterceptor(token);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setupAxiosInterceptor(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
