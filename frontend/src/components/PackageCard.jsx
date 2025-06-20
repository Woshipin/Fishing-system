// --- 导入所需库 ---
// 导入 framer-motion 库，它提供了强大的动画能力，让界面过渡更生动
import { motion } from "framer-motion";
// 导入 React 的核心钩子：useState 用于状态管理，useEffect 用于处理副作用，useRef 用于引用 DOM 元素或存储持久化变量
import { useState, useEffect, useRef } from "react";
// 导入 react-router-dom 中的 Link 组件，用于实现客户端路由跳转，避免页面刷新
import { Link } from "react-router-dom";

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
const imageTagStyle = "absolute bg-black backdrop-blur-sm text-white border border-white";


// --- 定义 PackageCard 组件 ---
// 这是卡片组件的主体，通过对象解构接收父组件传入的各种属性 (props)
const PackageCard = ({
  id,              // 套餐的唯一ID，用于生成详情页链接
  title,           // 套餐标题
  description,     // 套餐描述
  buttonLink,      // "查看详情"按钮的自定义链接
  categoryName,    // 套餐分类名称
  price,           // 套餐价格
  rating,          // 套餐评分 (例如 1-5)
  imageUrls = [],  // 图片 URL 数组，默认为空数组
  imageAlt,        // 图片的 alt 文本，用于无障碍访问
  inStock = true,  // 库存状态，默认为 true (有货)
  autoSlideInterval = 4000, // 图片自动轮播的间隔时间（毫秒），默认为 4000
}) => {
  // --- State 和 Refs: 状态与引用 ---
  // 使用 useState 创建一个状态，用于追踪当前显示的图片索引，初始值为 0
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // 使用 useState 创建一个状态，用于判断鼠标是否正悬停在图片上，以控制自动轮播的暂停与恢复
  const [isHovering, setIsHovering] = useState(false);
  // 使用 useRef 创建一个引用，用于存储 setInterval 的 ID，以便在组件卸载时清除它，防止内存泄漏
  const intervalRef = useRef(null);

  // --- Effects: 副作用处理 (自动轮播逻辑) ---
  // 使用 useEffect 钩子来处理需要与外部系统交互的逻辑，如此处的定时器
  useEffect(() => {
    // 如果图片数量小于等于1，则不需要轮播，直接返回，不做任何操作
    if (imageUrls.length <= 1) return;

    // 设置一个定时器，在指定的时间间隔后执行回调函数
    intervalRef.current = setInterval(() => {
      // 仅当鼠标没有悬停在图片上时，才自动切换到下一张图片
      if (!isHovering) {
        // 更新当前图片索引。如果到了最后一张，则返回第一张（索引0），否则索引加1
        setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
      }
    }, autoSlideInterval); // 定时器的间隔时间

    // 返回一个清理函数。此函数会在组件卸载或依赖项改变时执行
    return () => {
      // 确保 intervalRef.current 存在，然后清除定时器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imageUrls.length, autoSlideInterval, isHovering]); // 依赖项数组：当这些值改变时，useEffect会重新执行

  // --- Helper Functions: 辅助函数 ---

  // 切换到下一张图片的函数
  const nextImage = (e) => {
    // 阻止事件冒泡，防止点击箭头时触发卡片的其他点击事件
    e.stopPropagation(); 
    // 如果图片数组为空，则不执行任何操作
    if (imageUrls.length === 0) return;
    // 使用模运算（%）实现循环切换，确保索引不会越界
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
  };

  // 切换到上一张图片的函数
  const prevImage = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 如果图片数组为空，则不执行任何操作
    if (imageUrls.length === 0) return;
    // 使用模运算实现循环切换。`+ imageUrls.length`是为了防止索引变为负数
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + imageUrls.length) % imageUrls.length);
  };

  // 渲染图片下方指示器小圆点的函数
  const renderImageIndicators = () => {
    // 如果图片数量不足以轮播，则不渲染任何内容
    if (imageUrls.length <= 1) return null;
    // 返回指示器的 JSX 结构
    return (
      // 指示器容器，使用 flex 布局居中
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2.5">
        {/* 遍历图片数组，为每张图片生成一个指示器按钮 */}
        {imageUrls.map((_, index) => (
          // 每个指示器都是一个可点击的按钮
          <button
            key={index} // 使用索引作为 key，因为列表是静态的
            // 根据当前图片索引动态设置样式
            className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out transform
              ${currentImageIndex === index
                ? 'bg-white scale-125' // 选中状态的样式：白色、放大
                : 'bg-white/40 hover:bg-white/70' // 未选中状态的样式：半透明白色，悬停时更亮
              }`}
            // 点击时，阻止事件冒泡并设置当前图片索引为被点击的索引
            onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
            }}
            aria-label={`Go to image ${index + 1}`} // 为无障碍访问提供清晰的标签
          />
        ))}
      </div> // 指示器容器结束
    );
  };
  
  // 渲染评分星星的函数
  const renderStars = (count) => {
    // 创建一个包含5个元素的数组，并遍历它来生成5个星星
    return Array(5).fill(0).map((_, index) => (
      // 每个星星是一个 span 元素
      <span
        key={index} // 使用索引作为 key
        // 根据评分动态设置星星颜色
        className={`text-lg ${index < count ? "text-amber-400" : "text-slate-300"}`}
      >
        ★ 
      </span> // 星星字符
    ));
  };
  
  // --- 准备渲染数据 ---
  // 将传入的 price 属性转换为浮点数，如果无效则默认为 0
  const displayPrice = parseFloat(price) || 0;
  // 创建一个有效的图片 URL 数组。如果传入的数组为空，则使用包含默认图片的数组
  const validImageUrls = imageUrls && imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE_URL];

  // --- Component Render: 组件渲染 ---
  // 返回组件的最终 JSX 结构
  return (
    // 卡片根元素，使用 motion.div 以应用 framer-motion 动画
    <motion.div
      // 定义根元素的样式：group 用于悬停、圆角、flex 布局、固定高度、溢出隐藏等
      className="group bg-white rounded-2xl flex flex-col h-[500px] w-full overflow-hidden
                 transition-all duration-300 ease-out
                 shadow-[0_0_0_1px_rgba(59,130,246,0.25),_0_0_15px_rgba(59,130,246,0.1)]
                 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.4),_0_0_30px_rgba(59,130,246,0.2)]"
      // 定义悬停时的动画效果：Y 轴向上移动 6px
      whileHover={{ y: -6 }}
    >
      {/* --- 图片区域 --- */}
      {/* 图片容器，占卡片高度的 50% */}
      <div
        className="relative h-1/2 overflow-hidden bg-slate-100"
        onMouseEnter={() => setIsHovering(true)}  // 鼠标进入时，设置 isHovering 为 true
        onMouseLeave={() => setIsHovering(false)} // 鼠标离开时，设置 isHovering 为 false
      >
        {/* 图片本身，使用 motion.img 以应用切换动画 */}
        <motion.img
          key={currentImageIndex} // 将当前索引作为 key，当 key 改变时，Framer Motion 会触发重新渲染和动画
          src={validImageUrls[currentImageIndex]} // 图片源地址
          alt={title || imageAlt || 'Package image'} // 图片的 alt 文本
          className="w-full h-full object-cover" // 图片样式：铺满容器、保持比例裁剪
          initial={{ opacity: 0.8, scale: 1.05 }} // 动画初始状态：轻微透明、放大
          animate={{ opacity: 1, scale: 1 }} // 动画结束状态：完全不透明、正常大小
          transition={{ duration: 0.5, ease: 'easeInOut' }} // 动画过渡效果：持续0.5秒，缓入缓出
          onError={(e) => { // 当图片加载失败时执行
            console.error('Image failed to load:', validImageUrls[currentImageIndex]); // 在控制台打印错误信息
            e.target.onerror = null; // 防止因备用图片也加载失败而导致的无限循环
            e.target.src = DEFAULT_IMAGE_URL; // 将图片源设置为默认图片
          }}
          loading="lazy" // 启用图片懒加载，优化页面性能
        />
        
        {/* 图片上的渐变遮罩层，用于增强下方文本的可读性 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 仅当图片数量大于1时，才渲染导航按钮 */}
        {validImageUrls.length > 1 && (
          // 使用 React Fragment 包裹多个元素
          <>
            {/* 上一张图片按钮 */}
            <button onClick={prevImage} className={`${imageNavButtonStyle} left-3`} aria-label="Previous image">
              {PrevIcon} {/* 渲染之前定义的左箭头图标 */}
            </button>
            {/* 下一张图片按钮 */}
            <button onClick={nextImage} className={`${imageNavButtonStyle} right-3`} aria-label="Next image">
              {NextIcon} {/* 渲染之前定义的右箭头图标 */}
            </button>
          </>
        )}
        
        {/* 调用函数渲染图片指示器 */}
        {renderImageIndicators()}
        
        {/* 价格标签 */}
        <div className={`${imageTagStyle} bottom-4 left-4 px-3.5 py-1.5 rounded-lg text-sm font-semibold`}>
          ${displayPrice.toFixed(2)} {/* 格式化价格，保留两位小数 */}
        </div>

        {/* 分类标签 */}
        <div className={`${imageTagStyle} top-4 right-4 px-4 py-1.5 rounded-full text-xs font-medium`}>
          {categoryName} {/* 显示分类名称 */}
        </div>
      </div> 
      {/* --- 图片区域结束 --- */}

      {/* --- 内容区域 --- */}
      {/* 内容容器，占卡片高度的 50%，使用 flex 布局使其内部元素能均匀分布 */}
      <div className="h-1/2 p-5 flex flex-col justify-between">
        {/* 内容区域的上半部分 */}
        <div>
          {/* 标题和评分的容器 */}
          <div className="flex justify-between items-start gap-3 mb-2">
            {/* 标题 */}
            <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-snug flex-1">
              {title}
            </h3>
            {/* 评分星星的容器 */}
            <div className="flex shrink-0">
              {renderStars(rating)} {/* 调用函数渲染星星 */}
            </div>
          </div>
        </div> 
        {/* 内容区域的上半部分结束 */}

        {/* 内容区域的中间部分 (描述) */}
        <div className="flex-grow my-2">
          {/* 描述文本。flex-grow 使其填充可用空间，line-clamp-4 限制最多显示4行 */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
            {description}
          </p>
        </div> 
        {/* 内容区域的中间部分结束 */}

        {/* 内容区域的底部 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {/* 库存状态标签 */}
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold
            ${inStock
              ? 'bg-teal-300 text-black' // 有货时的样式
              : 'bg-rose-500 text-black'  // 无货时的样式
            }`}>
            {inStock ? 'In Stock' : 'Out of Stock'} {/* 根据库存状态显示不同文本 */}
          </span>

          {/* "查看详情" 按钮，使用 Link 组件实现无刷新跳转 */}
          <Link
            to={buttonLink || `/packages/${id}`} // 跳转链接：优先使用传入的 buttonLink，否则根据 id 动态生成
            // 按钮的样式
            className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm cursor-pointer
                       transition-all duration-300 ease-out
                       hover:bg-blue-700 hover:-translate-y-0.5 transform-gpu
                       shadow-sm hover:shadow-lg shadow-blue-500/20"
          >
            View Details
          </Link>
        </div> 
        {/* 内容区域的底部结束 */}
      </div> 
      {/* --- 内容区域结束 --- */}
    </motion.div> 
    // 卡片根元素结束
  );
};

// 默认导出 PackageCard 组件，以便在其他文件中导入和使用
export default PackageCard;