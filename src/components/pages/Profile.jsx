import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { videoService } from '../../services/videoService';
import { useAuth } from '../../hooks/useAuth';
import VideoList from '../../components/video/VideoList';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState(authUser); // Local user state
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(true);

    const [formData, setFormData] = useState({
        fullName: '',
        channelDescription: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (authUser && authUser.id) {
            // Fetch fresh user data from backend
            loadUserProfile();
        } else if (authUser && !authUser.id) {
            console.error('User object missing ID:', authUser);
            toast.error('Unable to load profile data. Please try logging in again.');
        }
    }, [authUser]);

    const loadUserProfile = async () => {
        try {
            const freshUserData = await userService.getCurrentUser();
            setUser(freshUserData);
            setFormData({
                fullName: freshUserData.fullName || '',
                channelDescription: freshUserData.channelDescription || '',
            });
            loadMyVideos(freshUserData.id);
        } catch (error) {
            console.error('Failed to load user profile:', error);
            // Fallback to auth user
            setUser(authUser);
            setFormData({
                fullName: authUser.fullName || '',
                channelDescription: authUser.channelDescription || '',
            });
            loadMyVideos(authUser.id);
        }
    };

    const loadMyVideos = async (userId) => {
        if (!userId) {
            console.error('User ID is undefined');
            setVideosLoading(false);
            return;
        }

        setVideosLoading(true);
        try {
            console.log('Loading videos for user:', userId);
            const data = await videoService.getUserVideos(userId);
            console.log('Videos loaded:', data);

            if (data.content) {
                setVideos(data.content);
            } else if (Array.isArray(data)) {
                setVideos(data);
            } else {
                setVideos([]);
            }
        } catch (error) {
            console.error('Failed to load videos:', error);
            toast.error('Failed to load your videos');
            setVideos([]);
        } finally {
            setVideosLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Submitting profile update:', {
                fullName: formData.fullName,
                channelDescription: formData.channelDescription,
                profilePicture: profilePicture?.name
            });

            const updatedUser = await userService.updateProfile(
                formData.fullName,
                formData.channelDescription,
                profilePicture
            );

            console.log('Profile update successful! Response:', updatedUser);

            // Update local user state
            setUser(updatedUser);

            // Update localStorage directly
            const currentStoredUser = JSON.parse(localStorage.getItem('user') || '{}');
            const mergedUser = { ...currentStoredUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));

            // Clear form states
            setIsEditing(false);
            setProfilePicture(null);
            setPreviewUrl(null);

            // Update form with new values
            setFormData({
                fullName: updatedUser.fullName || '',
                channelDescription: updatedUser.channelDescription || '',
            });

            // Show success message
            toast.success('Profile updated successfully!');

            // Reload user profile to get fresh data
            setTimeout(() => {
                loadUserProfile();
            }, 500);

        } catch (error) {
            console.error('Profile update error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // Check if it's actually a success but axios thinks it's an error
            if (error.response?.status === 200 || error.response?.data?.id) {
                console.log('Update succeeded despite error, treating as success');
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                setProfilePicture(null);
                setPreviewUrl(null);
                setTimeout(() => {
                    loadUserProfile();
                }, 500);
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullName: user.fullName || '',
            channelDescription: user.channelDescription || '',
        });
        setProfilePicture(null);
        setPreviewUrl(null);
        setIsEditing(false);
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm('Are you sure you want to delete this video?')) {
            return;
        }

        try {
            await videoService.deleteVideo(videoId);
            setVideos(videos.filter(v => v.id !== videoId));
            toast.success('Video deleted successfully');
        } catch (error) {
            toast.error('Failed to delete video');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 ml-64 mt-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ml-64 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    {/* Banner with Avatar */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative">
                        <div className="absolute -bottom-16 left-8">
                            <img
                                src={
                                    previewUrl ||
                                    user.profilePictureUrl ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&size=128&background=4F46E5&color=fff`
                                }
                                alt={user.username}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&size=128&background=4F46E5&color=fff`;
                                }}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-20 px-8 pb-8">
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Channel Description
                                    </label>
                                    <textarea
                                        name="channelDescription"
                                        value={formData.channelDescription}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe your channel..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {user.fullName || user.username}
                                </h1>
                                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                                    <span className="text-sm">@{user.username}</span>
                                    <span>•</span>
                                    <span className="text-sm">{videos.length} videos</span>
                                </div>
                                {user.channelDescription && (
                                    <p className="text-gray-700 mb-6 max-w-3xl">
                                        {user.channelDescription}
                                    </p>
                                )}
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="border-b border-gray-200 mb-6">
                        <button className="px-4 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
                            My Videos ({videos.length})
                        </button>
                    </div>

                    {videosLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 text-lg">Loading videos...</p>
                            </div>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
                            <p className="text-gray-600 mb-4">Upload your first video to get started</p>
                            <button
                                onClick={() => navigate('/upload')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                            >
                                Upload Video
                            </button>
                        </div>
                    ) : (
                        <VideoList videos={videos} loading={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;