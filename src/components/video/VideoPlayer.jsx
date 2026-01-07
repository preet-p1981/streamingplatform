import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { videoService } from '../../services/videoService';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaThumbsUp, FaThumbsDown, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const VideoPlayer = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [userLikeStatus, setUserLikeStatus] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (id) {
            loadVideo();
            loadRelatedVideos();
            loadComments();
        }
    }, [id]);

    const loadVideo = async () => {
        setLoading(true);
        try {
            const data = await videoService.getVideoById(id);
            setVideo(data);

            try {
                await videoService.incrementView(id);
            } catch (error) {
                console.error('Failed to increment view:', error);
            }

            if (isAuthenticated) {
                try {
                    const status = await videoService.getLikeStatus(id);
                    setUserLikeStatus(status);
                } catch (error) {
                    console.error('Failed to load like status:', error);
                }

                try {
                    const subStatus = await videoService.checkSubscription(data.userId);
                    setIsSubscribed(subStatus);
                } catch (error) {
                    console.error('Failed to load subscription status:', error);
                }
            }
        } catch (error) {
            toast.error('Failed to load video');
            console.error(error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const loadRelatedVideos = async () => {
        try {
            const data = await videoService.getPublicVideos();
            setRelatedVideos((data.content || data).filter(v => v.id !== parseInt(id)).slice(0, 10));
        } catch (error) {
            console.error('Failed to load related videos:', error);
        }
    };

    const loadComments = async () => {
        try {
            const data = await commentService.getVideoComments(id);
            setComments(data || []);
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to like videos');
            return;
        }
        try {
            await videoService.likeVideo(id);
            setUserLikeStatus(userLikeStatus === 'like' ? null : 'like');
            toast.success(userLikeStatus === 'like' ? 'Like removed' : 'Video liked!');
            loadVideo();
        } catch (error) {
            toast.error('Failed to like video');
        }
    };

    const handleDislike = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to dislike videos');
            return;
        }
        try {
            await videoService.dislikeVideo(id);
            setUserLikeStatus(userLikeStatus === 'dislike' ? null : 'dislike');
            toast.success(userLikeStatus === 'dislike' ? 'Dislike removed' : 'Video disliked');
            loadVideo();
        } catch (error) {
            toast.error('Failed to dislike video');
        }
    };

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to subscribe');
            return;
        }
        try {
            await videoService.toggleSubscription(video.userId);
            setIsSubscribed(!isSubscribed);
            toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
            loadVideo();
        } catch (error) {
            toast.error('Failed to update subscription');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to comment');
            return;
        }
        if (!comment.trim()) return;

        try {
            await commentService.addComment(id, comment);
            setComment('');
            toast.success('Comment added!');
            loadComments();
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;

        try {
            await commentService.deleteComment(commentId);
            toast.success('Comment deleted');
            loadComments();
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard!');
    };

    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
        return views || 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 ml-64 mt-16">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading video...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-gray-50 ml-64 mt-16">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Video not found</h3>
                        <p className="text-gray-600 mb-4">The video you're looking for doesn't exist</p>
                        <Link to="/" className="text-blue-600 hover:text-blue-700">Go to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ml-64 mt-16">
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-black rounded-lg overflow-hidden mb-4 aspect-video">
                            <video
                                controls
                                className="w-full h-full"
                                src={video.videoUrl}
                                poster={video.thumbnailUrl}
                                onError={(e) => {
                                    console.error('Video failed to load:', video.videoUrl);
                                    toast.error('Failed to load video. Please check the video URL.');
                                }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        <h1 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h1>

                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>{formatViews(video.viewCount)} views</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                                        userLikeStatus === 'like'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    <FaThumbsUp />
                                    <span className="text-sm font-medium">{video.likeCount || 0}</span>
                                </button>
                                <button
                                    onClick={handleDislike}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                                        userLikeStatus === 'dislike'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    <FaThumbsDown />
                                    <span className="text-sm font-medium">{video.dislikeCount || 0}</span>
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <FaShare />
                                    <span className="text-sm font-medium">Share</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <Link to={`/channel/${video.userId}`}>
                                        <img
                                            src={video.userProfilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username)}&size=48&background=4F46E5&color=fff`}
                                            alt={video.username}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username || 'U')}&size=48&background=4F46E5&color=fff`;
                                            }}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </Link>
                                    <div>
                                        <Link to={`/channel/${video.userId}`} className="font-semibold text-gray-900 hover:text-blue-600">
                                            {video.username}
                                        </Link>
                                        <p className="text-sm text-gray-600">{video.subscriberCount || 0} subscribers</p>
                                    </div>
                                </div>

                                {isAuthenticated && user?.id !== video.userId && (
                                    <button
                                        onClick={handleSubscribe}
                                        className={`px-6 py-2 font-semibold rounded-full transition-colors ${
                                            isSubscribed
                                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}
                                    >
                                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                    </button>
                                )}
                            </div>

                            <div className="mt-4">
                                <p className={`text-gray-700 whitespace-pre-wrap ${!showFullDescription && 'line-clamp-3'}`}>
                                    {video.description || 'No description available.'}
                                </p>
                                {video.description && video.description.length > 150 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="text-sm font-medium text-gray-900 mt-2 hover:text-blue-600"
                                    >
                                        {showFullDescription ? 'Show less' : 'Show more'}
                                    </button>
                                )}
                            </div>

                            {video.tags && video.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {video.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</h3>

                            {isAuthenticated ? (
                                <form onSubmit={handleAddComment} className="mb-6">
                                    <div className="flex gap-3">
                                        <img
                                            src={user?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&size=40&background=4F46E5&color=fff`}
                                            alt="Your avatar"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'U')}&size=40&background=4F46E5&color=fff`;
                                            }}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Add a comment..."
                                                className="w-full px-0 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                                            />
                                            {comment.trim() && (
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setComment('')}
                                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={!comment.trim()}
                                                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Comment
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <p className="text-gray-600 mb-6">
                                    Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> to comment
                                </p>
                            )}

                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">No comments yet. Be the first to comment!</p>
                                ) : (
                                    comments.map((c) => (
                                        <div key={c.id} className="flex gap-3">
                                            <Link to={`/channel/${c.userId}`}>
                                                <img
                                                    src={c.userProfilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.username || 'User')}&size=40&background=4F46E5&color=fff`}
                                                    alt={c.username}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.username || 'U')}&size=40&background=4F46E5&color=fff`;
                                                    }}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            </Link>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Link to={`/channel/${c.userId}`} className="font-semibold text-sm hover:text-blue-600">
                                                        {c.username}
                                                    </Link>
                                                    <span className="text-xs text-gray-600">
                                                        {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-900">{c.content}</p>
                                                {user?.id === c.userId && (
                                                    <button
                                                        onClick={() => handleDeleteComment(c.id)}
                                                        className="text-sm text-red-600 hover:text-red-700 mt-2"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
                        <div className="space-y-4">
                            {relatedVideos.map((relatedVideo) => (
                                <Link
                                    key={relatedVideo.id}
                                    to={`/watch/${relatedVideo.id}`}
                                    className="flex gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                                >
                                    <img
                                        src={relatedVideo.thumbnailUrl || '/default-thumbnail.jpg'}
                                        alt={relatedVideo.title}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/168x94/cccccc/666666?text=No+Thumbnail';
                                        }}
                                        className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                            {relatedVideo.title}
                                        </h4>
                                        <p className="text-xs text-gray-600">{relatedVideo.username}</p>
                                        <p className="text-xs text-gray-600">
                                            {formatViews(relatedVideo.viewCount)} views • {formatDistanceToNow(new Date(relatedVideo.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Share Video</h3>
                            <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Video Link</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={window.location.href}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(window.location.href)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Share on Social Media</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(video.title)}`, '_blank')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500"
                                    >
                                        Twitter
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Facebook
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(video.title + ' ' + window.location.href)}`, '_blank')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                    >
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                                    >
                                        LinkedIn
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;