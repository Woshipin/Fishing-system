import { useState } from "react"
import AnimatedSection from "../components/AnimatedSection"
import PackageCard from "../components/PackageCard"
import PageHeader from "../components/PageHeader"

const PackagePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const packages = [
    {
      id: 1,
      title: "Premium Package",
      description: "Our most comprehensive solution for businesses of all sizes.Our most comprehensive solution for businesses of all sizes.Our most comprehensive solution for businesses of all sizes.Our most comprehensive solution for businesses of all sizes.Our most comprehensive solution for businesses of all sizes.",
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
      <PageHeader
        title="Our Packages"
        description="Choose the perfect package that suits your needs and budget. All packages come with our exceptional customer support."
      />

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
                    ? "bg-indigo-600 text-white border border-blue-300/50 shadow-blue-200/50"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-blue-200/40 shadow-blue-100/30 hover:shadow-blue-200/40"
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
        </div>
      </section>
    </div>
  )
}

export default PackagePage
