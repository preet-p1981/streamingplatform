import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Trending from "./components/pages/Treding";
import PrivateRoute from "./components/auth/PrivateRoute";
import VideoUpload from "./components/video/VideoUpload";
import Profile from "./components/pages/Profile";
import VideoPlayer from "./components/video/VideoPlayer";
import Subscriptions from "./components/pages/Subscriptions";
import Channel from "./components/pages/Channelpage";

// Remove the empty Channel function and use the import

function Channel() {
    return null;
}

function SearchResults() {
    return null;
}



function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />

                    <div className="flex">
                        <Sidebar />

                        <main className="flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/watch/:id" element={<VideoPlayer />} />
                                <Route path="/channel/:id" element={<Channel />} />
                                <Route path="/search" element={<SearchResults />} />
                                <Route path="/trending" element={<Trending />} />

                                {/* Protected Routes */}
                                <Route
                                    path="/upload"
                                    element={
                                        <PrivateRoute>
                                            <VideoUpload />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/subscriptions"
                                    element={
                                        <PrivateRoute>
                                            <Subscriptions />
                                        </PrivateRoute>
                                    }
                                />
                            </Routes>
                        </main>
                    </div>

                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;