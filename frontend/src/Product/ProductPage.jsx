// src/pages/ProductPage.jsx

// 导入 React 核心库中的 Hooks。
import { useState, useEffect, useMemo } from "react";
// 导入 Framer Motion 用于动画效果。
import { motion, AnimatePresence } from "framer-motion";
// 导入 React Router 的 Link 和 useSearchParams 用于路由和URL参数管理。
import { Link, useSearchParams } from "react-router-dom";
// 导入自定义的 UI 组件。
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card"; // 确保你使用的是上一轮重构后的 Card 组件
import PageHeader from "../components/PageHeader";

// --- 全局常量 ---

// 定义存储在 Laravel 后端的图片的基础 URL。
const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";

// --- 自定义 Hook：封装所有产品逻辑 ---

/**
 * 自定义 Hook: useProductFilters
 * 这个 Hook 封装了所有与产品数据获取、过滤、排序和URL同步相关的复杂逻辑。
 */
const useProductFilters = () => {
  // 状态管理
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 过滤条件的状态管理
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // 定义价格范围的过滤逻辑函数映射。
  const PRICE_FILTERS = {
    "0-50": (product) => product.price >= 0 && product.price <= 50,
    "51-100": (product) => product.price >= 51 && product.price <= 100,
    "101-200": (product) => product.price >= 101 && product.price <= 200,
    "200+": (product) => product.price > 200,
  };

  // 定义排序逻辑函数映射。
  const SORT_FUNCTIONS = {
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
    featured: (a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0),
  };

  // 异步函数：从API获取产品数据。
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (!data || !data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid API response format");
      }

      // 将API返回的原始数据格式化为前端需要的结构。
      const formattedProducts = data.products
        .map((product) => {
          if (!product) return null;
          let imageUrls = (product.productImages || []).map(
            (img) => `${BASE_IMAGE_URL}${img.image_path}`
          );
          if (imageUrls.length === 0) imageUrls = ["/assets/About/about-us.png"]; // 使用默认占位图

          return {
            id: product.id,
            name: product.name || "Unknown Product",
            description: product.description || "No description available",
            price: parseFloat(product.price) || 0,
            category: product.category?.name || "Uncategorized",
            rating:
              parseInt(product.rating, 10) || Math.floor(Math.random() * 5) + 1,
            imageUrls,
            isActive: !!product.is_active,
          };
        })
        .filter(Boolean);

      setProducts(formattedProducts);
      const categoryNames = [
        ...new Set(formattedProducts.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(categoryNames);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to load products: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 使用 useEffect 在组件首次挂载时调用 fetchProducts。
  useEffect(() => {
    fetchProducts();
  }, []);

  // 使用 useEffect，当URL参数变化时，从URL同步状态到组件内部。
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setPriceRange(searchParams.get("price") || "all");
    setSearchTerm(searchParams.get("search") || "");
    setSortBy(searchParams.get("sort") || "featured");
  }, [searchParams]);

  // 使用 useEffect，当过滤条件状态改变时，将状态同步到URL参数。
  useEffect(() => {
    if (products.length > 0) {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (priceRange !== "all") params.set("price", priceRange);
      if (searchTerm.trim()) params.set("search", searchTerm);
      if (sortBy !== "featured") params.set("sort", sortBy);
      setSearchParams(params, { replace: true });
    }
  }, [
    selectedCategory,
    priceRange,
    searchTerm,
    sortBy,
    products.length,
    setSearchParams,
  ]);

  // 使用 useMemo 对过滤和排序逻辑进行性能优化。
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
      );

    if (SORT_FUNCTIONS[sortBy]) result.sort(SORT_FUNCTIONS[sortBy]);
    return result;
  }, [products, selectedCategory, priceRange, searchTerm, sortBy]);

  // 重置所有过滤器的函数。
  const resetFilters = () => {
    setSelectedCategory("all");
    setPriceRange("all");
    setSearchTerm("");
    setSortBy("featured");
  };

  // 从 Hook 返回所有UI层需要的数据和函数。
  return {
    products,
    categories,
    filteredProducts,
    isLoading,
    error,
    filters: { selectedCategory, priceRange, searchTerm, sortBy },
    setters: { setSelectedCategory, setPriceRange, setSearchTerm, setSortBy },
    resetFilters,
    retryFetch: fetchProducts,
  };
};

// --- 可重用的 UI 子组件 ---

/**
 * 过滤侧边栏组件
 */
const FilterSidebar = ({ categories, filters, setters, resetFilters }) => {
    const { selectedCategory, priceRange, sortBy } = filters;
    const { setSelectedCategory, setPriceRange, setSortBy } = setters;
  
    return (
      <AnimatedSection
        direction="left"
        className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-4 md:p-6 sticky top-4 md:top-24 hover:border-blue-300 transition-all duration-300"
      >
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Filters</h2>
  
        <div className="mb-4 md:mb-6">
          <button
            onClick={resetFilters}
            className="w-full px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
  
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
                  className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                />
                <label
                  htmlFor={category}
                  className="ml-2 text-gray-700 capitalize"
                >
                  {category === "all" ? "All Categories" : category}
                </label>
              </div>
            ))}
          </div>
        </div>
  
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
                  className="w-4 h-4 text-blue-500 focus:ring-blue-300 border-blue-200"
                />
                <label htmlFor={`price-${range}`} className="ml-2 text-gray-700">
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
    );
};

/**
 * 产品控制栏组件 (搜索和排序)
 */
const ProductControls = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filteredCount,
  totalCount,
}) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-3">
    <p className="text-gray-600 text-sm md:text-base">
      Showing {filteredCount} products out of {totalCount} total
    </p>
    <div className="w-full md:w-auto flex flex-col md:flex-row items-stretch md:items-center gap-3 md:space-x-4">
      <div className="flex items-center w-full md:w-auto order-1 md:order-2">
        <label
          htmlFor="sort"
          className="mr-2 text-gray-600 text-sm md:text-base whitespace-nowrap"
        >
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
          placeholder="Search products..."
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
);

/**
 * 产品网格组件
 */
const ProductGrid = ({
  isLoading,
  error,
  products,
  retryFetch,
  resetFilters,
}) => {
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-red-600">
            Error Loading Products
          </h3>
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
  if (products.length === 0)
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-gray-600 mb-4">Try adjusting your filters.</p>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );

  return (
    <AnimatedSection direction="up" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
                rating={product.rating}
                footer={
                  // [修正] 确保 footer 容器宽度为 100%
                  <div className="flex justify-between items-center w-full">
                    {/* [修正] 应用与 PackageCard 一致的标签样式 */}
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-bold
                        ${
                          product.isActive
                            ? 'bg-teal-100 text-teal-900' // Active 状态样式
                            : 'bg-rose-100 text-rose-900'  // Inactive 状态样式
                        }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    {/* [修正] 应用与 PackageCard 一致的按钮样式 */}
                    <Link
                      to={`/products/${product.id}`}
                      className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm cursor-pointer
                                 transition-all duration-300 ease-out
                                 hover:bg-blue-700 hover:-translate-y-0.5 transform-gpu
                                 shadow-sm hover:shadow-lg shadow-blue-500/20"
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

/**
 * 产品展示页面主组件
 */
const ProductPage = () => {
  // 从自定义 Hook 中解构出所有需要的数据和函数。
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

  // 唯一的本地状态，仅用于控制移动端过滤器的显示/隐藏。
  const [showFilters, setShowFilters] = useState(false);

  // 返回页面的 JSX 结构。
  return (
    <div className="min-h-screen">
      <PageHeader
        title="Product Showcase"
        description="Discover our wide range of products. Use the filters to find exactly what you're looking for."
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

          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
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