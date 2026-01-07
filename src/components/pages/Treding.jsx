import React, { useState, useEffect } from 'react';
import { videoService } from '../../services/videoService';
import VideoList from '../../components/video/VideoList';
import toast from 'react-hot-toast';
import { FaFire } from 'react-icons/fa';

const Trending = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrendingVideos();
    }, []);

    const loadTrendingVideos = async () => {
        setLoading(true);
        try {
            const data = await videoService.getTrendingVideos();
            setVideos(data);
        } catch (error) {
            toast.error('Failed to load trending videos');
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
                    <div className="p-3 bg-red-100 rounded-full">
                        <FaFire className="text-red-600 text-2xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Trending Videos
                    </h2>
                </div>

                {/* Video List */}
                <VideoList videos={videos} loading={loading} />
            </div>
        </div>
    );
};

export default Trending;