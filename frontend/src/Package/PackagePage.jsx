// 导入React核心库中的useState和useEffect钩子，用于在函数组件中管理状态和处理副作用
import React, { useState, useEffect } from "react";
// 导入framer-motion库，用于创建丰富的动画效果
import { motion } from "framer-motion";
// 导入自定义的动画区域组件，用于包裹内容并应用统一的入场动画
import AnimatedSection from "../components/AnimatedSection";
// 导入套餐卡片组件，用于展示单个套餐信息
import PackageCard from "../components/PackageCard";
// 导入页面头部组件，用于显示页面的标题和描述
import PageHeader from "../components/PageHeader";

// 定义PackagePage组件，这是套餐展示页面的主组件
const PackagePage = () => {
  // --- State Hooks: 状态管理 ---
  // [修正] selectedCategory 现在存储的是分类名称（如 'All' 或 'Food'）
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching: 使用useEffect处理数据获取的副作用 ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/packages");
        if (!response.ok) {
          throw new Error("从服务器获取数据失败，请检查网络连接或API状态。");
        }
        const data = await response.json();
        const packagesData = Array.isArray(data.packages) ? data.packages : [];
        const categoriesData = Array.isArray(data.categories)
          ? data.categories
          : [];
        const processedPackages = packagesData.map((pkg) => ({
          ...pkg,
          price: parseFloat((pkg.price || "0").replace(/,/g, "")),
        }));
        setCategories(categoriesData);
        setPackages(processedPackages);
      } catch (err) {
        setError(err.message);
        console.error("获取套餐数据时出错:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Helper Functions: 辅助函数 ---
  // [修正] 图标现在根据分类名称来映射，请根据你的实际分类名称修改
  const getCategoryIcon = (categoryName) => {
    const icons = {
      Food: "🍔",
      Drinks: "🥤",
      Desserts: "🍰",
      Uncategorized: "📦",
    };
    // 如果找不到匹配的图标，返回一个默认图标
    return icons[categoryName] || "🌟";
  };

  // [已移除] 不再需要 getCategoryNameBySlug 函数，因为后端直接提供了名称

  // --- Filtering Logic: 数据筛选逻辑 ---
  // [修正] 筛选逻辑现在直接比较套餐的 category 字段（现在是名称）和 selectedCategory
  const filteredPackages =
    selectedCategory === "All"
      ? packages
      : packages.filter((pkg) => pkg.category === selectedCategory);

  // --- Conditional Rendering ---
  if (loading) {
    /* ... 加载中 UI 不变 ... */
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading packages...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    /* ... 错误 UI 不变 ... */
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 p-10 max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Failed to load package
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <PageHeader
        title="Our Packages"
        description="Choose the perfect plan that best suits your needs and budget. All plans come with our excellent customer support."
      />

      <section className="py-8 bg-white/80 backdrop-blur-sm border-y border-blue-100 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 overflow-x-auto scrollbar-hide">
            {/* [修正] 手动添加 "All" 按钮，并使用 'All'作为 key 和 value */}
            <motion.button
              key="all"
              onClick={() => setSelectedCategory("All")}
              onMouseEnter={() => setHoveredCategory("all")}
              onMouseLeave={() => setHoveredCategory(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md"
              }`}
              style={{
                boxShadow:
                  hoveredCategory === "all"
                    ? "0 0 20px rgba(59, 130, 246, 0.5)"
                    : "",
              }}
            >
              <span className="text-lg">🌟</span>
              <span>All packages</span>
              {selectedCategory === "All" && (
                <span className="ml-1 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                  {filteredPackages.length}
                </span>
              )}
            </motion.button>
            {/* [修正] 遍历从 API 获取的分类, onClick 设置为 category.name */}
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md"
                }`}
                style={{
                  boxShadow:
                    hoveredCategory === category.id
                      ? "0 0 20px rgba(59, 130, 246, 0.5)"
                      : "",
                }}
              >
                <span className="text-lg">
                  {getCategoryIcon(category.name)}
                </span>
                <span>{category.name}</span>
                {selectedCategory === category.name && (
                  <span className="ml-1 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                    {filteredPackages.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-3">
            <p className="text-gray-600 text-sm md:text-base">
              Displaying {filteredPackages.length} package(s) out of{" "}
              {packages.length}
            </p>
          </div>
          <AnimatedSection
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            direction="up"
          >
            {filteredPackages.map((packageItem, index) => (
              <motion.div
                key={packageItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                }}
              >
                <PackageCard
                  title={packageItem.title}
                  description={packageItem.description}
                  imageUrls={[
                    packageItem.imageUrl ||
                      "https://via.placeholder.com/400x300.png?text=No+Image",
                  ]}
                  buttonLink={`/packages/${packageItem.id}`}
                  price={packageItem.price}
                  rating={packageItem.rating}
                  inStock={true}
                  // [修正] 现在直接传递后端返回的 category 字段（即分类名称）
                  categoryName={packageItem.category}
                />
              </motion.div>
            ))}
          </AnimatedSection>
          {filteredPackages.length === 0 &&
            !loading /* ... 空状态 UI 不变 ... */ && (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-10 max-w-md mx-auto">
                  <div className="text-blue-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No packages found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any packages in this category.
                  </p>
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                  >
                    View all packages
                  </button>
                </div>
              </div>
            )}
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-100/50 to-transparent z-0"></div>
    </div>
  );
};

export default PackagePage;
