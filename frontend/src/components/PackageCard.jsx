import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

const PackageCard = ({
  title = "Package Title",
  description = "Package description",
  buttonLink = "#",
  category = "Category",
  price = 0,
  rating = 5,
  imageUrls = [], // 改为支持多图片数组
  imageAlt = "Package image",
  inStock = true,
  autoSlideInterval = 4000, // 自动滑动间隔
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

  // 简化星级评分渲染
  const renderStars = (count) => {
    return Array(5).fill(0).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${index < count ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  // 确保价格是数字
  const displayPrice = parseFloat(price) || 0;

  return (
    <motion.div
      className="group bg-white border border-blue-200/50 overflow-hidden transition-all duration-500 flex flex-col rounded-3xl h-[500px] w-full shadow-lg hover:shadow-2xl backdrop-blur-sm"
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.25)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Image Area */}
      <div 
        className="relative h-[50%] overflow-hidden rounded-t-3xl bg-gray-100 group"
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
                console.error('Image failed to load:', imageUrls[currentImageIndex]);
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

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
          ${displayPrice.toFixed(2)}
        </div>

        {/* Category Tag */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-blue-700 px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-blue-100 transition-all duration-300 hover:bg-white hover:scale-105">
          {category}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col h-[50%] justify-between">
        {/* Title and Rating */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 leading-tight">
            {title}
          </h3>
          <div className="flex shrink-0">
            {renderStars(rating)}
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Bottom Action Area */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            inStock
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>

          <Link
            to={buttonLink || "/packages"}
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