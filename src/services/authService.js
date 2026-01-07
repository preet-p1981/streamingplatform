// src/services/authService.js
import api from './api';

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Store only the user object, not the entire response
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                // If backend returns user data at root level, store it properly
                const { token, ...user } = response.data;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Store only the user object, not the entire response
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                // If backend returns user data at root level, store it properly
                const { token, ...user } = response.data;
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            const user = JSON.parse(userStr);
            // Ensure user has an id field
            if (!user.id) {
                console.error('User object missing id field:', user);
                return null;
            }
            return user;
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            return null;
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Helper to refresh user data
    async refreshUserData() {
        try {
            const response = await api.get('/users/me');
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                return response.data;
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    },
};

export default authService;