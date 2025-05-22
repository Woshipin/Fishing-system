import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching products from an API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock product data
      const mockProducts = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        name: `Fish Species ${i + 1}`,
        description:
          "This is a common freshwater fish, suitable for fishing enthusiasts. It lives in lakes, rivers, and ponds, and prefers warm waters.This is a common freshwater fish, suitable for fishing enthusiasts. It lives in lakes, rivers, and ponds, and prefers warm waters.This is a common freshwater fish, suitable for fishing enthusiasts. It lives in lakes, rivers, and ponds, and prefers warm waters.",
        price: Math.floor(Math.random() * 200) + 20,
        category: ["Carp", "Crucian", "Grass Carp", "Bass", "Snakehead"][
          Math.floor(Math.random() * 5)
        ],
        rating: Math.floor(Math.random() * 5) + 1,
        imageUrl: "/assets/About/about-us.png",
        featured: Math.random() > 0.7,
        inStock: Math.random() > 0.2,
      }));

      setProducts(mockProducts);
      setFilteredProducts(mockProducts);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(mockProducts.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);

      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(result);

    // Update URL params
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy !== "featured") params.set("sort", sortBy);
    setSearchParams(params);
  }, [products, selectedCategory, searchTerm, sortBy, setSearchParams]);

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    if (category) setSelectedCategory(category);
    if (search) setSearchTerm(search);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <PageHeader
        title="Fishing Species Guide"
        description="Discover various fish species suitable for fishing and learn about their habits and characteristics."
      />

      {/* Filter and Products Section */}
      <section className="py-4 md:py-8 lg:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4 w-full">
              <AnimatedSection
                direction="left"
                className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 shadow-md p-4 md:p-6 sticky top-4 md:top-24 hover:border-blue-300 transition-all duration-300"
              >
                <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Filters</h2>

                {/* Categories */}
                <div className="mb-4 md:mb-8">
                  <h3 className="font-semibold mb-2 md:mb-3">Fish Species</h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="all"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="all" className="ml-2 text-gray-700">
                        All Species
                      </label>
                    </div>
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                        />
                        <label
                          htmlFor={category}
                          className="ml-2 text-gray-700"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-4 md:mb-8">
                  <h3 className="font-semibold mb-2 md:mb-3">Price Range</h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-all"
                        name="price"
                        checked={sortBy === "featured"}
                        onChange={() => setSortBy("featured")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-all" className="ml-2 text-gray-700">
                        All Prices
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-low"
                        name="price"
                        checked={sortBy === "price-low"}
                        onChange={() => setSortBy("price-low")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-low" className="ml-2 text-gray-700">
                        Price: Low to High
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-high"
                        name="price"
                        checked={sortBy === "price-high"}
                        onChange={() => setSortBy("price-high")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label
                        htmlFor="price-high"
                        className="ml-2 text-gray-700"
                      >
                        Price: High to Low
                      </label>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-semibold mb-2 md:mb-3">Rating</h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="rating"
                        name="rating"
                        checked={sortBy === "rating"}
                        onChange={() => setSortBy("rating")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="rating" className="ml-2 text-gray-700">
                        Highest Rated
                      </label>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4 w-full">
              {/* Search and Sort Options */}
              <div className="flex flex-wrap justify-between items-center mb-4 md:mb-8">
                <p className="text-gray-600 text-sm md:text-base">
                  Showing {filteredProducts.length} fish species out of{" "}
                  {products.length}
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Search Box */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search fish species..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 pl-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:border-blue-300 transition-all duration-300"
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 014 12.66M16.9 17.9l1.93 1.93"
                      />
                    </svg>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-gray-600 text-sm md:text-base">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border-2 border-blue-200 rounded-lg px-2 py-1 md:px-3 md:py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:border-blue-300 transition-all duration-300"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="flex justify-center items-center h-32 md:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              ) : (
                <AnimatedSection
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
                  direction="up"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card
                        imageUrl={product.imageUrl}
                        title={product.name}
                        subtitle={product.description}
                        price={product.price}
                        category={product.category}
                        rating={product.rating}
                        footer={
                          <div className="flex justify-between items-center">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            <Link
                              to={`/products/${product.id}`}
                              className="px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs md:text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        }
                      />
                    </motion.div>
                  ))}
                </AnimatedSection>
              )}

              {/* Pagination */}
              <div className="mt-8 md:mt-12 flex justify-center">
                <nav className="flex items-center space-x-1 md:space-x-2">
                  <button className="px-2 py-1 md:px-3 md:py-2 rounded-lg border-2 border-blue-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm text-sm md:text-base">
                    Previous
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-2 rounded-lg bg-blue-500 text-white border-2 border-blue-500 shadow-md text-sm md:text-base">
                    1
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-2 rounded-lg border-2 border-blue-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm text-sm md:text-base">
                    2
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-2 rounded-lg border-2 border-blue-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm text-sm md:text-base">
                    3
                  </button>
                  <button className="px-2 py-1 md:px-3 md:py-2 rounded-lg border-2 border-blue-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm text-sm md:text-base">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-4 md:py-8 lg:py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/10 to-secondary/10 z-0"></div>
        <div className="container mx-auto px-2 sm:px-4 relative z-10">
          <AnimatedSection className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Featured Fish Species</h2>
            <p className="text-gray-700 max-w-xl md:max-w-2xl mx-auto text-sm md:text-base">
              Check out our most popular fish species among fishing enthusiasts.
            </p>
          </AnimatedSection>

          <AnimatedSection
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 lg:gap-6"
            direction="up"
          >
            {products
              .filter((product) => product.featured)
              .slice(0, 4)
              .map((product) => (
                <Card
                  key={product.id}
                  imageUrl={product.imageUrl}
                  title={product.name}
                  subtitle={product.category}
                  price={product.price}
                  category={product.category}
                  rating={product.rating}
                  footer={
                    <div className="flex justify-between items-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs md:text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  }
                />
              ))}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
