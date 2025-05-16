"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import AnimatedSection from "../components/AnimatedSection"
import PackageCard from "../components/PackageCard"
import CTA from "../components/CTA"

const PackagePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const packages = [
    {
      id: 1,
      title: "Premium Package",
      description: "Our most comprehensive solution for businesses of all sizes.",
      category: "business",
      imageUrl: "/api/placeholder/400/320",
      price: "99.99",
      rating: 5,
    },
    {
      id: 2,
      title: "Standard Package",
      description: "Perfect balance of features and affordability for growing businesses.",
      category: "business",
      imageUrl: "/api/placeholder/400/320",
      price: "59.99",
      rating: 4,
    },
    {
      id: 3,
      title: "Basic Package",
      description: "Essential features to get started with your business needs.",
      category: "individual",
      imageUrl: "/api/placeholder/400/320",
      price: "29.99",
      rating: 3,
    },
  ]

  const filteredPackages =
    selectedCategory === "all" ? packages : packages.filter((pkg) => pkg.category === selectedCategory)

  const categories = [
    { id: "all", name: "All Packages" },
    { id: "individual", name: "Individual" },
    { id: "business", name: "Business" },
    { id: "enterprise", name: "Enterprise" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Our <span className="text-white">Packages</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-8">
              Choose the perfect package that suits your needs and budget. All packages come with our exceptional
              customer support.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Package Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <AnimatedSection className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Our Packages
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect package that suits your needs and budget. All packages come with our exceptional
              customer support.
            </p>
            <div className="h-1 w-24 bg-blue-500 mx-auto mt-6"></div>
          </AnimatedSection>
          
          <AnimatedSection
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            direction="up"
          >
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                title={pkg.title}
                description={pkg.description}
                imageUrl={pkg.imageUrl}
                buttonLink={`/packages/${pkg.id}`}
                category={pkg.category}
                price={pkg.price}
                rating={pkg.rating}
              />
            ))}
          </AnimatedSection>
          
          <div className="text-center mt-12">
            <a
              href="/contact"
              className="inline-block px-6 py-3 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              Contact Us For Custom Packages
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Package Comparison</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Compare our packages to find the one that best suits your needs.
            </p>
          </AnimatedSection>

          <AnimatedSection className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-4 px-6 text-left font-semibold">Features</th>
                  <th className="py-4 px-6 text-center font-semibold">Basic</th>
                  <th className="py-4 px-6 text-center font-semibold">Standard</th>
                  <th className="py-4 px-6 text-center font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6", "Feature 7"].map(
                  (feature, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6 text-gray-700">{feature}</td>
                      <td className="py-4 px-6 text-center">
                        {index < 3 ? (
                          <svg
                            className="w-5 h-5 text-green-500 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-red-500 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {index < 5 ? (
                          <svg
                            className="w-5 h-5 text-green-500 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-red-500 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <svg
                          className="w-5 h-5 text-green-500 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </td>
                    </tr>
                  ),
                )}
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 font-semibold">Price</td>
                  <td className="py-4 px-6 text-center font-semibold">$29.99/mo</td>
                  <td className="py-4 px-6 text-center font-semibold">$59.99/mo</td>
                  <td className="py-4 px-6 text-center font-semibold">$99.99/mo</td>
                </tr>
              </tbody>
            </table>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  )
}

export default PackagePage
