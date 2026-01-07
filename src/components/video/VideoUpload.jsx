import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoService } from '../../services/videoService';
import toast from 'react-hot-toast';
import { FaVideo, FaImage } from 'react-icons/fa';

const VideoUpload = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        status: 'public',
    });
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!videoFile) {
            toast.error('Please select a video file');
            return;
        }

        setLoading(true);

        try {
            const videoData = {
                ...formData,
                tags: formData.tags.split(',').map((tag) => tag.trim()),
            };

            await videoService.uploadVideo(videoData, videoFile, thumbnailFile);
            toast.success('Video uploaded successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 ml-64 mt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FaVideo className="text-blue-600 text-2xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Upload Video</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Video File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video File <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <FaVideo className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a video</span>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                required
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    {videoFile && (
                                        <p className="text-sm text-green-600 font-medium">
                                            ✓ {videoFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail (Optional)
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a thumbnail</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailChange}
                                                className="sr-only"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    {thumbnailFile && (
                                        <p className="text-sm text-green-600 font-medium">
                                            ✓ {thumbnailFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter video title"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Tell viewers about your video"
                            />
                        </div>

                        {/* Category & Privacy Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Music">Music</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Education">Education</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Technology">Technology</option>
                                </select>
                            </div>

                            {/* Privacy */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Privacy
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="unlisted">Unlisted</option>
                                </select>
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g., music, tutorial, gaming"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </span>
                                ) : (
                                    'Upload Video'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VideoUpload;