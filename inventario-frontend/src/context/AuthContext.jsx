import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar si hay un token al cargar la app
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }

        // Configurar interceptor de Axios
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

        // Limpiar interceptor al desmontar (aunque AuthProvider suele ser permanente)
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
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
