import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";

const ProductPage = () => {
  // 状态管理
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // 价格范围过滤条件
  const PRICE_FILTERS = {
    "0-50": product => product.price >= 0 && product.price <= 50,
    "51-100": product => product.price >= 51 && product.price <= 100,
    "101-200": product => product.price >= 101 && product.price <= 200,
    "200+": product => product.price > 200,
  };

  // 排序功能
  const SORT_FUNCTIONS = {
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
    "rating": (a, b) => b.rating - a.rating,
    "name": (a, b) => a.name.localeCompare(b.name),
    "featured": (a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0),
  };

  // 过滤和排序产品
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];

    let result = products
      .filter(product => selectedCategory === "all" || product.category === selectedCategory)
      .filter(product => priceRange === "all" || (PRICE_FILTERS[priceRange] && PRICE_FILTERS[priceRange](product)))
      .filter(product => !searchTerm.trim() || product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (SORT_FUNCTIONS[sortBy]) {
      result.sort(SORT_FUNCTIONS[sortBy]);
    }

    return result;
  }, [products, selectedCategory, priceRange, searchTerm, sortBy]);

  // 获取产品数据
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      const formattedProducts = data.products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        category: product.category.name,
        rating: parseInt(product.rating, 10) || Math.floor(Math.random() * 5) + 1,
        imageUrls: product.images.map(img => `${BASE_IMAGE_URL}${img.image_path}`),
        isActive: !!product.is_active, //确保是布尔值
      }));
      setProducts(formattedProducts);
      setCategories([...new Set(data.products.map(p => p.category.name))]);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // 更新URL参数
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (priceRange !== "all") params.set("price", priceRange);
    if (searchTerm.trim()) params.set("search", searchTerm);
    if (sortBy !== "featured") params.set("sort", sortBy);
    setSearchParams(params, { replace: true }); // 使用 replace: true 避免不必要的历史记录条目
  };

  // 重置所有过滤器
  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setSearchTerm("");
    setSortBy("featured");
    setSearchParams({});
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchProducts();
  }, []); 

  // 从URL参数中恢复过滤条件并更新URL
  useEffect(() => {
    const categoryFromURL = searchParams.get("category") || "all";
    const priceFromURL = searchParams.get("price") || "all";
    const searchFromURL = searchParams.get("search") || "";
    const sortFromURL = searchParams.get("sort") || "featured";

    setSelectedCategory(categoryFromURL);
    setPriceRange(priceFromURL);
    setSearchTerm(searchFromURL);
    setSortBy(sortFromURL);

    // 只有当 products 加载完毕后才更新 searchParams，以避免初始加载时覆盖
    // 并且仅当 URL 参数与当前状态不同时才更新，以防止不必要的重渲染
    if (products.length > 0 && 
        (selectedCategory !== categoryFromURL || 
         priceRange !== priceFromURL || 
         searchTerm !== searchFromURL || 
         sortBy !== sortFromURL)) {
      updateSearchParams();
    }
  }, [searchParams, products.length]); // 依赖项中加入 searchParams

  // 当过滤条件改变时更新URL参数
  useEffect(() => {
    // 确保 products 已经加载，避免在初始加载时就更新 URL
    if (products.length > 0) {
      updateSearchParams();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedCategory, priceRange, searchTerm, sortBy]); // 移除 products.length，因为上面的 useEffect 已经处理了初始加载

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Fishing Species Guide"
        description="Discover various fish species suitable for fishing and learn about their habits and characteristics."
      />

      <section className="py-4 md:py-8 lg:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              <span className="font-medium">Filter Options</span>
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
            <div className={`lg:w-1/4 w-full ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <AnimatedSection
                direction="left"
                className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-4 md:p-6 sticky top-4 md:top-24 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-4 md:mb-6">
                  <button
                    onClick={resetFilters}
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>

                <div className="mb-4 md:mb-8">
                  <h3 className="font-semibold mb-2 md:mb-3">Fish Categories</h3>
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
                        All Categories
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
                        <label htmlFor={category} className="ml-2 text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4 md:mb-8">
                  <h3 className="font-semibold mb-2 md:mb-3">Price Range</h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-all"
                        name="price"
                        checked={priceRange === "all"}
                        onChange={() => setPriceRange("all")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-all" className="ml-2 text-gray-700">
                        All Prices
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-0-50"
                        name="price"
                        checked={priceRange === "0-50"}
                        onChange={() => setPriceRange("0-50")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-0-50" className="ml-2 text-gray-700">
                        $0 - $50
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-51-100"
                        name="price"
                        checked={priceRange === "51-100"}
                        onChange={() => setPriceRange("51-100")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-51-100" className="ml-2 text-gray-700">
                        $51 - $100
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-101-200"
                        name="price"
                        checked={priceRange === "101-200"}
                        onChange={() => setPriceRange("101-200")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-101-200" className="ml-2 text-gray-700">
                        $101 - $200
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="price-200+"
                        name="price"
                        checked={priceRange === "200+"}
                        onChange={() => setPriceRange("200+")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="price-200+" className="ml-2 text-gray-700">
                        $200+
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 md:mb-3">Sort By</h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="sort-rating"
                        name="sort"
                        checked={sortBy === "rating"}
                        onChange={() => setSortBy("rating")}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                      />
                      <label htmlFor="sort-rating" className="ml-2 text-gray-700">
                        Highest Rating
                      </label>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:w-3/4 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
                <p className="text-gray-600 text-sm md:text-base">
                  Showing {filteredProducts.length} fish species out of {products.length} total
                </p>
                <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3 md:space-x-4">
                  <div className="flex items-center w-full md:w-auto order-1 md:order-2">
                    <label htmlFor="sort" className="mr-2 text-gray-600 text-sm md:text-base whitespace-nowrap">
                      Sort:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-grow md:flex-grow-0 border-2 border-blue-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:border-blue-300 transition-all duration-300"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rating</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>

                  <div className="relative flex-grow order-2 md:order-1">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32 md:h-64">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 md:py-12">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-red-600">
                    Error Loading Products
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Reload
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    No fish species found
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    Try adjusting your filters or search term.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <AnimatedSection direction="up" className="w-full"> {/* Ensure AnimatedSection itself takes full width */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    <AnimatePresence>
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card
                            imageUrls={product.imageUrls}
                            title={product.name}
                            subtitle={product.description}
                            price={product.price}
                            category={product.category}
                            rating={product.rating}
                            footer={
                              <div className="flex justify-between items-center">
                                <span className={`px-2 py-1 rounded-md text-xs ${
                                  product.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {product.isActive ? "Active" : "Inactive"}
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
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;