"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AnimatedSection from "../components/AnimatedSection"

const FishingTimePage = () => {
  // Mock data for fishing users
  const [fishingUsers, setFishingUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/150",
      location: "Lake Superior",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
      endTime: new Date(Date.now() + 35 * 60 * 1000), // Ends in 35 minutes
      fishCaught: 3,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/150",
      location: "River Creek",
      startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // Started 1.5 hours ago
      endTime: new Date(Date.now() + 5 * 60 * 1000), // Ends in 5 minutes
      fishCaught: 7,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/150",
      location: "Ocean Bay",
      startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
      endTime: new Date(Date.now() + 60 * 60 * 1000), // Ends in 1 hour
      fishCaught: 12,
    },
    {
      id: 4,
      name: "Sarah Williams",
      avatar: "https://via.placeholder.com/150",
      location: "Mountain Lake",
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Started 1 hour ago
      endTime: new Date(Date.now() + 8 * 60 * 1000), // Ends in 8 minutes
      fishCaught: 2,
    },
    {
      id: 5,
      name: "David Brown",
      avatar: "https://via.placeholder.com/150",
      location: "City Pond",
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // Started 4 hours ago
      endTime: new Date(Date.now() + 15 * 60 * 1000), // Ends in 15 minutes
      fishCaught: 5,
    },
    {
      id: 6,
      name: "Emily Davis",
      avatar: "https://via.placeholder.com/150",
      location: "Forest Stream",
      startTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // Started 2.5 hours ago
      endTime: new Date(Date.now() + 45 * 60 * 1000), // Ends in 45 minutes
      fishCaught: 9,
    },
    {
      id: 7,
      name: "Alex Wilson",
      avatar: "https://via.placeholder.com/150",
      location: "Canyon River",
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Started 1 hour ago
      endTime: new Date(Date.now() + 3 * 60 * 1000), // Ends in 3 minutes
      fishCaught: 1,
    },
    {
      id: 8,
      name: "Lisa Taylor",
      avatar: "https://via.placeholder.com/150",
      location: "Sunset Beach",
      startTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // Started 5 hours ago
      endTime: new Date(Date.now() + 25 * 60 * 1000), // Ends in 25 minutes
      fishCaught: 15,
    },
  ])

  const [currentTime, setCurrentTime] = useState(new Date())
  const [filterOption, setFilterOption] = useState("all")

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Update remaining times for simulation
      setFishingUsers((prevUsers) =>
        prevUsers.map((user) => {
          // If time is up, add random new time between 30-120 minutes
          if (user.endTime <= new Date()) {
            const newEndTime = new Date(Date.now() + (Math.random() * 90 + 30) * 60 * 1000)
            return {
              ...user,
              startTime: new Date(),
              endTime: newEndTime,
              fishCaught: Math.floor(Math.random() * 10),
            }
          }
          return user
        }),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Calculate remaining time in minutes
  const getRemainingMinutes = (endTime) => {
    const diffMs = endTime - currentTime
    return Math.max(0, Math.floor(diffMs / (1000 * 60)))
  }

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format remaining time as MM:SS
  const formatRemainingTime = (endTime) => {
    const diffMs = endTime - currentTime
    if (diffMs <= 0) return "00:00"

    const minutes = Math.floor(diffMs / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Filter users based on selected option
  const filteredUsers = () => {
    switch (filterOption) {
      case "critical":
        return fishingUsers.filter((user) => getRemainingMinutes(user.endTime) <= 10)
      case "normal":
        return fishingUsers.filter((user) => getRemainingMinutes(user.endTime) > 10)
      default:
        return fishingUsers
    }
  }

  // Sort users by remaining time (ascending)
  const sortedUsers = filteredUsers().sort((a, b) => a.endTime - b.endTime)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">Fishing Time Tracker</h1>
            <p className="text-lg md:text-xl text-white mb-6">Monitor remaining fishing time for all active users</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setFilterOption("all")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  filterOption === "all"
                    ? "bg-white text-blue-600 font-medium"
                    : "bg-blue-600/30 text-white hover:bg-blue-600/50"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setFilterOption("critical")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  filterOption === "critical"
                    ? "bg-white text-red-600 font-medium"
                    : "bg-blue-600/30 text-white hover:bg-blue-600/50"
                }`}
              >
                Critical Time (≤ 10 min)
              </button>
              <button
                onClick={() => setFilterOption("normal")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  filterOption === "normal"
                    ? "bg-white text-cyan-600 font-medium"
                    : "bg-blue-600/30 text-white hover:bg-blue-600/50"
                }`}
              >
                Normal Time (&gt; 10 min)
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Fishing Time Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Active Fishers: {sortedUsers.length}</h2>
            <p className="text-gray-600">Current Time: {currentTime.toLocaleTimeString()}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedUsers.map((user) => {
              const remainingMinutes = getRemainingMinutes(user.endTime)
              const isCritical = remainingMinutes <= 10

              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-xl overflow-hidden ${
                    isCritical ? "shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  }`}
                >
                  <div
                    className={`absolute inset-0 ${
                      isCritical
                        ? "bg-gradient-to-r from-red-500/20 to-red-600/20"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
                    }`}
                  ></div>

                  <div className="relative p-6 bg-white bg-opacity-90 backdrop-blur-sm">
                    <div className="flex items-center mb-4">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white shadow-md"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{user.name}</h3>
                        <p className="text-gray-600 text-sm">{user.location}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Started:</span>
                        <span className="font-medium">{formatTime(user.startTime)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Ends:</span>
                        <span className="font-medium">{formatTime(user.endTime)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Fish Caught:</span>
                        <span className="font-medium">{user.fishCaught}</span>
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Remaining:</span>
                          <span className={`font-bold text-xl ${isCritical ? "text-red-600" : "text-cyan-600"}`}>
                            {formatRemainingTime(user.endTime)}
                          </span>
                        </div>

                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${isCritical ? "bg-red-600" : "bg-cyan-600"}`}
                            style={{
                              width: `${Math.min(100, (remainingMinutes / 60) * 100)}%`,
                              transition: "width 1s linear",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isCritical ? "bg-red-100 text-red-800" : "bg-cyan-100 text-cyan-800"
                        }`}
                      >
                        {isCritical ? "Critical" : "Active"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          {sortedUsers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-md">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-xl font-semibold mb-2">No fishing users found</h3>
              <p className="text-gray-600">Try changing your filter options</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Fishing Statistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Total Active Fishers</h3>
              <p className="text-3xl font-bold text-blue-600">{fishingUsers.length}</p>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Critical Time:</span>
                  <span className="font-medium">
                    {fishingUsers.filter((user) => getRemainingMinutes(user.endTime) <= 10).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Normal Time:</span>
                  <span className="font-medium">
                    {fishingUsers.filter((user) => getRemainingMinutes(user.endTime) > 10).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Total Fish Caught</h3>
              <p className="text-3xl font-bold text-blue-600">
                {fishingUsers.reduce((sum, user) => sum + user.fishCaught, 0)}
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Average per Fisher:</span>
                  <span className="font-medium">
                    {(fishingUsers.reduce((sum, user) => sum + user.fishCaught, 0) / fishingUsers.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Popular Locations</h3>
              <div className="space-y-2 mt-4">
                {Array.from(new Set(fishingUsers.map((user) => user.location)))
                  .slice(0, 3)
                  .map((location) => (
                    <div key={location} className="flex justify-between items-center">
                      <span className="text-gray-700">{location}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {fishingUsers.filter((user) => user.location === location).length} fishers
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FishingTimePage
