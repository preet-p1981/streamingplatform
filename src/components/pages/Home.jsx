import React, { useState, useEffect } from 'react';
import { videoService } from '../../services/videoService';
import VideoList from '../../components/video/VideoList';
import toast from 'react-hot-toast';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        loadVideos();
    }, [activeTab]);

    const loadVideos = async () => {
        setLoading(true);
        try {
            let data;
            if (activeTab === 'trending') {
                data = await videoService.getTrendingVideos();
            } else if (activeTab === 'latest') {
                data = await videoService.getLatestVideos();
            } else {
                data = await videoService.getPublicVideos();
            }
            setVideos(data.content || data);
        } catch (error) {
            toast.error('Failed to load videos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 ml-64 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Tabs Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-2">
                    <div className="flex space-x-2">
                        <button
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
                                activeTab === 'all'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>
                        <button
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
                                activeTab === 'trending'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('trending')}
                        >
                            Trending
                        </button>
                        <button
                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${
                                activeTab === 'latest'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setActiveTab('latest')}
                        >
                            Latest
                        </button>
                    </div>
                </div>

                {/* Video List */}
                <VideoList videos={videos} loading={loading} />
            </div>
        </div>
    );
};

export default Home;