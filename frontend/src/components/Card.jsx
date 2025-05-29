import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

const Card = ({
  children,
  className = "",
  imageUrls = [],
  imageAlt = "Card image",
  title,
  subtitle,
  footer,
  price,
  category,
  rating = 0,
  autoSlideInterval = 4000, // 自动滑动间隔，默认4秒
  ...props
}) => {
  // 状态管理
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);

  // 自动轮播功能
  useEffect(() => {
    // 只有多张图片时才启用自动轮播
    if (imageUrls.length <= 1) return;
    
    // 设置轮播定时器
    intervalRef.current = setInterval(() => {
      if (!isHovering) {
        setCurrentImageIndex(prevIndex => 
          prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, autoSlideInterval);
    
    // 清除定时器
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [imageUrls.length, autoSlideInterval, isHovering]);

  // 渲染星级评分
  const renderStars = count => {
    return Array(5).fill(0).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < count ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

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

  // 渲染图片指示器
  const renderImageIndicators = () => {
    if (imageUrls.length <= 1) return null;
    
    return (
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {imageUrls.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-blue-500 scale-110' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className={`bg-white border border-blue-200/70 overflow-hidden transition-all duration-300 flex flex-col rounded-3xl h-[500px] w-full ${className}`}
      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.15)" }}
      style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
      {...props}
    >
      {/* 图片区域 */}
      <div 
        className="relative h-[50%] overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {imageUrls.length > 0 ? (
          <>
            <motion.img
              src={imageUrls[currentImageIndex] || DEFAULT_IMAGE_URL}
              alt={title || imageAlt}
              className="w-full h-full object-cover transition-all duration-500"
              initial={{ opacity: 0.8, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              key={currentImageIndex}
              onError={(e) => {
                e.target.onerror = null; // 防止无限循环
                e.target.src = DEFAULT_IMAGE_URL;
              }}
            />
            {imageUrls.length > 1 && (
              <>
                {/* 上一张按钮 */}
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                  </svg>
                </button>
                {/* 下一张按钮 */}
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
            {renderImageIndicators()}
          </>
        ) : (
          <img
            src={DEFAULT_IMAGE_URL}
            alt={title || imageAlt}
            className="w-full h-full object-cover"
          />
        )}

        {/* 价格标签 */}
        {price && (
          <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md">
            ${price}
          </div>
        )}
        {/* 分类标签 */}
        {category && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {category}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4 flex flex-col h-[50%] overflow-auto scrollbar-thin">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
          {title && (
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2 max-w-full sm:max-w-[70%]">
              {title}
            </h3>
          )}
          {rating > 0 && (
            <div className="flex self-start sm:self-center shrink-0">
              {renderStars(rating)}
            </div>
          )}
        </div>
        {subtitle && (
          <div className="flex-grow overflow-auto mb-3">
            <p className="text-gray-700 text-sm">{subtitle}</p>
          </div>
        )}
        {children}
        {footer && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
            <div className="w-full">{footer}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
