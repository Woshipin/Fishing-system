"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AnimatedSection from "../components/AnimatedSection"
import PageHeader from "../components/PageHeader"

const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [images, setImages] = useState(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/galleries")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          id: item.id,
          src: BASE_IMAGE_URL + item.image_path,
          alt: item.title || "Gallery Image",
          title: item.title || "No Title",
          description: "",
        }))
        setImages(mapped)
      })
      .catch(err => {
        console.error("Fetch galleries failed:", err)
        setImages([])
      })
  }, [])

  if (!images) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse"></div>
          <p className="relative text-cyan-300 text-lg font-medium animate-pulse">Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-cyan-300/50 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section with Enhanced Styling */}
      <div className="relative z-10">
        <PageHeader
          title="Our Gallery"
          description="Explore our collection of images showcasing our products, events, and team"
        />
      </div>

      {/* Gallery Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Gallery Grid */}
          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, y: 80, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -50, rotateX: -45 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.4,
                }}
                className="group perspective-1000"
              >
                <div
                  className="relative bg-slate-800/30 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 transform-gpu hover:-translate-y-4 hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                  style={{
                    boxShadow: '0 0 0 1px rgba(56, 189, 248, 0.3), 0 0 30px rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}
                >
                  {/* Glowing Border Animation */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                       style={{
                         background: 'linear-gradient(45deg, transparent, rgba(56, 189, 248, 0.4), transparent, rgba(129, 140, 248, 0.4), transparent)',
                         backgroundSize: '400% 400%',
                         animation: 'gradient-flow 3s ease infinite',
                         padding: '2px'
                       }}>
                    <div className="w-full h-full bg-slate-800/50 rounded-3xl"></div>
                  </div>

                  {/* Enhanced Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-indigo-500/50 rounded-3xl opacity-0 group-hover:opacity-60 blur-lg transition-all duration-700 -z-10"></div>
                  
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
                    />

                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                    {/* Animated Particles on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-ping"
                          style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: '2s'
                          }}
                        ></div>
                      ))}
                    </div>

                    {/* Enhanced Hover Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-8 group-hover:translate-y-0">
                      <div className="bg-slate-800/90 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-2xl border border-cyan-400/30 relative overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
                        <div className="relative flex items-center gap-3">
                          <svg
                            className="w-6 h-6 text-cyan-400 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                          </svg>
                          <span className="text-cyan-300 font-semibold">View Larger</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Corner Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-2xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 shadow-lg shadow-cyan-500/30">
                      #{image.id}
                    </div>
                  </div>

                  {/* Enhanced Content Section */}
                  <div className="p-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
                    <h3 className="font-bold text-xl text-slate-100 mb-3 group-hover:text-cyan-300 transition-all duration-500 group-hover:drop-shadow-lg">
                      {image.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 group-hover:text-slate-200 transition-colors duration-300">
                      {image.description || "Discover the beauty captured in this moment"}
                    </p>

                    {/* Enhanced Decorative Element */}
                    <div className="mt-4 relative">
                      <div className="h-1 w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full group-hover:w-full transition-all duration-700 shadow-lg shadow-cyan-400/50"></div>
                      <div className="absolute inset-0 h-1 w-0 bg-cyan-300/50 rounded-full group-hover:w-full transition-all duration-700 blur-sm"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Enhanced Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(25px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100, rotateX: 45 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100, rotateX: 45 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Close Button */}
            <button
              className="absolute -top-6 -right-6 z-20 bg-slate-800/90 backdrop-blur-xl text-slate-200 hover:text-red-400 p-4 rounded-full shadow-2xl border border-cyan-400/30 transition-all duration-300 hover:scale-110 hover:bg-slate-700/90 group"
              onClick={() => setSelectedImage(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-red-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg
                className="w-6 h-6 relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            {/* Enhanced Image Container */}
            <div className="bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-400/30 relative">
              {/* Glowing Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-indigo-500/50 rounded-3xl blur-lg opacity-60"></div>
              
              <div className="relative">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />

                {/* Enhanced Content */}
                <div className="p-8 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-3xl text-slate-100 mb-4 drop-shadow-lg">
                        {selectedImage.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed text-lg">
                        {selectedImage.description || "A stunning capture that tells its own unique story"}
                      </p>
                    </div>

                    {/* Enhanced Badge */}
                    <div className="ml-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-lg font-bold shadow-2xl shadow-cyan-500/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 animate-pulse"></div>
                      <span className="relative">#{selectedImage.id}</span>
                    </div>
                  </div>

                  {/* Enhanced Decorative Line */}
                  <div className="mt-6 relative">
                    <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-lg shadow-cyan-400/50"></div>
                    <div className="absolute inset-0 h-2 bg-cyan-300/50 rounded-full blur-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-gpu {
          transform: translateZ(0);
        }
      `}</style>
    </div>
  )
}

export default GalleryPage