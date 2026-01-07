// src/services/userService.js
import api from './api';

export const userService = {
    /**
     * Get current logged-in user
     */
    getCurrentUser: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    /**
     * Get user by ID
     */
    getUserById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (fullName, channelDescription, profilePicture) => {
        const formData = new FormData();

        if (fullName) formData.append('fullName', fullName);
        if (channelDescription) formData.append('channelDescription', channelDescription);
        if (profilePicture) formData.append('profilePicture', profilePicture);

        const response = await api.put('/users/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default userService;