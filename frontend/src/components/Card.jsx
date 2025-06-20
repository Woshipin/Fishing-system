// --- 导入所需库 ---
// 导入 framer-motion 库，它提供了强大的动画能力，让界面过渡更生动
import { motion } from "framer-motion";
// 导入 React 的核心钩子：useState 用于状态管理，useEffect 用于处理副作用，useRef 用于引用 DOM 元素或存储持久化变量
import { useState, useEffect, useRef } from "react";

// --- 定义常量 ---
// 定义一个默认的图片 URL，当传入的图片数组为空或图片加载失败时用作备用
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

// [优化] 将左箭头 SVG 图标提取为常量，以便复用和保持 JSX 清洁
const PrevIcon = (
  // SVG 图标本身，定义了视图框、填充颜色和路径数据
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
  </svg>
);

// [优化] 将右箭头 SVG 图标提取为常量
const NextIcon = (
  // SVG 图标本身，定义了视图框、填充颜色和路径数据
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

// [优化] 将图片导航按钮的通用样式提取为常量，避免在 JSX 中重复书写
const imageNavButtonStyle = "absolute top-1/2 -translate-y-1/2 bg-black/25 backdrop-blur-sm text-white w-9 h-9 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/40 hover:scale-105";

// [优化] 将图片上标签（价格和分类）的通用样式提取为常量
const imageTagStyle = "absolute bg-black/60 backdrop-blur-sm text-white border border-white/20";


// --- 定义重构后的通用 Card 组件 ---
// 这是卡片组件的主体，通过对象解构接收父组件传入的各种属性 (props)
const Card = ({
  children,        // 子元素，将被渲染在卡片内容区域的中间
  className = "",  // 允许外部传入额外的 CSS 类
  imageUrls = [],  // 图片 URL 数组，默认为空数组
  imageAlt = "Card image", // 图片的 alt 文本，用于无障碍访问
  title,           // 卡片标题
  subtitle,        // 卡片副标题或描述
  footer,          // 卡片底部内容，将取代默认的按钮区域
  price,           // 价格，显示在图片左下角
  category,        // 分类，显示在图片右上角
  rating = 0,      // 评分 (例如 1-5)，默认为0不显示
  autoSlideInterval = 4000, // 图片自动轮播的间隔时间（毫秒）
  ...props         // 接收其他所有传递给根元素的 props
}) => {
  // --- State 和 Refs: 状态与引用 ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  // --- Effects: 副作用处理 (自动轮播逻辑) ---
  useEffect(() => {
    if (imageUrls.length <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!isHovering) {
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
      }
    }, autoSlideInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imageUrls.length, autoSlideInterval, isHovering]);

  // --- Helper Functions: 辅助函数 ---

  // 切换到下一张图片的函数
  const nextImage = (e) => {
    e.stopPropagation();
    if (imageUrls.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
  };

  // 切换到上一张图片的函数
  const prevImage = (e) => {
    e.stopPropagation();
    if (imageUrls.length === 0) return;
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  // 渲染图片下方指示器小圆点的函数
  const renderImageIndicators = () => {
    if (imageUrls.length <= 1) return null;
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2.5">
        {imageUrls.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out transform
              ${currentImageIndex === index
                ? 'bg-white scale-125'
                : 'bg-white/40 hover:bg-white/70'
              }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(index);
            }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  // 渲染评分星星的函数
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < count ? "text-amber-400" : "text-slate-300"}`}
      >
        ★
      </span>
    ));
  };

  // --- 准备渲染数据 ---
  const displayPrice = parseFloat(price) || 0;
  const validImageUrls = imageUrls && imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE_URL];

  // --- Component Render: 组件渲染 ---
  return (
    // 卡片根元素，应用与 PackageCard 完全一致的设计
    <motion.div
      // 应用辉光边框、圆角、flex布局、固定高度等样式
      className={`group bg-white rounded-2xl flex flex-col h-[500px] w-full overflow-hidden
                 transition-all duration-300 ease-out
                 shadow-[0_0_0_1px_rgba(59,130,246,0.25),_0_0_15px_rgba(59,130,246,0.1)]
                 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)]
                 ${className}`} // 合并外部传入的 className
      whileHover={{ y: -6 }} // 悬停时上浮动画
      {...props} // 应用其他所有传入的 props
    >
      {/* --- 图片区域 (50% 高度) --- */}
      <div
        className="relative h-1/2 overflow-hidden bg-slate-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* 图片本身 */}
        <motion.img
          key={currentImageIndex}
          src={validImageUrls[currentImageIndex]}
          alt={title || imageAlt}
          className="w-full h-full object-cover"
          initial={{ opacity: 0.8, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onError={(e) => {
            console.error('Image failed to load:', validImageUrls[currentImageIndex]);
            e.target.onerror = null;
            e.target.src = DEFAULT_IMAGE_URL;
          }}
          loading="lazy"
        />
        
        {/* 渐变遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 图片轮播控件 */}
        {validImageUrls.length > 1 && (
          <>
            <button onClick={prevImage} className={`${imageNavButtonStyle} left-3`} aria-label="Previous image">
              {PrevIcon}
            </button>
            <button onClick={nextImage} className={`${imageNavButtonStyle} right-3`} aria-label="Next image">
              {NextIcon}
            </button>
          </>
        )}
        
        {/* 图片指示器 */}
        {renderImageIndicators()}
        
        {/* 价格标签 (仅当 price prop 存在时渲染) */}
        {price && (
          <div className={`${imageTagStyle} bottom-4 left-4 px-3.5 py-1.5 rounded-lg text-sm font-semibold`}>
            ${displayPrice.toFixed(2)}
          </div>
        )}

        {/* 分类标签 (仅当 category prop 存在时渲染) */}
        {category && (
          <div className={`${imageTagStyle} top-4 right-4 px-4 py-1.5 rounded-full text-xs font-medium`}>
            {category}
          </div>
        )}
      </div>

      {/* --- 内容区域 (50% 高度) --- */}
      <div className="h-1/2 p-5 flex flex-col justify-between">
        {/* 顶部：标题和评分 */}
        <div>
          <div className="flex justify-between items-start gap-3 mb-2">
            {/* 标题 */}
            {title && (
              <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug flex-1">
                {title}
              </h3>
            )}
            {/* 评分 */}
            {rating > 0 && (
              <div className="flex shrink-0">
                {renderStars(rating)}
              </div>
            )}
          </div>
        </div>

        {/* 中间：副标题(subtitle)和子元素(children) */}
        <div className="flex-grow my-2 overflow-y-auto">
          {/* 副标题 */}
          {subtitle && (
            <p className="text-slate-600 text-sm leading-relaxed mb-2 line-clamp-4">
              {subtitle}
            </p>
          )}
          {/* 渲染传入的任何子元素 */}
          {children}
        </div>

        {/* 底部：自定义页脚 */}
        {footer && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {/* 渲染传入的 footer 内容 */}
            {footer}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;