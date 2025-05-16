"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import AnimatedSection from "../components/AnimatedSection"

const ProfilePage = () => {
  // Mock user data
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://via.placeholder.com/150",
    joinDate: "January 2023",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    location: "New York, USA",
    website: "https://example.com",
    orders: [
      {
        id: "ORD-12345",
        date: "2023-05-15",
        status: "Delivered",
        total: 129.99,
      },
      {
        id: "ORD-67890",
        date: "2023-04-22",
        status: "Processing",
        total: 89.99,
      },
    ],
    wishlist: [
      {
        id: 1,
        name: "Product 1",
        price: 49.99,
        image: "https://via.placeholder.com/100",
      },
      {
        id: 2,
        name: "Product 2",
        price: 79.99,
        image: "https://via.placeholder.com/100",
      },
    ],
  })

  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-purple-100 text-purple-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <AnimatedSection className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 px-6 sm:px-12 flex flex-col sm:flex-row items-center sm:items-end">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left pb-4">
                  <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                  <p className="text-gray-600">Member since {user.joinDate}</p>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 sm:mt-0 pb-4">
                  <Link
                    to="/profile/edit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="mt-16 sm:mt-20 px-4 sm:px-6">
              <div className="flex flex-wrap border-b">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "overview"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "orders"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "wishlist"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  Wishlist
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "settings"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">About</h2>
                      <p className="text-gray-700">{user.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-gray-800">{user.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Website</p>
                            <a href={user.website} className="text-indigo-600 hover:text-indigo-800">
                              {user.website}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
                        {user.orders.length > 0 ? (
                          <div className="space-y-3">
                            {user.orders.slice(0, 2).map((order) => (
                              <div
                                key={order.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">{order.id}</p>
                                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(
                                      order.status,
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                  <p className="font-medium mt-1">${order.total.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                            <Link
                              to="#"
                              onClick={() => setActiveTab("orders")}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              View all orders →
                            </Link>
                          </div>
                        ) : (
                          <p className="text-gray-600">No orders yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "orders" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                    {user.orders.length > 0 ? (
                      <div className="space-y-4">
                        {user.orders.map((order) => (
                          <div
                            key={order.id}
                            className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex flex-wrap justify-between items-center">
                              <div className="space-y-1 mb-2 md:mb-0">
                                <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                                <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                                <span className="font-semibold">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Link
                                to={`/orders/${order.id}`}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                              >
                                View Order Details →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn btn-primary">
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "wishlist" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Your Wishlist</h2>
                    {user.wishlist.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {user.wishlist.map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start space-x-4">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                <div className="mt-2 flex space-x-2">
                                  <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 transition-colors">
                                    Add to Cart
                                  </button>
                                  <button className="text-xs text-red-600 hover:text-red-800 px-2 py-1">Remove</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                        <Link to="/products" className="btn btn-primary">
                          Explore Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                    <div className="space-y-4">
                      <Link
                        to="/profile/edit"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Edit Profile</h3>
                            <p className="text-sm text-gray-600">Update your personal information</p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>

                      <Link
                        to="#"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Change Password</h3>
                            <p className="text-sm text-gray-600">Update your password</p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>

                      <Link
                        to="#"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Notification Settings</h3>
                            <p className="text-sm text-gray-600">Manage your notification preferences</p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>

                      <Link
                        to="#"
                        className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Privacy Settings</h3>
                            <p className="text-sm text-gray-600">Manage your privacy preferences</p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </Link>

                      <button className="w-full p-4 text-left border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-red-500">Permanently delete your account and all associated data</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default ProfilePage
