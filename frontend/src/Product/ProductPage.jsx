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
  const [showFilters, setShowFilters] = useState(false); // 控制移动设备上过滤器的显示/隐藏

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
          {/* Mobile Filter Toggle Button - Always at the top */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              <span className="font-medium">筛选条件</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:w-1/4 w-full ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <AnimatedSection
                direction="left"
                className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 shadow-md p-4 md:p-6 sticky top-4 md:top-24 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold">筛选</h2>
                  <button 
                    onClick={() => setShowFilters(false)} 
                    className="lg:hidden p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-4 md:mb-8">
                  <h3 className="font-semibold mb-2 md:mb-3">鱼类种类</h3>
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
                        所有种类
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
                  <h3 className="font-semibold mb-2 md:mb-3">价格范围</h3>
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
                        所有价格
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
                        价格: 从低到高
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
                        价格: 从高到低
                      </label>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-semibold mb-2 md:mb-3">评分</h3>
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
                        最高评分
                      </label>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4 w-full">
              {/* Mobile View: First show product count, then sort options, search box at the end */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
                <p className="text-gray-600 text-sm md:text-base">
                  显示 {filteredProducts.length} 种鱼类，共 {products.length} 种
                </p>
                <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3 md:space-x-4">
                  {/* Sort Dropdown - Moved up for mobile */}
                  <div className="flex items-center w-full md:w-auto order-1 md:order-2">
                    <label htmlFor="sort" className="mr-2 text-gray-600 text-sm md:text-base whitespace-nowrap">
                      排序方式:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-grow md:flex-grow-0 border-2 border-blue-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:border-blue-300 transition-all duration-300"
                    >
                      <option value="featured">推荐</option>
                      <option value="price-low">价格: 从低到高</option>
                      <option value="price-high">价格: 从高到低</option>
                      <option value="rating">最高评分</option>
                    </select>
                  </div>

                  {/* Search Box - Moved to bottom for mobile */}
                  <div className="relative flex-grow order-2 md:order-1">
                    <input
                      type="text"
                      placeholder="搜索鱼类..."
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
                              {product.inStock ? "有货" : "缺货"}
                            </span>
                            <Link
                              to={`/products/${product.id}`}
                              className="px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs md:text-sm"
                            >
                              查看详情
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
                    上一页
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
                    下一页
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
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">精选鱼类</h2>
            <p className="text-gray-700 max-w-xl md:max-w-2xl mx-auto text-sm md:text-base">
              查看我们最受钓鱼爱好者欢迎的鱼类。
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
                        {product.inStock ? "有货" : "缺货"}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs md:text-sm"
                      >
                        查看详情
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
