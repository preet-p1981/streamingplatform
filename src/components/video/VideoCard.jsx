import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }) => {
    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views;
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="group cursor-pointer">
            {/* Thumbnail Container */}
            <Link to={`/watch/${video.id}`} className="block">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-200 mb-3">
                    <img
                        src={video.thumbnailUrl || '/default-thumbnail.jpg'}
                        alt={video.title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/640x360/cccccc/666666?text=No+Thumbnail';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-2 py-1 rounded">
                            {formatDuration(video.duration)}
                        </span>
                    )}
                </div>
            </Link>

            {/* Video Info */}
            <div className="flex gap-3">
                {/* Channel Avatar */}
                <Link to={`/channel/${video.userId}`} className="flex-shrink-0">
                    <img
                        src={video.userProfilePicture || '/default-avatar.png'}
                        alt={video.username}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40/4B5563/ffffff?text=' + (video.username?.[0]?.toUpperCase() || 'U');
                        }}
                        className="w-9 h-9 rounded-full object-cover hover:ring-2 hover:ring-gray-300 transition-all"
                    />
                </Link>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                    <Link to={`/watch/${video.id}`}>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                            {video.title}
                        </h3>
                    </Link>

                    <Link
                        to={`/channel/${video.userId}`}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors block mb-1"
                    >
                        {video.username}
                    </Link>

                    <div className="flex items-center text-xs text-gray-600 space-x-1">
                        <span>{formatViews(video.viewCount || 0)} views</span>
                        <span>•</span>
                        <span>
                            {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;