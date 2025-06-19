// 导入 React 核心库，以及 useState, useEffect, useCallback 这些钩子函数
import React, { useState, useEffect, useCallback } from "react";
// 导入 axios 用于发送 HTTP 请求
import axios from "axios";
// 导入 react-router-dom 的 useParams (获取路由参数) 和 Link (用于导航)
import { useParams, Link } from "react-router-dom";
// 导入自定义的动画容器组件
import AnimatedSection from "../components/AnimatedSection";
// 导入自定义的卡片组件
import Card from "../components/Card";

// --- 常量定义 ---
// 定义 API 的基础 URL，方便统一管理和修改
const API_BASE_URL = "http://127.0.0.1:8000/api";
// 定义图片存储的基础 URL
const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";
// 定义一个默认的备用图片 URL，当产品图片加载失败或不存在时使用
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

// --- 数据转换辅助函数 ---

/**
 * 从多种可能的 API 响应结构中提取并格式化图片 URL。
 * @param {object} item - 来自 API 的产品项对象。
 * @returns {string[]} 一个包含完整图片 URL 的数组。
 */
const extractImageUrls = (item) => {
  // 初始化一个空数组来存储图片 URL
  let imageUrls = [];
  // 检查 item.image_urls 是否存在且为数组
  if (item.image_urls && Array.isArray(item.image_urls)) {
    // 如果是，直接使用它
    imageUrls = item.image_urls;
    // 否则，检查 item.productImages 是否存在且为数组 (另一种可能的 API 格式)
  } else if (item.productImages && Array.isArray(item.productImages)) {
    // 如果是，遍历数组并将每个图片路径与基础 URL 拼接
    imageUrls = item.productImages.map(
      (img) => `${BASE_IMAGE_URL}${img.image_path}`
    );
    // 否则，检查 item.images 是否存在且为数组 (又一种可能的 API 格式)
  } else if (item.images && Array.isArray(item.images)) {
    // 如果是，遍历数组
    imageUrls = item.images.map((img) =>
      // 判断数组项是字符串还是对象，并相应地构建 URL
      typeof img === "string" ? img : `${BASE_IMAGE_URL}${img.image_path}`
    );
    // 否则，检查 item.image 是否存在 (处理单个图片的情况)
  } else if (item.image) {
    // 如果是，将其构造成一个单元素的数组
    imageUrls = [`${BASE_IMAGE_URL}${item.image}`];
  }

  // 如果经过上述处理后 imageUrls 数组仍然为空，则返回包含默认图片的数组
  // 否则，返回提取到的图片 URL 数组
  return imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE_URL];
};

/**
 * 将从 API 获取的原始产品数据转换为用于 UI 的干净、结构化的对象。
 * @param {object} apiProduct - 来自 API 的原始产品数据。
 * @returns {object} 一个格式化后的产品对象。
 */
const formatProductData = (apiProduct) => {
  // 检查传入的 API 产品数据是否有效，如果无效则抛出错误
  if (!apiProduct || typeof apiProduct !== "object") {
    // 抛出一个错误，指明从服务器接收到的产品数据无效
    throw new Error("Invalid product data received from server");
  }

  // 返回一个结构清晰的对象，包含所有需要展示在 UI 上的数据
  return {
    id: apiProduct.id || 0, // 产品 ID，如果不存在则默认为 0
    name: apiProduct.name || "Unnamed Product", // 产品名称，如果不存在则为 "Unnamed Product"
    description: apiProduct.description || "No description available.", // 产品短描述
    // 产品长描述，优先使用 long_description，其次是 description
    longDescription:
      apiProduct.long_description ||
      apiProduct.description ||
      "No detailed description available.",
    price: parseFloat(apiProduct.price) || 0, // 产品原价，转换为浮点数
    discountPrice: apiProduct.discount_price // 产品折扣价，如果存在则转换为浮点数
      ? parseFloat(apiProduct.discount_price)
      : 0,
    category: {
      // 产品分类信息
      id: apiProduct.category?.id || 0, // 分类 ID，使用可选链操作符 ?. 安全地访问嵌套属性
      name: apiProduct.category?.name || "Uncategorized", // 分类名称
    },
    rating: parseInt(apiProduct.rating, 10) || 0, // 产品评分，转换为整数
    // 评论数量，兼容多种可能的字段
    reviewCount: apiProduct.reviews_count || apiProduct.reviews?.length || 0,
    images: extractImageUrls(apiProduct), // 使用辅助函数提取产品图片
    colors: Array.isArray(apiProduct.colors) ? apiProduct.colors : [], // 产品颜色选项，确保是数组
    sizes: Array.isArray(apiProduct.sizes) ? apiProduct.sizes : [], // 产品尺寸选项，确保是数组
    inStock: !!apiProduct.is_active, // 库存状态，使用 !! 转换为布尔值
    featured: !!apiProduct.featured, // 是否为特色产品，转换为布尔值
    specifications: Array.isArray(apiProduct.specifications) // 产品规格
      ? apiProduct.specifications.map((spec) => ({
          name: spec.name || "Unknown", // 规格名称
          value: spec.value || "N/A", // 规格值
        }))
      : [],
    reviews: Array.isArray(apiProduct.reviews) // 产品评论
      ? apiProduct.reviews.map((review) => ({
          id: review.id || Math.random(), // 评论 ID，若不存在则生成随机数作为备用 key
          user: review.user?.name || review.user || "Anonymous", // 评论用户名
          rating: parseInt(review.rating, 10) || 0, // 评论评分
          date: review.created_at // 评论日期，格式化为本地日期字符串
            ? new Date(review.created_at).toLocaleDateString()
            : "N/A",
          comment: review.comment || "", // 评论内容
        }))
      : [],
    // 相关产品列表，优化了图片提取逻辑
    relatedProducts: Array.isArray(apiProduct.related_products)
      ? apiProduct.related_products.map((rp) => {
          // 优化点：只调用一次 extractImageUrls 函数，避免重复计算
          const relatedImageUrls = extractImageUrls(rp);
          // 返回格式化后的相关产品对象
          return {
            id: rp.id || 0, // 相关产品 ID
            name: rp.name || "Related Product", // 相关产品名称
            price: parseFloat(rp.price) || 0, // 相关产品价格
            imageUrls: relatedImageUrls, // 使用已提取的图片 URL 数组
            imageUrl: relatedImageUrls[0], // 从已提取的数组中获取第一张图片作为主图
            category: {
              // 相关产品分类信息
              id: rp.category?.id || 0, // 分类 ID
              name: rp.category?.name || "Uncategorized", // 分类名称
            },
            rating: parseInt(rp.rating, 10) || 0, // 相关产品评分
            inStock: !!rp.is_active, // 相关产品库存状态
          };
        })
      : [],
  };
};

// --- React 组件 ---
const ProductDetailPage = () => {
  // 使用 useParams 钩子从 URL 中获取产品 ID
  const { id } = useParams();
  // 定义产品数据的状态，初始为 null
  const [product, setProduct] = useState(null);
  // 定义页面加载状态，初始为 true
  const [loading, setLoading] = useState(true);
  // 定义错误信息的状态，初始为 null
  const [error, setError] = useState(null);
  // 定义当前选中的主图索引，初始为 0
  const [selectedImage, setSelectedImage] = useState(0);
  // 定义购买数量的状态，初始为 1
  const [quantity, setQuantity] = useState(1);
  // 定义当前激活的标签页（描述、规格、评论），初始为 'description'
  const [activeTab, setActiveTab] = useState("description");
  // 定义选中的颜色状态，初始为 null
  const [selectedColor, setSelectedColor] = useState(null);
  // 定义选中的尺寸状态，初始为 null
  const [selectedSize, setSelectedSize] = useState(null);
  // 定义用户 ID 状态，初始为 null
  const [userId, setUserId] = useState(null);
  // 处理“添加到购物车”的加载状态，用于显示进度条
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // 用于显示提示消息（Toast）的状态
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // 显示 Toast 的辅助函数
  const showToast = (message, type = "success") => {
    // 设置 Toast 的状态使其可见，并传入消息和类型
    setToast({ show: true, message, type });
    // 设置一个定时器，在3秒后自动隐藏 Toast
    setTimeout(() => {
      // 3秒后更新状态以隐藏 Toast
      setToast({ show: false, message: "", type });
    }, 3000);
  };

  // 使用 useEffect 钩子在组件挂载时从 localStorage 获取用户 ID
  useEffect(() => {
    // 从 localStorage 中读取 'userId'
    const storedUserId = localStorage.getItem("userId");
    // 更新 userId 状态
    setUserId(storedUserId);
  }, []); // 空依赖数组表示此 effect 仅在组件首次挂载时运行一次

  // 定义图片加载失败时的处理函数
  const handleImageError = (e) => {
    // 将出错的图片源替换为默认图片 URL
    e.target.src = DEFAULT_IMAGE_URL;
  };

  // 增加购买数量的函数
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  // 减少购买数量的函数，不允许数量小于 1
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // 使用 useCallback 钩子包裹异步获取产品数据的函数，以避免不必要的重渲染
  const fetchProduct = useCallback(async () => {
    // 开始获取数据，设置加载状态为 true
    setLoading(true);
    // 清空之前的错误信息
    setError(null);
    try {
      // 发送 GET 请求到 API 获取指定 ID 的产品数据
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      // 从响应中提取产品数据，兼容两种可能的响应结构
      const rawData = response.data.success
        ? response.data.product
        : response.data;

      // 使用辅助函数格式化原始数据
      const formattedProduct = formatProductData(rawData);
      // 更新产品状态
      setProduct(formattedProduct);

      // 如果产品有颜色选项，默认选中第一个
      if (formattedProduct.colors.length > 0) {
        // 设置默认选中的颜色
        setSelectedColor(formattedProduct.colors[0]);
      }
      // 如果产品有尺寸选项，默认选中第一个
      if (formattedProduct.sizes.length > 0) {
        // 设置默认选中的尺寸
        setSelectedSize(formattedProduct.sizes[0]);
      }
    } catch (err) {
      // 捕获请求过程中的任何错误
      // 如果是 404 错误，设置特定的错误信息
      if (err.response?.status === 404) {
        // 设置产品未找到的错误信息
        setError("Product not found.");
      } else {
        // 对于其他错误，显示通用错误信息
        setError(
          err.message ||
            "Failed to load product details. Please try again later."
        );
      }
      // 将产品数据设为 null
      setProduct(null);
    } finally {
      // 无论成功或失败，最后都将加载状态设置为 false
      setLoading(false);
    }
  }, [id]); // 依赖数组中包含 id，当 id 变化时会重新执行此函数

  // 使用 useEffect 钩子来调用 fetchProduct 函数
  useEffect(() => {
    // 调用获取产品数据的函数
    fetchProduct();
  }, [fetchProduct]); // 依赖于 fetchProduct 函数，确保在函数引用变化时重新获取数据

  // 添加产品到购物车的异步函数
  const addToCart = async () => {
    // 从 localStorage 获取认证 token
    const token = localStorage.getItem("token");

    // 检查用户是否登录（通过 userId 和 token 判断）
    if (!userId || !token) {
      // 如果未登录，显示错误提示
      showToast(
        "You need to be logged in to add products to the cart.",
        "error"
      );
      // 终止函数执行
      return;
    }

    // 检查产品数据是否存在
    if (!product) {
      // 如果不存在，显示错误提示
      showToast("Product information is missing.", "error");
      // 终止函数执行
      return;
    }

    // 开始添加到购物车，设置加载状态为 true，显示进度条
    setIsAddingToCart(true);

    // 构建要发送到后端的 payload（数据负载）
    const payload = {
      user_id: parseInt(userId, 10), // 将用户 ID 转换为整数
      product_id: product.id, // 产品 ID
      quantity: quantity, // 购买数量
      price: product.discountPrice || product.price, // 价格，优先使用折扣价
      name: product.name, // 产品名称
      image: product.images[0], // 产品图片，使用第一张
      category_id: product.category.id, // 产品分类 ID
    };

    try {
      // 发送 POST 请求到购物车 API
      const response = await axios.post(
        `${API_BASE_URL}/cart/product`, // 请求 URL
        payload, // 请求体数据
        {
          // 请求头配置
          headers: {
            Authorization: `Bearer ${token}`, // 设置认证 token
            "Content-Type": "application/json", // 设置内容类型
            Accept: "application/json", // 希望接收 JSON 格式的响应
          },
        }
      );

      // 检查后端返回的 success 字段
      if (response.data.success) {
        // 如果成功，显示成功消息
        showToast(response.data.message, "success");
      } else {
        // 如果失败，显示失败消息
        showToast(
          "Failed to add product to cart: " + response.data.message,
          "error"
        );
      }
    } catch (err) {
      // 捕获请求中的错误
      // 如果有响应错误（例如 4xx, 5xx）
      if (err.response) {
        // 解构出状态码和响应数据
        const { status, data } = err.response;
        // 如果是 422 验证错误
        if (status === 422 && data.errors) {
          // 将所有验证错误信息合并成一个字符串
          const errorMessages = Object.values(data.errors).flat().join("\n");
          // 显示验证失败的提示
          showToast(`Validation failed: ${errorMessages}`, "error");
          // 如果是 401 未授权错误
        } else if (status === 401) {
          // 显示会话过期的提示
          showToast("Session expired. Please login again.", "error");
          // 清除本地存储的用户信息
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          // 重置组件内的 userId 状态
          setUserId(null);
        } else {
          // 对于其他服务器错误，显示后端返回的错误信息
          showToast(
            `Failed to add product: ${data.message || "Server error"}`,
            "error"
          );
        }
        // 如果是请求错误（例如网络问题）
      } else if (err.request) {
        // 提示网络错误
        showToast("Network error. Please check your connection.", "error");
      } else {
        // 对于其他类型的错误（例如代码执行错误）
        showToast("An unexpected error occurred: " + err.message, "error");
      }
    } finally {
      // 无论成功或失败，最后都将加载状态设置为 false，隐藏进度条
      setIsAddingToCart(false);
    }
  };

  // 生成产品 SKU (库存量单位) 的函数
  const generateSKU = () => {
    // 检查产品或产品 ID 是否存在
    if (!product || !product.id) return "PRD-0000"; // 如果不存在，返回默认值
    // 返回格式化的 SKU 字符串，ID 部分用 0 补足 4 位
    return `PRD-${String(product.id).padStart(4, "0")}`;
  };

  // --- 渲染逻辑 ---
  // 如果正在加载中，显示加载动画
  if (loading) {
    return (
      // 加载状态的容器
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          {/* 旋转的加载指示器 */}
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          {/* 加载文本 */}
          <div className="text-lg font-medium text-gray-700">
            Loading product details...
          </div>
        </div>
      </div>
    );
  }

  // 如果出现错误，显示错误信息页面
  if (error) {
    return (
      // 错误状态的容器
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md w-full mx-4">
          {/* 警告图标 */}
          <div className="text-5xl mb-4 text-red-500">⚠️</div>
          {/* 错误标题 */}
          <div className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Product
          </div>
          {/* 具体的错误信息 */}
          <div className="text-gray-600 mb-6">{error}</div>
          {/* 返回产品列表页的链接 */}
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // 如果加载完成但没有产品数据（例如，无效的 ID），显示“未找到”页面
  if (!product) {
    return (
      // 产品未找到状态的容器
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4">
          {/* 搜索图标 */}
          <div className="text-5xl mb-4 text-gray-500">🔍</div>
          {/* 提示标题 */}
          <div className="text-xl font-semibold text-gray-800 mb-4">
            Product Not Found
          </div>
          {/* 提示信息 */}
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          {/* 返回产品列表页的链接 */}
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // 主渲染逻辑：显示产品详情
  return (
    // 页面根容器，带有渐变背景
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 注入自定义 CSS 动画。在真实项目中，这通常放在一个单独的 .css 文件中。 */}
      <style>
        {`
          /* 定义进度条的左右移动动画 */
          @keyframes progress-animation {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          /* 定义 Toast 从右侧滑入的动画 */
          @keyframes slide-in-from-right {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          /* 将动画应用到类名 */
          .animate-progress {
            animation: progress-animation 1.5s linear infinite;
          }
          .animate-slide-in {
            animation: slide-in-from-right 0.5s ease-out forwards;
          }
        `}
      </style>

      {/* 进度条，仅在 isAddingToCart 为 true 时显示 */}
      {isAddingToCart && (
        // 进度条容器，固定在页面顶部
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-200 z-50 overflow-hidden">
          {/* 实际的移动条，使用自定义动画 */}
          <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 animate-progress"></div>
        </div>
      )}

      {/* Toast 提示框，仅在 toast.show 为 true 时显示 */}
      {toast.show && (
        // Toast 容器，固定在页面右上角
        <div
          className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-transform transform ${
            // 根据 Toast 类型（success/error）应用不同背景色
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } animate-slide-in`}
        >
          {/* Toast 消息文本 */}
          <span>{toast.message}</span>
          {/* 关闭按钮 */}
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 text-xl font-bold hover:opacity-75 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 登录状态提示信息容器 */}
      <div className="container mx-auto px-4 py-4">
        {/* 提示框 */}
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          {/* 根据 userId 是否存在显示不同的登录状态信息 */}
          <p className="text-blue-800 font-medium">
            {userId ? "You are logged in." : "You are not logged in."}
          </p>
        </div>
      </div>

      {/* 面包屑导航区域 */}
      <section className="py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* 导航元素 */}
          <nav className="flex" aria-label="Breadcrumb">
            {/* 有序列表作为面包屑 */}
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              {/* "Home" 链接 */}
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center cursor-pointer"
                >
                  {/* Home 图标 */}
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Home
                </Link>
              </li>
              {/* "Products" 链接 */}
              <li>
                <div className="flex items-center">
                  {/* 分隔符图标 */}
                  <svg
                    className="w-4 h-4 text-gray-300 mx-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <Link
                    to="/products"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    Products
                  </Link>
                </div>
              </li>
              {/* 当前产品名称 */}
              <li aria-current="page">
                <div className="flex items-center">
                  {/* 分隔符图标 */}
                  <svg
                    className="w-4 h-4 text-gray-300 mx-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {/* 当前页面，显示产品名称，并做截断处理防止过长 */}
                  <span className="text-sm text-blue-600 font-medium truncate max-w-xs">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* 产品主信息区域 */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* 采用网格布局，大屏幕上两列 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* 左侧：产品图片展示区，使用动画组件 */}
            <AnimatedSection direction="left" className="space-y-6">
              {/* 主图片容器 */}
              <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:ring-2 hover:ring-blue-100">
                {/* 主图片，显示当前选中的图片 */}
                <img
                  src={product.images[selectedImage]}
                  alt={`${product.name} - Main`}
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={handleImageError} // 设置图片加载失败的回调
                />
                {/* 悬停时的渐变遮罩层 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* 悬停时右上角显示的放大镜图标 */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* 如果产品图片多于一张，则显示缩略图 */}
              {product.images.length > 1 && (
                // 缩略图网格容器
                <div className="grid grid-cols-4 gap-3">
                  {/* 遍历图片数组，生成缩略图 */}
                  {product.images.map((image, index) => (
                    // 每个缩略图的容器
                    <div
                      key={index} // 设置唯一的 key
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                        // 根据是否被选中，应用不同的样式
                        selectedImage === index
                          ? "border-blue-500 shadow-md ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedImage(index)} // 点击时更新选中的图片索引
                    >
                      {/* 缩略图图片 */}
                      <img
                        src={image}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-16 lg:h-20 object-cover"
                        onError={handleImageError} // 同样处理加载失败
                      />
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>

            {/* 右侧：产品详细信息和操作区，使用动画组件 */}
            <AnimatedSection
              direction="right"
              className="space-y-6 lg:space-y-8"
            >
              {/* 信息卡片容器 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 ring-1 ring-blue-200 ring-opacity-50">
                {/* 信息内容容器 */}
                <div className="space-y-4">
                  {/* 顶部标签行 */}
                  <div className="flex items-center justify-between">
                    {/* 分类标签 */}
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {product.category.name}
                    </span>
                    {/* 如果是特色产品，显示特色标签 */}
                    {product.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* 产品主标题 */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* 评分、评论数和 SKU */}
                  <div className="flex items-center space-x-4">
                    {/* 评分部分 */}
                    <div className="flex items-center">
                      {/* 星星评分 */}
                      <div className="flex text-yellow-400 mr-2">
                        {/* 遍历生成5个星星 */}
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i} // key
                            className={`w-4 h-4 ${
                              // 根据评分点亮星星
                              i < product.rating
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      {/* 评分和评论数文本 */}
                      <span className="text-sm text-gray-600">
                        {product.rating}/5 ({product.reviewCount} reviews)
                      </span>
                    </div>
                    {/* 分隔线 */}
                    <div className="h-4 w-px bg-gray-300"></div>
                    {/* SKU 信息 */}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">SKU:</span> {generateSKU()}
                    </div>
                  </div>

                  {/* 价格区域 */}
                  <div className="flex items-baseline space-x-3 mt-2">
                    {/* 如果有折扣价，显示折扣价、原价和折扣率 */}
                    {product.discountPrice > 0 ? (
                      <>
                        {/* 折扣价 */}
                        <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        {/* 原价（带删除线） */}
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                        {/* 折扣百分比标签 */}
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">
                          {Math.round(
                            ((product.price - product.discountPrice) /
                              product.price) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    ) : (
                      // 如果没有折扣价，只显示原价
                      <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* 产品短描述 */}
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-3">
                    {product.description}
                  </p>
                </div>

                {/* 选项和操作区域 */}
                <div className="space-y-6 mt-6">
                  {/* 如果有颜色选项，则显示 */}
                  {product.colors.length > 0 && (
                    <div>
                      {/* 颜色标题 */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Color
                      </h3>
                      {/* 颜色按钮容器 */}
                      <div className="flex flex-wrap gap-2">
                        {/* 遍历颜色数组生成按钮 */}
                        {product.colors.map((color, index) => (
                          <button
                            key={index} // key
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none cursor-pointer ${
                              // 根据是否选中应用不同样式
                              selectedColor === color
                                ? "bg-blue-600 text-white border border-blue-700 shadow-md ring-2 ring-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:ring-1 hover:ring-blue-200"
                            }`}
                            onClick={() => setSelectedColor(color)} // 点击时更新选中的颜色
                          >
                            {color.name || color} {/* 显示颜色名称或值 */}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 如果有尺寸选项，则显示 */}
                  {product.sizes.length > 0 && (
                    <div>
                      {/* 尺寸标题 */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Size
                      </h3>
                      {/* 尺寸按钮容器 */}
                      <div className="flex flex-wrap gap-2">
                        {/* 遍历尺寸数组生成按钮 */}
                        {product.sizes.map((size, index) => (
                          <button
                            key={index} // key
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none cursor-pointer ${
                              // 根据是否选中应用不同样式
                              selectedSize === size
                                ? "bg-blue-600 text-white border border-blue-700 shadow-md ring-2 ring-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:ring-1 hover:ring-blue-200"
                            }`}
                            onClick={() => setSelectedSize(size)} // 点击时更新选中的尺寸
                          >
                            {size.name || size} {/* 显示尺寸名称或值 */}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 数量选择器 */}
                  <div className="flex items-center justify-between">
                    {/* 数量标题 */}
                    <h3 className="text-sm font-semibold text-gray-900">
                      Quantity
                    </h3>
                    {/* 数量控制组件 */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1 w-fit shadow-sm">
                      {/* 减少数量按钮 */}
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center cursor-pointer"
                        aria-label="Decrease quantity" // 无障碍标签
                      >
                        {/* 减号图标 */}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          ></path>
                        </svg>
                      </button>
                      {/* 显示当前数量 */}
                      <div className="w-12 text-center text-sm font-medium bg-blue-50 rounded mx-1 py-1.5 border border-blue-100">
                        {quantity}
                      </div>
                      {/* 增加数量按钮 */}
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center cursor-pointer"
                        aria-label="Increase quantity" // 无障碍标签
                      >
                        {/* 加号图标 */}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 操作按钮组 */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {/* 添加到购物车按钮 */}
                    <button
                      onClick={addToCart} // 点击时调用 addToCart 函数
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center cursor-pointer ${
                        // 如果缺货或正在添加，则添加禁用样式
                        (!product.inStock || isAddingToCart) &&
                        "opacity-50 cursor-not-allowed hover:scale-100"
                      }`}
                      disabled={!product.inStock || isAddingToCart} // 如果缺货或正在添加，禁用按钮
                    >
                      {/* 购物车图标 */}
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      {/* 根据库存和加载状态显示不同文本 */}
                      {isAddingToCart
                        ? "Adding..."
                        : product.inStock
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                    {/* 添加到心愿单按钮 */}
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] transform flex items-center justify-center cursor-pointer">
                      {/* 心形图标 */}
                      <svg
                        className="w-5 h-5 mr-2 text-pink-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                      Wishlist
                    </button>
                  </div>

                  {/* 库存状态显示条 */}
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4 shadow-sm ring-1 ring-blue-200 ring-opacity-50">
                    <div className="flex items-center">
                      {/* 根据库存状态显示不同颜色的圆点 */}
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          product.inStock ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      {/* 根据库存状态显示不同颜色和内容的文本 */}
                      <span
                        className={`text-sm font-medium ${
                          product.inStock ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 描述、规格、评论标签页区域 */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* 标签页卡片容器 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:ring-1 hover:ring-blue-100">
            {/* 标签页头部 */}
            <div className="flex flex-wrap border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              {/* 遍历生成标签页按钮 */}
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab} // key
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                    // 根据是否为当前激活标签页应用不同样式
                    activeTab === tab
                      ? "text-blue-700 bg-white"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveTab(tab)} // 点击时切换激活的标签页
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}{" "}
                  {/* 将标签名首字母大写 */}
                  {tab === "reviews" && ` (${product.reviews.length})`}{" "}
                  {/* 如果是评论标签，显示评论数量 */}
                  {/* 如果是当前激活的标签，显示下方的指示条 */}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>

            {/* 标签页内容区域 */}
            <div className="p-6 lg:p-8">
              {/* 如果当前是 "description" 标签页 */}
              {activeTab === "description" && (
                <AnimatedSection>
                  {/* 使用 prose 插件美化排版 */}
                  <div className="prose max-w-none">
                    <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50">
                      {/* 标题 */}
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Product Overview
                      </h3>
                      {/* 长描述，按换行符分割成段落 */}
                      {product.longDescription
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <p
                            key={index}
                            className="mb-3 text-gray-700 text-sm lg:text-base leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {/* 如果当前是 "specifications" 标签页 */}
              {activeTab === "specifications" && (
                <AnimatedSection>
                  {/* 如果有规格数据 */}
                  {product.specifications.length > 0 ? (
                    // 使用网格布局显示规格
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 遍历规格数组 */}
                      {product.specifications.map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50"
                        >
                          {/* 规格名称 */}
                          <span className="font-medium text-gray-900 text-sm">
                            {spec.name}
                          </span>
                          {/* 规格值 */}
                          <span className="text-blue-700 font-medium text-sm">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // 如果没有规格数据，显示提示信息
                    <div className="text-center py-8">
                      {/* 图标 */}
                      <div className="text-gray-400 mb-2">
                        <svg
                          className="w-12 h-12 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          ></path>
                        </svg>
                      </div>
                      {/* 提示文本 */}
                      <p className="text-gray-500">
                        No specifications available for this product.
                      </p>
                    </div>
                  )}
                </AnimatedSection>
              )}

              {/* 如果当前是 "reviews" 标签页 */}
              {activeTab === "reviews" && (
                <AnimatedSection>
                  <div className="space-y-6">
                    {/* 如果有评论数据 */}
                    {product.reviews.length > 0 ? (
                      // 遍历评论数组显示每一条评论
                      product.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-6 last:border-b-0 last:pb-0 bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50"
                        >
                          {/* 评论头部 */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              {/* 用户头像（使用首字母） */}
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white font-medium text-sm">
                                  {review.user.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {/* 用户名和评分 */}
                              <div>
                                <h3 className="font-semibold text-gray-900 text-sm">
                                  {review.user}
                                </h3>
                                <div className="flex items-center space-x-2">
                                  {/* 星星评分 */}
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? "text-yellow-400"
                                            : "text-gray-200"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                  {/* 评论日期 */}
                                  <span className="text-xs text-gray-500">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* 评论内容 */}
                          <p className="text-gray-700 text-sm leading-relaxed ml-13">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      // 如果没有评论数据，显示提示信息
                      <div className="text-center py-8">
                        {/* 图标 */}
                        <div className="text-gray-400 mb-2">
                          <svg
                            className="w-12 h-12 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            ></path>
                          </svg>
                        </div>
                        {/* 提示文本 */}
                        <p className="text-gray-500 mb-4">
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    )}
                    {/* 发表评论的表单区域 */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      {/* 标题 */}
                      <h3 className="text-lg font-semibold mb-6 text-gray-900">
                        Write a Review
                      </h3>
                      {/* 表单 */}
                      <form className="space-y-6">
                        {/* 评分输入 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex space-x-1">
                            {/* 5个星星按钮 */}
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="text-2xl focus:outline-none transition-colors duration-200 text-gray-300 hover:text-yellow-400 cursor-pointer"
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        {/* 评论内容输入 */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ring-1 ring-blue-200 ring-opacity-50"
                            placeholder="Share your experience with this product..."
                          ></textarea>
                        </div>
                        {/* 提交按钮 */}
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform cursor-pointer"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 如果有相关产品数据，则显示相关产品区域 */}
      {product.relatedProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            {/* 区域标题和“查看全部”链接 */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Products
              </h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
              >
                View All
                {/* 箭头图标 */}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>
            {/* 相关产品网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 遍历相关产品数组，最多显示4个 */}
              {product.relatedProducts.slice(0, 4).map((relatedProduct) => (
                // 使用 Card 组件来显示每个相关产品
                <Card
                  key={relatedProduct.id} // key
                  imageUrls={relatedProduct.imageUrls} // 图片 URL
                  title={relatedProduct.name} // 标题
                  price={relatedProduct.price} // 价格
                  category={relatedProduct.category.name} // 分类
                  rating={relatedProduct.rating} // 评分
                  footer={
                    // 自定义卡片底部内容
                    <div className="flex justify-between items-center">
                      {/* 库存状态标签 */}
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          relatedProduct.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {relatedProduct.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      {/* 查看详情按钮 */}
                      <Link
                        to={`/products/${relatedProduct.id}`}
                        className="px-3 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs md:text-sm inline-block text-center cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

// 导出组件，使其可以在其他地方被导入和使用
export default ProductDetailPage;
