import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFire, FaClock, FaList } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="py-4 px-2 space-y-1">
                <Link
                    to="/"
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                        isActive('/')
                            ? 'bg-gray-100 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <FaHome size={20} />
                    <span className="text-sm">Home</span>
                </Link>

                <Link
                    to="/trending"
                    className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                        isActive('/trending')
                            ? 'bg-gray-100 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    <FaFire size={20} />
                    <span className="text-sm">Trending</span>
                </Link>

                {isAuthenticated && (
                    <>
                        <div className="border-t border-gray-200 my-2"></div>

                        <Link
                            to="/subscriptions"
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/subscriptions')
                                    ? 'bg-gray-100 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FaList size={20} />
                            <span className="text-sm">Subscriptions</span>
                        </Link>

                        <Link
                            to="/history"
                            className={`flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors ${
                                isActive('/history')
                                    ? 'bg-gray-100 text-blue-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <FaClock size={20} />
                            <span className="text-sm">History</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;