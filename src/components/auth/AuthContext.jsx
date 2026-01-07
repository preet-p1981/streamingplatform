import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();

        setUser(currentUser);
        setIsAuthenticated(authenticated);
        setLoading(false);
    };

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};