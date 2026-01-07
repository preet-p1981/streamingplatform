// src/services/commentService.js
import api from './api';

export const commentService = {
    /**
     * Add a comment to a video
     * @param {number} videoId - The ID of the video
     * @param {string} content - The comment content
     * @param {number|null} parentCommentId - Optional parent comment ID for replies
     * @returns {Promise<Object>} The created comment
     */
    addComment: async (videoId, content, parentCommentId = null) => {
        const response = await api.post(`/comments/video/${videoId}`, {
            content,
            parentCommentId,
        });
        return response.data;
    },

    /**
     * Get all comments for a video
     * @param {number} videoId - The ID of the video
     * @param {number} page - Page number (default: 0)
     * @param {number} size - Page size (default: 20)
     * @returns {Promise<Array>} List of comments
     */
    getVideoComments: async (videoId, page = 0, size = 20) => {
        const response = await api.get(`/comments/video/${videoId}`, {
            params: { page, size },
        });
        return response.data;
    },

    /**
     * Get replies for a specific comment
     * @param {number} commentId - The ID of the parent comment
     * @returns {Promise<Array>} List of reply comments
     */
    getCommentReplies: async (commentId) => {
        const response = await api.get(`/comments/${commentId}/replies`);
        return response.data;
    },

    /**
     * Get total comment count for a video
     * @param {number} videoId - The ID of the video
     * @returns {Promise<number>} Total comment count
     */
    getCommentCount: async (videoId) => {
        const response = await api.get(`/comments/video/${videoId}/count`);
        return response.data;
    },

    /**
     * Delete a comment
     * @param {number} commentId - The ID of the comment to delete
     * @returns {Promise<void>}
     */
    deleteComment: async (commentId) => {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    },

    /**
     * Update a comment (if you want to add edit functionality later)
     * @param {number} commentId - The ID of the comment
     * @param {string} content - New comment content
     * @returns {Promise<Object>} Updated comment
     */
    updateComment: async (commentId, content) => {
        const response = await api.put(`/comments/${commentId}`, { content });
        return response.data;
    },

    /**
     * Like a comment (if you want to add this feature later)
     * @param {number} commentId - The ID of the comment
     * @returns {Promise<void>}
     */
    likeComment: async (commentId) => {
        const response = await api.post(`/comments/${commentId}/like`);
        return response.data;
    },
};

export default commentService;