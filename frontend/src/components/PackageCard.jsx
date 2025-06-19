// 导入 framer-motion 库，用于创建丰富的动画效果
import { motion } from "framer-motion";
// 导入 React 核心库中的 useState, useEffect, 和 useRef 钩子
import { useState, useEffect, useRef } from "react";
// 导入 react-router-dom 中的 Link 组件，用于客户端导航
import { Link } from "react-router-dom";

// 定义一个默认的占位图片 URL，以防没有提供任何图片
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

// 定义 PackageCard 组件
const PackageCard = ({
  id, // 套餐的唯一ID，用于生成详情页链接
  title = "Package Title", // 套餐标题
  description = "Package description", // 套餐描述
  buttonLink, // 详情按钮的链接
  // [修正] 将 prop 的名字从 category 改为 categoryName，使其更具描述性，并与 PackagePage 保持一致
  categoryName = "Category", 
  price = 0, // 套餐价格
  rating = 5, // 套餐评分
  imageUrls = [], // 图片 URL 数组，可以包含多张图片
  imageAlt = "Package image", // 图片的 alt 文本
  inStock = true, // 是否有库存
  autoSlideInterval = 4000, // 图片自动轮播的间隔时间（毫秒）
}) => {
  // --- State and Refs: 状态和引用 ---
  
  // currentImageIndex 状态，用于追踪当前显示的图片索引
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // isHovering 状态，用于判断鼠标是否悬停在图片上，以暂停自动轮播
  const [isHovering, setIsHovering] = useState(false);
  // intervalRef 用于存储 setInterval 的 ID，以便在组件卸载时清除它
  const intervalRef = useRef(null);

  // --- Effects: 副作用处理 ---

  // useEffect 钩子，用于处理图片的自动轮播逻辑
  useEffect(() => {
    // 如果图片数量小于等于1，则不需要轮播，直接返回
    if (imageUrls.length <= 1) return;

    // 设置一个定时器，在指定的时间间隔后切换到下一张图片
    intervalRef.current = setInterval(() => {
      // 仅当鼠标没有悬停在图片上时才进行切换
      if (!isHovering) {
        setCurrentImageIndex(prevIndex =>
          prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, autoSlideInterval);

    // 返回一个清理函数，当组件卸载或依赖项改变时，清除定时器
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [imageUrls.length, autoSlideInterval, isHovering]); // 依赖项数组

  // --- Helper Functions: 辅助函数 ---

  // 切换到下一张图片
  const nextImage = () => {
    if (imageUrls.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
  };

  // 切换到上一张图片
  const prevImage = () => {
    if (imageUrls.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  // 渲染图片下方的指示器小圆点
  const renderImageIndicators = () => {
    if (imageUrls.length <= 1) return null; // 如果图片少于一张，不渲染
    return (
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {imageUrls.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentImageIndex === index
                ? 'bg-blue-500 scale-110' // 当前图片的指示器样式
                : 'bg-white/60 hover:bg-white/80' // 其他指示器样式
            }`}
            onClick={() => setCurrentImageIndex(index)} // 点击可切换到对应图片
          />
        ))}
      </div>
    );
  };

  // 渲染评分的星星
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < count ? "text-yellow-400" : "text-gray-300"}`} // 已评分和未评分的星星颜色
      >
        ★
      </span>
    ));
  };

  // 确保价格是一个数字，并进行格式化
  const displayPrice = parseFloat(price) || 0;

  // --- Component Render: 组件渲染 ---

  return (
    // 卡片根元素，使用 framer-motion 实现动画
    <motion.div
      className="group bg-white border border-blue-200/50 overflow-hidden transition-all duration-500 flex flex-col rounded-3xl h-[500px] w-full shadow-lg hover:shadow-2xl backdrop-blur-sm"
      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.25)" }}
    >
      {/* 图片容器 */}
      <div
        className="relative h-[50%] overflow-hidden rounded-t-3xl bg-gray-100 group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 图片本身，使用 motion.img 以便未来可以添加图片切换动画 */}
        <motion.img
          src={imageUrls[currentImageIndex] || DEFAULT_IMAGE_URL} // 显示当前图片或默认图片
          alt={title || imageAlt}
          className="w-full h-full object-cover transition-all duration-500"
          key={currentImageIndex} // 使用 key 来触发 React 的重新渲染，从而实现图片切换
          onError={(e) => {
            console.error('Image failed to load:', imageUrls[currentImageIndex]);
            e.target.onerror = null; // 防止因默认图片也加载失败而导致的无限循环
            e.target.src = DEFAULT_IMAGE_URL;
          }}
          loading="lazy" // 使用图片懒加载，优化性能
        />
        
        {/* 如果有多张图片，则显示左右切换按钮 */}
        {imageUrls.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110" aria-label="Previous image">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={nextImage} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110" aria-label="Next image">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" /></svg>
            </button>
          </>
        )}
        
        {/* 渲染图片指示器 */}
        {renderImageIndicators()}
        
        {/* 价格标签 */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
          ${displayPrice.toFixed(2)}
        </div>

        {/* 分类标签 */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-blue-700 px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-blue-100 transition-all duration-300 hover:bg-white hover:scale-105">
          {/* [修正] 使用 categoryName prop 来显示分类名称 */}
          {categoryName}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 flex flex-col h-[50%] justify-between">
        {/* 标题和评分 */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 leading-tight">
            {title}
          </h3>
          <div className="flex shrink-0">
            {renderStars(rating)}
          </div>
        </div>

        {/* 描述 */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* 底部：库存状态和详情按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            inStock
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' // 有库存样式
              : 'bg-red-100 text-red-700 border border-red-200' // 无库存样式
          }`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <Link
            to={buttonLink || `/packages/${id}`} // 使用传入的链接，或根据 ID 动态生成
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm transition-all duration-300 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl border border-blue-500/20 inline-block text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;