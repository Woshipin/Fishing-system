// 导入 React 核心库以及常用的钩子（hooks）: useState, useEffect, useRef
import React, { useState, useEffect, useRef } from "react";
// 导入 framer-motion 库，用于实现丰富的动画效果
import { motion, AnimatePresence } from "framer-motion";
// 导入 react-router-dom 的 useParams 钩子，用于从 URL 中获取动态参数
import { useParams } from "react-router-dom";

// 定义一个默认的备用图片URL，当图片加载失败或不存在时使用
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

// 定义套餐详情页面组件
const PackageDetailPage = () => {
  // 从URL中获取动态参数 'id'
  const { id } = useParams();
  // 定义状态（state）来存储套餐的详细数据
  const [packageData, setPackageData] = useState(null);
  // 定义加载状态，初始为 true，表示正在获取数据
  const [loading, setLoading] = useState(true);
  // 定义错误状态，用于存储数据获取过程中发生的错误信息
  const [error, setError] = useState(null);
  // 定义“添加到购物车”的进行状态，防止用户重复点击
  const [addingToCart, setAddingToCart] = useState(false);
  // 定义当前选中的主图索引，用于图片库切换
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // 定义用户ID的状态，用于后续的API请求
  const [userId, setUserId] = useState(null);
  // 状态：用于显示自定义的提示消息 (Toast)
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

  // 使用 useEffect 钩子，在组件挂载后从 localStorage 获取用户ID
  useEffect(() => {
    // 从 localStorage 读取 "userId"
    const storedUserId = localStorage.getItem("userId");
    // 更新 userId 状态
    setUserId(storedUserId);
    // 在控制台打印用户ID，方便调试
    console.log("User ID:", storedUserId);
  }, []); // 空依赖数组表示此 effect 只在组件首次渲染时运行一次

  // 定义一个辅助函数，用于将相对图片路径转换为完整的、可访问的URL
  const getImageUrl = (imagePath) => {
    // 如果路径为空、null或undefined，发出警告并返回默认图片URL
    if (!imagePath) {
      console.warn(
        "Image path is null or empty, using default fallback image."
      );
      return DEFAULT_IMAGE_URL;
    }

    // 如果路径已经是完整的URL，直接返回
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // 如果路径以 "/storage" 开头 (例如: /storage/images/...)
    if (imagePath.startsWith("/storage")) {
      // 拼接基础URL和路径
      return `http://127.0.0.1:8000${imagePath}`;
    }

    // 如果路径以 "storage" 开头 (例如: storage/images/...)
    if (imagePath.startsWith("storage")) {
      // 拼接基础URL和路径，并添加斜杠
      return `http://127.0.0.1:8000/${imagePath}`;
    }

    // 对于其他相对路径，默认添加 "/storage/" 前缀
    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  // 使用 useEffect 钩子，当 'id' 发生变化时，获取套餐详情数据
  useEffect(() => {
    // 定义一个异步函数来执行数据获取操作
    const fetchPackageDetail = async () => {
      try {
        // 开始获取数据，设置加载状态为 true
        setLoading(true);
        // 清空之前的错误信息
        setError(null);

        // 发起 GET 请求到后端API以获取特定ID的套餐数据
        const response = await fetch(
          `http://127.0.0.1:8000/api/packages/${id}`,
          {
            method: "GET", // 请求方法
            headers: {
              // 请求头
              Accept: "application/json", // 期望接收JSON格式的响应
              "Content-Type": "application/json", // 发送内容类型
            },
          }
        );

        // 如果响应状态码不是 2xx (表示请求不成功)
        if (!response.ok) {
          // 抛出一个错误，中断后续执行
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 将响应体解析为JSON格式
        const data = await response.json();
        // 在控制台打印获取到的原始数据，方便调试
        console.log("Fetched package data:", data);

        // -- 图片URL处理优化 --
        // 统一处理套餐主图和产品图片的URL
        const processImages = (item) => {
          let imageUrls = []; // 初始化一个空数组来存放处理后的图片URL
          // 检查 item 是否有 imageUrls 数组
          if (
            item.imageUrls &&
            Array.isArray(item.imageUrls) &&
            item.imageUrls.length > 0
          ) {
            imageUrls = item.imageUrls;
            // 否则，检查是否有 image_url 字段
          } else if (item.image_url) {
            imageUrls = [item.image_url];
            // 否则，检查是否有 image 字段
          } else if (item.image) {
            imageUrls = [item.image];
          }
          // 使用 getImageUrl 函数处理每个URL，并过滤掉无效的结果
          const processedUrls = imageUrls.map(getImageUrl).filter(Boolean);
          // 返回带有处理后 imageUrls 的新对象
          return {
            ...item,
            imageUrls:
              processedUrls.length > 0 ? processedUrls : [DEFAULT_IMAGE_URL],
          };
        };

        // 处理套餐本身的主图
        const processedPackage = processImages(data);

        // 如果套餐包含产品，则遍历并处理每个产品的图片
        if (
          processedPackage.products &&
          Array.isArray(processedPackage.products)
        ) {
          processedPackage.products =
            processedPackage.products.map(processImages);
        }

        // 更新状态，将处理后的完整数据存入 packageData
        setPackageData(processedPackage);
      } catch (err) {
        // 捕获数据获取过程中的任何错误
        // 在控制台打印错误详情
        console.error("Error fetching package details:", err);
        // 设置错误信息，用于在UI上显示给用户
        setError("Failed to fetch package details. Please try again.");
      } finally {
        // 无论成功还是失败，最后都会执行
        // 数据获取流程结束，设置加载状态为 false
        setLoading(false);
      }
    };

    // 只有当 'id' 存在时，才调用 fetchPackageDetail 函数
    if (id) {
      fetchPackageDetail();
    }
  }, [id]); // 依赖数组中包含 'id'，当 'id' 变化时会重新运行此 effect

  // 定义处理“添加到购物车”的异步函数
  const handleAddToCart = async () => {
    // 如果套餐无货或用户未登录，则显示错误通知并返回
    if (!packageData?.inStock || !userId) {
      showToast(
        "You need to be logged in and the package must be in stock.",
        "error"
      );
      return;
    }

    // 设置正在添加的状态为 true，以禁用按钮并显示进度条
    setAddingToCart(true);
    try {
      // 准备要发送到后端API的数据载荷（payload）
      const payload = {
        user_id: userId, // 用户ID
        package_id: packageData.id, // 套餐ID
        name: packageData.title, // 套餐标题
        image: packageData.imageUrls[0], // 套餐主图
        category_id: packageData.category_id, // 套餐分类ID
        quantity: 1, // 数量，默认为1
        price: parseFloat(packageData.price), // 价格，转换为浮点数
        features: packageData.features || [], // 套餐特点
      };

      // 在控制台打印将要发送的数据，方便调试
      console.log("Add to Cart Data:", payload);

      // 发起 POST 请求到后端的购物车API
      const response = await fetch("http://127.0.0.1:8000/api/cart/package", {
        method: "POST", // 请求方法
        headers: {
          // 请求头
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload), // 将JS对象转换为JSON字符串作为请求体
      });

      // 如果响应成功
      if (response.ok) {
        // 显示成功的通知
        showToast("Package added to cart!", "success");
      } else {
        // 如果响应失败
        // 解析错误响应体
        const errorData = await response.json();
        // 在控制台打印错误信息
        console.error("Failed to add to cart:", errorData);
        // 显示失败的通知，内容为后端返回的错误消息或默认消息
        showToast(
          errorData.message || "Failed to add package. Please try again.",
          "error"
        );
      }
    } catch (err) {
      // 捕获请求过程中的网络错误等
      console.error("Error adding to cart:", err);
      // 显示通用的错误通知
      showToast("An error occurred. Please try again.", "error");
    } finally {
      // 无论成功还是失败，最后都会执行
      // 请求结束，重置“正在添加”状态为 false
      setAddingToCart(false);
    }
  };

  // 定义一个函数，用于根据评分渲染星级显示
  const renderStars = (rating) => {
    // 计算满星的数量
    const fullStars = Math.floor(rating);
    // 判断是否有半星
    const hasHalfStar = rating % 1 !== 0;

    // 创建一个长度为5的数组并遍历，生成5个星标
    return Array(5)
      .fill(0)
      .map((_, index) => {
        // 默认星标颜色为灰色
        let starClass = "text-gray-300";
        // 如果当前索引小于满星数，设为高亮色
        if (index < fullStars) {
          starClass = "text-amber-400";
          // 如果当前索引等于满星数且有半星，也设为高亮色 (这里用半星符号)
        } else if (index === fullStars && hasHalfStar) {
          starClass = "text-amber-400";
        }

        // 返回一个 span 元素代表星标
        return (
          <span
            key={index} // 唯一的key
            className={`text-lg ${starClass}`} // 应用计算出的样式类
            style={{
              // 内联样式，用于添加发光效果
              filter:
                index < fullStars || (index === fullStars && hasHalfStar)
                  ? "drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))"
                  : "none",
              textShadow:
                index < fullStars || (index === fullStars && hasHalfStar)
                  ? "0 0 8px rgba(251, 191, 36, 0.5)"
                  : "none",
            }}
          >
            {/* 如果是半星位置，显示空心星，否则显示实心星 */}
            {index === fullStars && hasHalfStar ? "☆" : "★"}
          </span>
        );
      });
  };

  // 定义一个带加载和错误回退功能的图片组件
  const ImageWithFallback = ({ src, alt, className, ...props }) => {
    // 状态：当前图片源
    const [imageSrc, setImageSrc] = useState(src);
    // 状态：是否发生加载错误
    const [hasError, setHasError] = useState(false);
    // 状态：图片是否正在加载中
    const [isLoading, setIsLoading] = useState(true);
    // Ref: 用于存储超时计时器
    const timeoutRef = useRef(null);
    // Ref: 用于跟踪组件是否已挂载
    const isMountedRef = useRef(true);

    // Effect: 当 src 变化时，重置状态并处理图片加载
    useEffect(() => {
      // 标记组件为已挂载
      isMountedRef.current = true;

      // 重置状态
      setImageSrc(src);
      setHasError(false);
      // 只有当 src 有效且不是默认图时，才显示加载动画
      setIsLoading(!!src && src !== DEFAULT_IMAGE_URL);

      // 清除上一个超时计时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // 如果 src 有效，设置一个加载超时 (5秒)
      if (src && src !== DEFAULT_IMAGE_URL) {
        timeoutRef.current = setTimeout(() => {
          // 如果5秒后仍在加载，则标记为错误
          if (isMountedRef.current && isLoading) {
            console.warn("Image load timeout:", src);
            setHasError(true);
            setIsLoading(false);
          }
        }, 5000); // 5秒超时
      }

      // 组件卸载时的清理函数
      return () => {
        isMountedRef.current = false; // 标记为未挂载
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // 清除计时器
        }
      };
    }, [src]); // 依赖于 src

    // 图片加载失败时的处理函数
    const handleImageError = () => {
      if (!isMountedRef.current) return; // 如果组件已卸载，则不执行
      console.log("Image failed to load:", src);
      setHasError(true);
      setIsLoading(false);
    };

    // 图片成功加载时的处理函数
    const handleImageLoad = () => {
      if (!isMountedRef.current) return; // 如果组件已卸载，则不执行
      setIsLoading(false);
      setHasError(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // 清除超时计时器
      }
    };

    // 决定最终显示的图片源：如果出错或源为空，则使用默认图片
    const displaySrc = hasError || !imageSrc ? DEFAULT_IMAGE_URL : imageSrc;

    // 返回组件的 JSX
    return (
      <div className="relative">
        {" "}
        {/* 相对定位容器 */}
        {isLoading && ( // 如果正在加载，则显示加载动画
          <div
            className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0 z-10`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        <img
          src={displaySrc} // 最终显示的图片源
          alt={alt} // 图片的替代文本
          className={`${className} transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100" // 加载时透明，加载后显示
          }`}
          onError={handleImageError} // 绑定错误处理函数
          onLoad={handleImageLoad} // 绑定加载成功处理函数
          loading="lazy" // 启用浏览器原生懒加载
          {...props} // 传递任何其他 props
        />
      </div>
    );
  };

  // 定义按钮的通用渐变背景和阴影样式
  const buttonStyle = {
    background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
    boxShadow:
      "0 8px 32px rgba(59, 130, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
  };

  // 定义卡片和容器的通用“发光”样式
  const glowStyle = {
    boxShadow:
      "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
  };

  // 如果正在加载数据，显示加载界面
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-4">
        {" "}
        {/* 全屏加载容器 */}
        <motion.div
          className="text-center p-8 rounded-3xl bg-white/90 backdrop-blur-xl border shadow-2xl max-w-md w-full" /* 加载卡片样式 */
          style={glowStyle} /* 应用发光样式 */
          initial={{ opacity: 0, scale: 0.9 }} /* 初始动画状态 */
          animate={{ opacity: 1, scale: 1 }} /* 动画结束状态 */
          transition={{ duration: 0.5 }} /* 动画时长 */
        >
          <div className="relative">
            {" "}
            {/* 相对定位容器，用于放置装饰性元素 */}
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6" /* 旋转的加载指示器 */
              style={{
                filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))",
              }} /* 发光效果 */
            ></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-xl animate-pulse"></div>{" "}
            {/* 脉动的背景辉光 */}
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            {" "}
            {/* 加载文本 */}
            Loading package details...
          </p>
        </motion.div>
      </div>
    );
  }

  // 如果发生错误，显示错误界面
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-4">
        {" "}
        {/* 全屏错误容器 */}
        <motion.div
          className="text-center p-8 rounded-3xl bg-white/90 backdrop-blur-xl border shadow-2xl max-w-md w-full" /* 错误卡片样式 */
          style={{
            /* 自定义红色调的发光样式 */ ...glowStyle,
            border: "1px solid rgba(239, 68, 68, 0.4)",
            boxShadow:
              "0 20px 40px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.2)",
          }}
          initial={{ opacity: 0, scale: 0.9 }} /* 初始动画 */
          animate={{ opacity: 1, scale: 1 }} /* 结束动画 */
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div> {/* 错误图标 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Package
          </h2>{" "}
          {/* 错误标题 */}
          <p className="text-gray-600 mb-6">{error}</p>{" "}
          {/* 显示具体的错误信息 */}
          <button
            onClick={() => window.location.reload()} /* 点击时刷新页面 */
            className="px-8 py-3 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:cursor-pointer" /* 按钮样式 */
            style={buttonStyle} /* 应用按钮样式 */
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // 如果没有套餐数据（例如API返回null），则不渲染任何内容
  if (!packageData) return null;

  // 从 packageData 中解构出产品和图片URL，提供默认空数组以防万一
  const products = packageData.products || [];
  const imageUrls = packageData.imageUrls || [];

  // 渲染最终的页面内容
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* 注入自定义 CSS 动画 */}
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

      {/* 进度条，仅在 addingToCart 为 true 时显示 */}
      {addingToCart && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-200 z-50 overflow-hidden">
          <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 animate-progress"></div>
        </div>
      )}

      {/* Toast 提示框，仅在 toast.show 为 true 时显示 */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-transform transform ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } animate-slide-in`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ ...toast, show: false })}
            className="ml-4 text-xl font-bold hover:opacity-75 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* 背景装饰性模糊形状 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* 页面顶部的英雄区域（Header） */}
      <motion.div
        className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-12 md:py-20" /* 样式 */
        style={{
          boxShadow:
            "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1)",
        }} /* 内联样式 */
        initial={{ opacity: 0, y: -50 }} /* 初始动画 */
        animate={{ opacity: 1, y: 0 }} /* 结束动画 */
        transition={{ duration: 0.8 }} /* 动画时长 */
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-cyan-600/50"></div>{" "}
        {/* 叠加层 */}
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          {" "}
          {/* 内容容器 */}
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4" /* 套餐标题 */
            style={{
              textShadow:
                "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.2)",
            }} /* 文字阴影 */
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }} /* 动画 */
          >
            {packageData.title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto" /* 副标题 */
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }} /* 动画 */
          >
            Package Details & Included Products
          </motion.p>
        </div>
      </motion.div>
      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16" /* 布局网格 */
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }} /* 动画 */
        >
          {/* 左侧：图片展示区 */}
          <div className="space-y-4">
            <motion.div
              className="relative rounded-3xl overflow-hidden" /* 主图容器 */
              style={glowStyle} /* 发光样式 */
              whileHover={{ scale: 1.02 }} /* 悬停动画 */
              transition={{ duration: 0.3 }} /* 动画时长 */
            >
              {/* 使用带回退功能的图片组件显示主图 */}
              <ImageWithFallback
                src={imageUrls[selectedImageIndex]} /* 当前选中的图片URL */
                alt={packageData.title} /* 替代文本 */
                className="w-full h-64 md:h-80 lg:h-96 object-cover" /* 尺寸和样式 */
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>{" "}
              {/* 图片上的渐变叠加层 */}
            </motion.div>

            {/* 如果有多张图片，则显示缩略图库 */}
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <motion.button
                    key={index} /* 唯一的key */
                    onClick={() =>
                      setSelectedImageIndex(index)
                    } /* 点击切换主图 */
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:cursor-pointer ${
                      /* 缩略图按钮样式 */
                      selectedImageIndex === index
                        ? "border-blue-400 shadow-lg" /* 选中状态 */
                        : "border-blue-200 hover:border-blue-300" /* 未选中状态 */
                    }`}
                    style={{
                      boxShadow:
                        selectedImageIndex === index
                          ? "0 0 20px rgba(59, 130, 246, 0.5)"
                          : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }} /* 阴影 */
                    whileHover={{ scale: 1.05 }} /* 悬停动画 */
                    whileTap={{ scale: 0.95 }} /* 点击动画 */
                  >
                    <ImageWithFallback
                      src={url}
                      alt={`${packageData.title} ${index + 1}`}
                      className="w-full h-16 md:h-20 object-cover"
                    />{" "}
                    {/* 缩略图 */}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧：套餐详细信息 */}
          <div className="space-y-6">
            <motion.div
              className="rounded-3xl p-6 md:p-8" /* 信息卡片 */
              style={glowStyle} /* 发光样式 */
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }} /* 动画 */
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div
                    className="flex items-center bg-amber-50 px-3 py-2 rounded-xl border border-amber-200"
                    style={{ boxShadow: "0 0 15px rgba(251, 191, 36, 0.3)" }}
                  >
                    {renderStars(packageData.rating)} {/* 渲染星级评分 */}
                    <span className="text-gray-700 ml-2 font-medium">
                      ({packageData.rating}/5)
                    </span>{" "}
                    {/* 显示评分数值 */}
                  </div>
                </div>
                <span
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-xl text-sm font-semibold capitalize border border-blue-200"
                  style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }}
                >
                  {packageData.category} {/* 显示分类 */}
                </span>
              </div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
                {packageData.description}
              </p>{" "}
              {/* 套餐描述 */}
              {packageData.features &&
                packageData.features.length >
                  0 /* 如果有套餐特点，则渲染 */ && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Package Features
                    </h3>{" "}
                    {/* 特点标题 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {packageData.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200" /* 特点项样式 */
                          style={{
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.1)",
                          }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.6 + index * 0.1,
                          }} /* 交错动画 */
                        >
                          <div
                            className="w-2 h-2 bg-blue-600 rounded-full mr-3"
                            style={{
                              boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
                            }}
                          ></div>{" "}
                          {/* 小圆点 */}
                          <span className="font-medium text-gray-900">
                            {feature}
                          </span>{" "}
                          {/* 特点文本 */}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ${parseFloat(packageData.price).toFixed(2)} {/* 现价 */}
                    </span>
                    {packageData.originalPrice &&
                      packageData.originalPrice >
                        packageData.price /* 如果有原价且高于现价 */ && (
                        <span className="text-xl text-gray-500 line-through">
                          ${parseFloat(packageData.originalPrice).toFixed(2)}
                        </span> /* 显示带删除线的原价 */
                      )}
                  </div>
                  {packageData.originalPrice &&
                    packageData.originalPrice >
                      packageData.price /* 如果有折扣 */ && (
                      <span className="text-green-600 font-semibold text-sm">
                        Save $
                        {(
                          parseFloat(packageData.originalPrice) -
                          parseFloat(packageData.price)
                        ).toFixed(2)}{" "}
                        {/* 显示节省的金额 */}
                      </span>
                    )}
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                    /* 库存状态标签 */
                    packageData.inStock
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200" /* 有货样式 */
                      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200" /* 无货样式 */
                  }`}
                  style={{
                    boxShadow: packageData.inStock
                      ? "0 0 20px rgba(34, 197, 94, 0.3)"
                      : "0 0 20px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {packageData.inStock ? "✓ In Stock" : "✗ Out of Stock"}{" "}
                  {/* 显示库存状态文本 */}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* “套餐内含”部分 */}
        <motion.div
          className="rounded-3xl p-6 md:p-10 mb-12"
          style={glowStyle} /* 容器样式 */
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }} /* 动画 */
        >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8 text-center">
            What's Included in This Package ({products.length} Products){" "}
            {/* 标题 */}
          </h2>

          {products.length > 0 /* 如果套餐内有产品 */ ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index /* 遍历产品并渲染卡片 */) => (
                <motion.div
                  key={product.id} /* 唯一的key */
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300" /* 产品卡片样式 */
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(59, 130, 246, 0.15), 0 0 20px rgba(6, 182, 212, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.8 + index * 0.1,
                    duration: 0.6,
                  }} /* 交错动画 */
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 40px rgba(59, 130, 246, 0.25), 0 0 30px rgba(6, 182, 212, 0.2)",
                  }} /* 悬停动画 */
                >
                  <div
                    className="rounded-xl overflow-hidden mb-4 border-2 border-blue-100"
                    style={{ boxShadow: "0 8px 20px rgba(59, 130, 246, 0.15)" }}
                  >
                    <ImageWithFallback
                      src={product.imageUrls[0]}
                      alt={product.name}
                      className="w-full h-32 md:h-40 object-cover transition-transform duration-500 hover:scale-110"
                    />{" "}
                    {/* 产品图片 */}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">
                    {product.name}
                  </h3>{" "}
                  {/* 产品名称 */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>{" "}
                  {/* 产品描述 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 font-bold text-xl">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>{" "}
                    {/* 产品价格 */}
                    <div
                      className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                      style={{ boxShadow: "0 0 10px rgba(251, 191, 36, 0.2)" }}
                    >
                      {renderStars(product.rating)} {/* 产品评分 */}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 font-medium"
                      style={{ boxShadow: "0 0 8px rgba(156, 163, 175, 0.15)" }}
                    >
                      {product.category || "Uncategorized"} {/* 产品分类 */}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        product.is_active && product.stock > 0
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {product.is_active && product.stock > 0
                        ? `Stock: ${product.stock}`
                        : "Out of Stock"}{" "}
                      {/* 产品库存 */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* 如果套餐内没有产品 */
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div> {/* 图标 */}
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Products Found
              </h3>{" "}
              {/* 提示标题 */}
              <p className="text-gray-500">
                This package doesn't contain any products yet.
              </p>{" "}
              {/* 提示信息 */}
            </div>
          )}
        </motion.div>

        {/* 页面底部的“添加到购物车”大按钮 */}
        <motion.div
          className="text-center" /* 居中容器 */
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }} /* 动画 */
        >
          <motion.button
            onClick={handleAddToCart} /* 点击事件处理 */
            disabled={
              !packageData.inStock || addingToCart
            } /* 禁用条件：无货或正在添加 */
            className={`px-8 md:px-12 py-4 md:py-5 rounded-3xl font-bold text-lg md:text-xl transition-all duration-300 border-2 ${
              /* 按钮样式 */
              packageData.inStock && !addingToCart
                ? "text-white transform hover:scale-105 hover:cursor-pointer" /* 可用状态 */
                : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300" /* 禁用状态 */
            }`}
            style={
              packageData.inStock && !addingToCart ? buttonStyle : {}
            } /* 根据状态应用样式 */
            whileHover={
              packageData.inStock && !addingToCart ? { scale: 1.05 } : {}
            } /* 悬停动画 */
            whileTap={
              packageData.inStock && !addingToCart ? { scale: 0.95 } : {}
            } /* 点击动画 */
          >
            <AnimatePresence mode="wait">
              {" "}
              {/* 用于在不同内容间平滑过渡 */}
              {addingToCart /* 如果正在添加 */ ? (
                <motion.div
                  key="loading" /* 唯一的key */
                  className="flex items-center justify-center" /* 布局 */
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} /* 过渡动画 */
                >
                  <div
                    className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3" /* 加载图标 */
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
                    }}
                  ></div>
                  Adding to Cart...
                </motion.div>
              ) : (
                /* 如果未在添加 */
                <motion.span
                  key="text" /* 唯一的key */
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }} /* 过渡动画 */
                >
                  🛒 Add Entire Package to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <p className="text-gray-600 mt-4 text-sm md:text-base">
            Get all {products.length} products in one convenient package{" "}
            {/* 提示信息 */}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// 导出组件，使其可以在其他地方被导入和使用
export default PackageDetailPage;
