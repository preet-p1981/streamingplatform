import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaYoutube, FaSearch, FaVideo, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section - Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <FaYoutube size={32} color="#ff0000" />
                            <span className="text-xl font-bold text-gray-900 hidden sm:inline">YouTube Clone</span>
                        </Link>
                    </div>

                    {/* Center Section - Search */}
                    <div className="flex-1 max-w-2xl mx-4">
                        <form onSubmit={handleSearch} className="flex items-center">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search videos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            >
                                <FaSearch className="text-gray-600" />
                            </button>
                        </form>
                    </div>

                    {/* Right Section - Auth & Actions */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/upload"
                                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <FaVideo size={20} />
                                    <span className="hidden md:inline font-medium">Upload</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <FaUser size={20} />
                                    <span className="hidden md:inline font-medium">{user?.username}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <FaSignOutAlt size={20} />
                                    <span className="hidden md:inline font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;