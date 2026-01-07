import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const userData = await authService.login(credentials);
        setUser(userData);
        return userData;
    };

    const register = async (userData) => {
        const newUser = await authService.register(userData);
        setUser(newUser);
        return newUser;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
