// src/services/subscriptionService.js
import api from './api';

export const subscriptionService = {
    /**
     * Subscribe to a channel
     */
    subscribe: async (channelId) => {
        const response = await api.post(`/subscriptions/channel/${channelId}`);
        return response.data;
    },

    /**
     * Unsubscribe from a channel
     */
    unsubscribe: async (channelId) => {
        const response = await api.delete(`/subscriptions/channel/${channelId}`);
        return response.data;
    },

    /**
     * Check if user is subscribed to a channel
     */
    checkSubscription: async (channelId) => {
        const response = await api.get(`/subscriptions/check/${channelId}`);
        return response.data;
    },

    /**
     * Get all channels user is subscribed to
     */
    getSubscriptions: async () => {
        const response = await api.get('/subscriptions/my');
        return response.data;
    },

    /**
     * Get subscriber count for a channel
     */
    getSubscriberCount: async (channelId) => {
        const response = await api.get(`/subscriptions/count/${channelId}`);
        return response.data;
    }
};

export default subscriptionService;