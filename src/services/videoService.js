// src/services/videoService.js
import api from './api';

export const videoService = {
    // Video operations
    getPublicVideos: async (page = 0, size = 12) => {
        const response = await api.get('/videos/public', {
            params: { page, size }
        });
        return response.data;
    },

    getVideoById: async (id) => {
        const response = await api.get(`/videos/${id}`);
        return response.data;
    },

    getTrendingVideos: async () => {
        const response = await api.get('/videos/trending');
        return response.data;
    },

    getLatestVideos: async () => {
        const response = await api.get('/videos/latest');
        return response.data;
    },

    getUserVideos: async (userId, page = 0, size = 12) => {
        const response = await api.get(`/videos/user/${userId}`, {
            params: { page, size }
        });
        return response.data;
    },

    uploadVideo: async (videoData, videoFile, thumbnailFile) => {
        const formData = new FormData();

        formData.append('video', videoFile);

        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile);
        }

        const videoDataToSend = {
            title: videoData.title,
            description: videoData.description || '',
            category: videoData.category || '',
            status: videoData.status || 'public',
            tags: videoData.tags || []
        };

        formData.append('data', JSON.stringify(videoDataToSend));

        const response = await api.post('/videos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteVideo: async (videoId) => {
        const response = await api.delete(`/videos/${videoId}`);
        return response.data;
    },

    // Like/Dislike operations
    likeVideo: async (videoId) => {
        const response = await api.post(`/videos/${videoId}/like`);
        return response.data;
    },

    dislikeVideo: async (videoId) => {
        const response = await api.post(`/videos/${videoId}/dislike`);
        return response.data;
    },

    getLikeStatus: async (videoId) => {
        const response = await api.get(`/videos/${videoId}/like-status`);
        return response.data;
    },

    // View operations
    incrementView: async (videoId) => {
        const response = await api.post(`/videos/${videoId}/view`);
        return response.data;
    },

    // Search
    searchVideos: async (query, page = 0, size = 12) => {
        const response = await api.get('/videos/search', {
            params: { q: query, page, size }
        });
        return response.data;
    },

    // Subscription feed
    getSubscribedVideos: async (page = 0, size = 12) => {
        const response = await api.get('/videos/subscriptions', {
            params: { page, size }
        });
        return response.data;
    },

    // Subscription operations
    toggleSubscription: async (channelId) => {
        const response = await api.post(`/users/${channelId}/subscribe`);
        return response.data;
    },

    checkSubscription: async (channelId) => {
        const response = await api.get(`/users/${channelId}/subscription-status`);
        return response.data;
    },
    getUserVideos: async (userId, page = 0, size = 12) => {
        const response = await api.get(`/videos/user/${userId}`, {
            params: {page, size}
        });
        return response.data;
    },
};

export default videoService;