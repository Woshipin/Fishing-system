"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import AnimatedSection from "../components/AnimatedSection"

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All" },
    { id: "products", name: "Products" },
    { id: "events", name: "Events" },
    { id: "team", name: "Team" },
  ]

  const images = [
    {
      id: 1,
      src: "https://via.placeholder.com/600x400?text=Product+1",
      alt: "Product 1",
      category: "products",
      title: "Premium Package",
      description: "Our most comprehensive solution for businesses of all sizes.",
    },
    {
      id: 2,
      src: "https://via.placeholder.com/600x400?text=Product+2",
      alt: "Product 2",
      category: "products",
      title: "Standard Package",
      description: "Perfect balance of features and affordability for growing businesses.",
    },
    {
      id: 3,
      src: "https://via.placeholder.com/600x400?text=Product+3",
      alt: "Product 3",
      category: "products",
      title: "Basic Package",
      description: "Essential features to get started with your business needs.",
    },
    {
      id: 4,
      src: "https://via.placeholder.com/600x400?text=Event+1",
      alt: "Event 1",
      category: "events",
      title: "Annual Conference 2023",
      description: "Highlights from our annual conference in New York.",
    },
    {
      id: 5,
      src: "https://via.placeholder.com/600x400?text=Event+2",
      alt: "Event 2",
      category: "events",
      title: "Product Launch",
      description: "Launching our new product line to the market.",
    },
    {
      id: 6,
      src: "https://via.placeholder.com/600x400?text=Team+1",
      alt: "Team 1",
      category: "team",
      title: "Our Development Team",
      description: "The talented individuals behind our products.",
    },
    {
      id: 7,
      src: "https://via.placeholder.com/600x400?text=Team+2",
      alt: "Team 2",
      category: "team",
      title: "Marketing Department",
      description: "Our creative marketing team at work.",
    },
    {
      id: 8,
      src: "https://via.placeholder.com/600x400?text=Product+4",
      alt: "Product 4",
      category: "products",
      title: "Enterprise Solution",
      description: "Tailored solutions for large organizations.",
    },
    {
      id: 9,
      src: "https://via.placeholder.com/600x400?text=Event+3",
      alt: "Event 3",
      category: "events",
      title: "Workshop Series",
      description: "Educational workshops for our clients and partners.",
    },
  ]

  const filteredImages = activeCategory === "all" ? images : images.filter((image) => image.category === activeCategory)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">Our Gallery</h1>
            <p className="text-lg md:text-xl text-white mb-8">
              Explore our collection of images showcasing our products, events, and team
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <AnimatedSection className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </AnimatedSection>

          {/* Gallery Grid */}
          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <div
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg">
                        <span className="text-indigo-600 font-medium">View Larger</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{image.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{image.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="bg-white p-4 rounded-b-lg">
              <h3 className="font-semibold text-lg">{selectedImage.title}</h3>
              <p className="text-gray-600">{selectedImage.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default GalleryPage
