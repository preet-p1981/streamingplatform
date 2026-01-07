import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { videoService } from '../../services/videoService';
import { useAuth } from '../../hooks/useAuth';
import VideoList from '../../components/video/VideoList';
import toast from 'react-hot-toast';

const Channel = () => {
    const { id } = useParams();
    const { user: currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (id) {
            loadChannel();
            loadChannelVideos();
        }
    }, [id]);

    const loadChannel = async () => {
        setLoading(true);
        try {
            const data = await userService.getUserById(id);
            setChannel(data);

            // Check subscription status if authenticated
            if (isAuthenticated && currentUser?.id !== parseInt(id)) {
                try {
                    const subStatus = await videoService.checkSubscription(id);
                    setIsSubscribed(subStatus);
                } catch (error) {
                    console.error('Failed to load subscription status:', error);
                }
            }
        } catch (error) {
            toast.error('Failed to load channel');
            console.error(error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const loadChannelVideos = async () => {
        setVideosLoading(true);
        try {
            const data = await videoService.getUserVideos(id);
            setVideos(data.content || data);
        } catch (error) {
            console.error('Failed to load videos:', error);
            setVideos([]);
        } finally {
            setVideosLoading(false);
        }
    };

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to subscribe');
            navigate('/login');
            return;
        }

        try {
            await videoService.toggleSubscription(id);
            setIsSubscribed(!isSubscribed);
            toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
            loadChannel(); // Reload to update subscriber count
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 ml-64 mt-16">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading channel...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="min-h-screen bg-gray-50 ml-64 mt-16">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Channel not found</h3>
                        <p className="text-gray-600 mb-4">This channel doesn't exist</p>
                    </div>
                </div>
            </div>
        );
    }

    const isOwnChannel = currentUser?.id === parseInt(id);

    return (
        <div className="min-h-screen bg-gray-50 ml-64 mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Channel Header */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    {/* Banner */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48 relative">
                        <div className="absolute -bottom-16 left-8">
                            <img
                                src={
                                    channel.profilePictureUrl ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.username)}&size=128&background=4F46E5&color=fff`
                                }
                                alt={channel.username}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.username)}&size=128&background=4F46E5&color=fff`;
                                }}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        </div>
                    </div>

                    {/* Channel Info */}
                    <div className="pt-20 px-8 pb-8">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {channel.fullName || channel.username}
                                </h1>
                                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                                    <span className="text-sm">@{channel.username}</span>
                                    <span>•</span>
                                    <span className="text-sm">{channel.subscriberCount || 0} subscribers</span>
                                    <span>•</span>
                                    <span className="text-sm">{videos.length} videos</span>
                                </div>
                                {channel.channelDescription && (
                                    <p className="text-gray-700 mb-6 max-w-3xl">
                                        {channel.channelDescription}
                                    </p>
                                )}
                            </div>

                            {/* Subscribe Button - Only show if not own channel */}
                            {!isOwnChannel && isAuthenticated && (
                                <button
                                    onClick={handleSubscribe}
                                    className={`px-8 py-3 font-semibold rounded-full transition-colors ${
                                        isSubscribed
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                >
                                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            )}

                            {/* If not authenticated, show login prompt */}
                            {!isOwnChannel && !isAuthenticated && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
                                >
                                    Subscribe
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Videos Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="border-b border-gray-200 mb-6">
                        <button className="px-4 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
                            Videos ({videos.length})
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
                            <p className="text-gray-600">This channel hasn't uploaded any videos</p>
                        </div>
                    ) : (
                        <VideoList videos={videos} loading={false} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Channel;