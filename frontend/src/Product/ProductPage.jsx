// src/pages/ProductPage.jsx

// 导入 React 核心库中的 Hooks。
import { useState, useEffect, useMemo } from "react";
// 导入 Framer Motion 用于动画效果。
import { motion, AnimatePresence } from "framer-motion";
// 导入 React Router 的 Link 和 useSearchParams 用于路由和URL参数管理。
import { Link, useSearchParams } from "react-router-dom";
// 导入自定义的 UI 组件。
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";

// --- 全局常量 ---

// 定义存储在 Laravel 后端的图片的基础 URL。
const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";

// --- 自定义 Hook：封装所有产品逻辑 ---

/**
 * 自定义 Hook: useProductFilters
 * 这个 Hook 封装了所有与产品数据获取、过滤、排序和URL同步相关的复杂逻辑。
 * 这样做可以极大地简化主组件(ProductPage)，使其只关注于UI的布局和组合。
 */
const useProductFilters = () => {
  // 状态管理
  const [products, setProducts] = useState([]); // 存储从API获取的原始产品列表。
  const [categories, setCategories] = useState([]); // 存储所有产品分类。
  const [isLoading, setIsLoading] = useState(true); // 标记是否正在加载数据。
  const [error, setError] = useState(null); // 存储数据获取过程中的错误信息。

  // 过滤条件的状态管理
  const [searchParams, setSearchParams] = useSearchParams(); // Hook，用于读取和写入URL查询参数。
  const [selectedCategory, setSelectedCategory] = useState("all"); // 当前选中的分类。
  const [priceRange, setPriceRange] = useState("all"); // 当前选中的价格范围。
  const [searchTerm, setSearchTerm] = useState(""); // 当前的搜索关键词。
  const [sortBy, setSortBy] = useState("featured"); // 当前的排序方式。

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
    setIsLoading(true); // 开始获取前，设置加载状态为 true。
    setError(null); // 清空之前的错误。
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
          if (imageUrls.length === 0) imageUrls = ["/api/placeholder/300/200"];

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
        .filter(Boolean); // 过滤掉所有 null 值。

      setProducts(formattedProducts);
      // 从格式化后的产品数据中提取唯一的分类名称。
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
  }, []); // 空依赖数组表示此 effect 只运行一次。

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
 * 这是一个纯展示性组件，它接收 props 并渲染 UI，不包含自身的状态逻辑。
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
          className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Reset All Filters
        </button>
      </div>

      <div className="mb-4 md:mb-8">
        <h3 className="font-semibold mb-2 md:mb-3">Fish Categories</h3>
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
      Showing {filteredCount} fish species out of {totalCount} total
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
);

/**
 * 产品网格组件
 * 它负责处理加载、错误、无结果和成功渲染这四种UI状态。
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
        <h3 className="text-xl font-semibold mb-2">No fish species found</h3>
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
                title={product.name}
                subtitle={product.description}
                price={product.price}
                category={product.category}
                rating={product.rating}
                footer={
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs md:text-sm inline-block text-center"
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
 * 经过重构，此组件现在非常简洁。它的主要职责是：
 * 1. 调用 useProductFilters Hook 获取所有状态和逻辑。
 * 2. 组合各个子组件，并将从 Hook 获取的数据作为 props 传递下去。
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
