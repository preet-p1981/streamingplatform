import React from 'react';
import VideoCard from './VideoCard';

const VideoList = ({ videos, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading videos...</p>
                </div>
            </div>
        );
    }

    if (!videos || videos.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <svg
                        className="w-24 h-24 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
                    <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
};

export default VideoList;