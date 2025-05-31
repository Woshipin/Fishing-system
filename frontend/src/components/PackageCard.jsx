import { motion } from "framer-motion";

const PackageCard = ({
  title = "Package Title",
  description = "Package description",
  buttonLink = "#",
  category = "Category",
  price = 0,
  rating = 5,
  imageUrl = "/assets/About/about-us.png",
  imageAlt = "Package image",
  inStock = true
}) => {
  // 简化星级评分渲染
  const stars = "★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating);
  
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
      {/* 图片区域 */}
      <div className="relative h-[50%] overflow-hidden rounded-t-3xl">
        <motion.img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.1 }}
        />
        
        {/* 价格标签 */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
          ${displayPrice.toFixed(2)}
        </div>
        
        {/* 分类标签 */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-blue-700 px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-blue-100 transition-all duration-300 hover:bg-white hover:scale-105">
          {category}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 flex flex-col h-[50%] justify-between">
        {/* 标题和评分 */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 leading-tight">
            {title}
          </h3>
          <div className="text-yellow-400 text-lg font-medium shrink-0 drop-shadow-sm">
            {stars}
          </div>
        </div>

        {/* 描述 */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* 底部操作区 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            inStock 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
          
          <motion.a
            href={buttonLink || "/products"}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-sm transition-all duration-300 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl border border-blue-500/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
