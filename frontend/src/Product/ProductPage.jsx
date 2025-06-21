// src/pages/ProductPage.jsx

// --- 依赖导入 ---
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

// --- 自定义 Hook：封装所有产品逻辑 ---
const useProductFilters = () => {
  // --- 状态定义 ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 筛选和排序状态定义 ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedRating, setSelectedRating] = useState(0); // ✅ 新增：按评分筛选的状态，0 表示不过滤

  // --- 静态常量定义 ---
  const PRICE_FILTERS = {
    "0-50": (product) => product.price >= 0 && product.price <= 50,
    "51-100": (product) => product.price >= 51 && product.price <= 100,
    "101-200": (product) => product.price >= 101 && product.price <= 200,
    "200+": (product) => product.price > 200,
  };

  const SORT_FUNCTIONS = {
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
    featured: (a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0),
  };

  // --- 数据获取函数 ---
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!data || !data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid API response format");
      }

      const formattedProducts = data.products
        .map((product) => {
          if (!product) return null;

          const imageUrls =
            product.image_urls && product.image_urls.length > 0
              ? product.image_urls
              : ["/assets/images/placeholder.png"];

          return {
            id: product.id,
            name: product.name || "Unknown Product",
            description: product.description || "No description available",
            price: parseFloat(product.price) || 0,
            category: product.category?.name || "Uncategorized",
            // ✅ 核心修改: 如果 rating 无效或为0，则设为0，而不是随机数。UI将显示空星星。
            rating: parseInt(product.rating, 10) || 0,
            imageUrls,
            isActive: !!product.is_active,
          };
        })
        .filter(Boolean);

      setProducts(formattedProducts);

      const categoryNames = data.categories.map((cat) => cat.name);
      setCategories(categoryNames);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 副作用 Hooks (useEffect) ---
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // ✅ 新增：同步评分筛选
    setSelectedCategory(searchParams.get("category") || "all");
    setPriceRange(searchParams.get("price") || "all");
    setSearchTerm(searchParams.get("search") || "");
    setSortBy(searchParams.get("sort") || "featured");
    setSelectedRating(parseInt(searchParams.get("rating"), 10) || 0); // 从URL同步评分
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (priceRange !== "all") params.set("price", priceRange);
    if (searchTerm.trim()) params.set("search", searchTerm);
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (selectedRating > 0) params.set("rating", selectedRating); // ✅ 新增：如果选择了评分，则添加到URL
    setSearchParams(params, { replace: true });
  }, [selectedCategory, priceRange, searchTerm, sortBy, selectedRating, setSearchParams]); // ✅ 新增依赖

  // --- 筛选和排序逻辑 ---
  const filteredProducts = useMemo(() => {
    let result = products
      .filter(
        (p) => selectedCategory === "all" || p.category === selectedCategory
      )
      .filter(
        (p) =>
          priceRange === "all" ||
          (PRICE_FILTERS[priceRange] && PRICE_FILTERS[priceRange](p))
      )
      .filter(
        (p) =>
          !searchTerm.trim() ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // ✅ 新增：按评分筛选
      .filter((p) => selectedRating === 0 || p.rating >= selectedRating);

    if (SORT_FUNCTIONS[sortBy]) {
      result.sort(SORT_FUNCTIONS[sortBy]);
    }
    return result;
  }, [products, selectedCategory, priceRange, searchTerm, sortBy, selectedRating]); // ✅ 新增依赖

  // --- 重置函数 ---
  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setSearchTerm("");
    setSortBy("featured");
    setSelectedRating(0); // ✅ 新增：重置评分筛选
  };

  // --- 返回值 ---
  return {
    products,
    categories,
    filteredProducts,
    isLoading,
    error,
    // ✅ 将 selectedRating 添加到 filters 和 setters
    filters: { selectedCategory, priceRange, searchTerm, sortBy, selectedRating },
    setters: { setSelectedCategory, setPriceRange, setSearchTerm, setSortBy, setSelectedRating },
    resetFilters,
    retryFetch: fetchProducts,
  };
};

// --- UI 子组件 ---

// 星星评分显示组件
const StarRating = ({ rating, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// 筛选侧边栏组件
const FilterSidebar = ({ categories, filters, setters, resetFilters }) => {
  // ✅ 从 props 解构出新的状态和设置函数
  const { selectedCategory, priceRange, selectedRating } = filters;
  const { setSelectedCategory, setPriceRange, setSelectedRating } = setters;

  return (
    <AnimatedSection
      direction="left"
      className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-4 md:p-6 sticky top-24 hover:border-blue-300 transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold">Filters</h2>
        <button
          onClick={resetFilters}
          className="px-3 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-gray-300 hover:text-black transition-colors cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
      
      {/* Categories Filter */}
      <div className="mb-4 md:mb-8">
        <h3 className="font-semibold mb-2 md:mb-3">Categories</h3>
        <div className="space-y-1 md:space-y-2">
          {["all", ...categories].map((category) => (
            <div key={category} className="flex items-center">
              <input
                type="radio"
                id={category}
                name="category"
                checked={selectedCategory === category}
                onChange={() => setSelectedCategory(category)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={category}
                className="ml-2 text-gray-700 capitalize cursor-pointer"
              >
                {category === "all" ? "All Categories" : category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-4 md:mb-8">
        <h3 className="font-semibold mb-2 md:mb-3">Price Range</h3>
        <div className="space-y-1 md:space-y-2">
          {["all", "0-50", "51-100", "101-200", "200+"].map((range) => (
            <div key={range} className="flex items-center">
              <input
                type="radio"
                id={`price-${range}`}
                name="price"
                checked={priceRange === range}
                onChange={() => setPriceRange(range)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`price-${range}`} className="ml-2 text-gray-700 cursor-pointer">
                {range === "all"
                  ? "All Prices"
                  : range.includes("+")
                  ? `$${range}`
                  : `$${range.replace("-", " - $")}`}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 新增：Rating Filter */}
      <div className="mb-4 md:mb-8">
        <h3 className="font-semibold mb-2 md:mb-3">Rating</h3>
        <div className="space-y-1 md:space-y-2">
          {/* Option for all ratings */}
          <div className="flex items-center">
            <input
              type="radio"
              id="rating-all"
              name="rating"
              checked={selectedRating === 0}
              onChange={() => setSelectedRating(0)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="rating-all" className="ml-2 text-gray-700 cursor-pointer">
              All Ratings
            </label>
          </div>
          {/* Options for specific ratings (4, 3, 2, 1) */}
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="radio"
                id={`rating-${rating}`}
                name="rating"
                checked={selectedRating === rating}
                onChange={() => setSelectedRating(rating)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center gap-1 text-gray-700 cursor-pointer">
                <StarRating rating={rating} />
                <span>& Up</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

// 产品控制栏组件 (保持不变)
const ProductControls = ({ searchTerm, setSearchTerm, sortBy, setSortBy, filteredCount, totalCount }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
    <p className="text-gray-600 text-sm md:text-base">
      Showing {filteredCount} of {totalCount} products
    </p>
    <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 pl-10 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:border-blue-300 transition-all duration-300"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="flex items-center w-full md:w-auto">
        <label htmlFor="sort" className="mr-2 text-gray-600 text-sm md:text-base whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="flex-grow md:flex-grow-0 border-2 border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 shadow-sm hover:border-blue-300 transition-all duration-300"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rating</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  </div>
);

// 产品网格组件 (保持不变, 因为 Card 组件会处理 rating=0 的情况)
const ProductGrid = ({ isLoading, error, products, retryFetch, resetFilters }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <AnimatedSection direction="up" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <AnimatePresence>
          {products.map((product) => (
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
                imageAlt={product.name}
                title={product.name}
                subtitle={product.description}
                price={product.price}
                category={product.category}
                rating={product.rating} // rating=0 会被 Card 组件正确处理
                footer={
                  <div className="flex justify-between items-center w-full">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                        product.isActive
                          ? "bg-teal-100 text-teal-900"
                          : "bg-rose-100 text-rose-900"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm cursor-pointer transition-all duration-300 ease-out hover:bg-blue-700 hover:-translate-y-0.5 transform-gpu shadow-sm hover:shadow-lg shadow-blue-500/20"
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
  );
};

// --- 主页面组件 ---
const ProductPage = () => {
  const {
    products,
    categories,
    filteredProducts,
    isLoading,
    error,
    filters,
    setters,
    resetFilters,
    retryFetch,
  } = useProductFilters();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Our Product Collection"
        description="Explore our diverse range of high-quality products. Use the advanced filters to find exactly what you need."
      />
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              <span className="font-medium">Filter & Sort Options</span>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div
              className={`lg:w-1/4 w-full ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <FilterSidebar
                categories={categories}
                filters={filters}
                setters={setters}
                resetFilters={resetFilters}
              />
            </div>
            <div className="lg:w-3/4 w-full">
              <ProductControls
                searchTerm={filters.searchTerm}
                setSearchTerm={setters.setSearchTerm}
                sortBy={filters.sortBy}
                setSortBy={setters.setSortBy}
                filteredCount={filteredProducts.length}
                totalCount={products.length}
              />
              <ProductGrid
                isLoading={isLoading}
                error={error}
                products={filteredProducts}
                retryFetch={retryFetch}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductPage;