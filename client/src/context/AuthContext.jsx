import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, getMe } from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On every app load, ALWAYS validate token and get fresh user data from DB
    // This ensures old tokens (missing role field) still produce correct user.role
    useEffect(() => {
        const token = localStorage.getItem('z-era-token');
        if (token) {
            getMe()
                .then(data => setUser(data.user))
                .catch(() => {
                    // Token is invalid — clear it
                    localStorage.removeItem('z-era-token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const data = await apiLogin({ email, password });
        localStorage.setItem('z-era-token', data.token);
        // Always set user from the API response (includes role)
        setUser(data.user);
        return data;
    };

    const signup = async (name, email, password, phone) => {
        const data = await apiSignup({ name, email, password, phone });
        localStorage.setItem('z-era-token', data.token);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('z-era-token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
