import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProfilePage = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const defaultImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80";

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Profile Header - Fixed positioning */}
            <div className="relative">
              {/* Background with subtle pattern */}
              <div className="h-40 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 bg-white/5 rounded-full"></div>
              </div>
              
              {/* Profile content with better spacing */}
              <div className="relative px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start -mt-16">
                  {/* Avatar section */}
                  <div className="relative mb-6 sm:mb-0 sm:mr-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl">
                      <img 
                        src={defaultImage} 
                        alt={user.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-400 rounded-full border-3 border-white shadow-lg"></div>
                  </div>
                  
                  {/* User info with proper spacing - Modified flex layout */}
                  <div className="flex-1 text-center sm:text-left pt-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                          <p className="text-gray-600 text-lg mb-4">Active Member</p>
                          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              Member since 2024
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              {user.wishlist?.length || 0} wishlist items
                            </span>
                          </div>
                        </div>
                        
                        {/* Edit button moved here - properly positioned */}
                        <div className="mt-4 sm:mt-0 sm:ml-6">
                          <button onClick={handleLogout} className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg border border-red-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
                      activeTab === "overview"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
                      activeTab === "wishlist"
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    onClick={() => setActiveTab("wishlist")}
                  >
                    Wishlist
                  </button>
                </div>
                <Link to="/profile/edit" className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-200 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit Profile
                </Link>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Full Name</p>
                                <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Member Since</span>
                              <span className="font-medium text-gray-900">2024</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Wishlist Items</span>
                              <span className="font-medium text-indigo-600">{user.wishlist?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Account Status</span>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        Your Wishlist
                      </h2>
                      {user.wishlist?.length > 0 && (
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {user.wishlist.length} items
                        </span>
                      )}
                    </div>
                    
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-8">Discover amazing products and add them to your wishlist</p>
                      <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                        Explore Products
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;