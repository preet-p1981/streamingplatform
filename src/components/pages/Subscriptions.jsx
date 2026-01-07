import React, { useState, useEffect } from 'react';
import { videoService } from '../../services/videoService';
import VideoList from '../../components/video/VideoList';
import toast from 'react-hot-toast';
import { FaList } from 'react-icons/fa';

const Subscriptions = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadSubscribedVideos();
    }, []);

    const loadSubscribedVideos = async () => {
        setLoading(true);
        try {
            const data = await videoService.getSubscribedVideos();
            setVideos(data.content || data);
        } catch (error) {
            toast.error('Failed to load subscribed videos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 ml-64 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex items-center space-x-3 mb-8">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <FaList className="text-purple-600 text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Subscriptions
                    </h2>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
                    <div className="flex space-x-2">
                        <button
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
                                activeTab === 'all'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
                                activeTab === 'latest'
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('latest')}
                        >
                            Latest
                        </button>
                    </div>
                </div>

                {/* Videos */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Loading subscribed videos...</p>
                        </div>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos from subscriptions</h3>
                        <p className="text-gray-600">Subscribe to channels to see their latest videos here</p>
                    </div>
                ) : (
                    <VideoList videos={videos} loading={false} />
                )}
            </div>
        </div>
    );
};

export default Subscriptions;