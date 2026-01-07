// src/services/subscriptionService.js
import api from './api';

export const subscriptionService = {
    /**
     * Toggle subscription to a channel
     * @param {number} channelId - The ID of the channel
     * @returns {Promise<void>}
     */
    toggleSubscription: async (channelId) => {
        const response = await api.post(`/users/${channelId}/subscribe`);
        return response.data;
    },

    /**
     * Check if user is subscribed to a channel
     * @param {number} channelId - The ID of the channel
     * @returns {Promise<boolean>} Subscription status
     */
    checkSubscription: async (channelId) => {
        const response = await api.get(`/users/${channelId}/subscription-status`);
        return response.data;
    },

    /**
     * Get all channels user is subscribed to
     * @returns {Promise<Array>} List of subscribed channels
     */
    getSubscriptions: async () => {
        const response = await api.get('/users/subscriptions');
        return response.data;
    },

    /**
     * Get subscriber count for a channel
     * @param {number} channelId - The ID of the channel
     * @returns {Promise<number>} Subscriber count
     */
    getSubscriberCount: async (channelId) => {
        const response = await api.get(`/users/${channelId}/subscribers/count`);
        return response.data;
    },
};

export default subscriptionService;