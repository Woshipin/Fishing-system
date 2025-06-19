// GalleryPage.jsx

// 声明此文件为客户端组件，这是 Next.js 13+ App Router 的规范。
"use client";

// 导入 React 核心库中的 useState 和 useEffect Hooks，用于状态管理和副作用处理。
import { useState, useEffect } from "react";
// 从 framer-motion 库导入 motion，用于创建丰富的动画效果。
import { motion } from "framer-motion";
// 导入自定义的动画容器组件和页面头部组件。
import AnimatedSection from "../components/AnimatedSection";
import PageHeader from "../components/PageHeader";

// 定义存储在 Laravel 后端的图片的基础 URL。
const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";

// --- 可重用的 UI 子组件 ---

/**
 * 单个图片卡片组件
 * @param {object} image - 图片对象，包含 src, alt, title 等信息。
 * @param {function} onImageSelect - 当卡片被点击时调用的函数。
 * @param {number} index - 图片在列表中的索引，用于计算动画延迟。
 */
const GalleryImageCard = ({ image, onImageSelect, index }) => (
  // 使用 motion.div 创建带动画的卡片容器。
  <motion.div
    key={image.id}
    layout // 启用布局动画，当项目重新排序时平滑过渡。
    // 定义入场动画：从下方80px、旋转45度的位置，变为不透明、y为0、旋转为0。
    initial={{ opacity: 0, y: 80, rotateX: 45 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    // 定义出场动画。
    exit={{ opacity: 0, y: -50, rotateX: -45 }}
    // 定义动画过渡效果：使用弹簧物理模型，并根据索引设置延迟。
    transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.4 }}
    // group 用于 Tailwind CSS 的 group-hover 功能，perspective-1000 为子元素提供3D变换的透视效果。
    className="group perspective-1000"
  >
    {/* 卡片内层容器，包含所有视觉效果。点击时调用传入的 onImageSelect 函数。 */}
    <div
      className="relative bg-slate-800/30 backdrop-blur-xl rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 transform-gpu hover:-translate-y-4 hover:scale-105"
      onClick={() => onImageSelect(image)}
      // 定义基础的边框和阴影效果。
      style={{ boxShadow: '0 0 0 1px rgba(56, 189, 248, 0.3), 0 0 30px rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}
    >
      {/* 悬浮时的辉光边框动画层。 */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
           style={{ background: 'linear-gradient(45deg, transparent, rgba(56, 189, 248, 0.4), transparent, rgba(129, 140, 248, 0.4), transparent)', backgroundSize: '400% 400%', animation: 'gradient-flow 3s ease infinite', padding: '2px' }}>
        <div className="w-full h-full bg-slate-800/50 rounded-3xl"></div>
      </div>

      {/* 悬浮时的外发光模糊效果层。 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-indigo-500/50 rounded-3xl opacity-0 group-hover:opacity-60 blur-lg transition-all duration-700 -z-10"></div>
      
      {/* 图片容器 */}
      <div className="relative overflow-hidden rounded-t-3xl">
        {/* 图片本身，带有悬浮放大和增亮效果。 */}
        <img src={image.src} alt={image.alt} className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110" />
        {/* 悬浮时从底部出现的渐变遮罩。 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        {/* 悬浮时出现的动画粒子。 */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          {[...Array(8)].map((_, i) => (<div key={i} className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: '2s' }}></div>))}
        </div>
        {/* 悬浮时出现的 "View Larger" 提示框。 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-8 group-hover:translate-y-0">
          <div className="bg-slate-800/90 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-2xl border border-cyan-400/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 animate-pulse"></div>
            <div className="relative flex items-center gap-3">
              <svg className="w-6 h-6 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span className="text-cyan-300 font-semibold">View Larger</span>
            </div>
          </div>
        </div>
        {/* 悬浮时出现的右上角ID徽章。 */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-2xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 shadow-lg shadow-cyan-500/30">
          #{image.id}
        </div>
      </div>
      {/* 卡片底部内容区域。 */}
      <div className="p-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
        <h3 className="font-bold text-xl text-slate-100 mb-3 group-hover:text-cyan-300 transition-all duration-500 group-hover:drop-shadow-lg">{image.title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 group-hover:text-slate-200 transition-colors duration-300">{image.description || "Discover the beauty captured in this moment"}</p>
        {/* 悬浮时从左到右扩展的装饰性线条。 */}
        <div className="mt-4 relative">
          <div className="h-1 w-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full group-hover:w-full transition-all duration-700 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute inset-0 h-1 w-0 bg-cyan-300/50 rounded-full group-hover:w-full transition-all duration-700 blur-sm"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

/**
 * 图片灯箱（Lightbox）组件
 * @param {object} image - 要在灯箱中显示的图片对象。
 * @param {function} onClose - 关闭灯箱时调用的函数。
 */
const ImageLightbox = ({ image, onClose }) => (
  // 灯箱的背景遮罩层，带动画效果。点击时调用 onClose 关闭灯箱。
  <motion.div
    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
    animate={{ opacity: 1, backdropFilter: "blur(25px)" }}
    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
    className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-2xl flex items-center justify-center p-4"
    onClick={onClose}
  >
    {/* 灯箱内容容器，带入场动画，并阻止点击事件冒泡到背景层。 */}
    <motion.div
      initial={{ scale: 0.5, opacity: 0, y: 100, rotateX: 45 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
      exit={{ scale: 0.5, opacity: 0, y: 100, rotateX: 45 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
      className="relative max-w-5xl w-full"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 关闭按钮 */}
      <button className="absolute -top-6 -right-6 z-20 bg-slate-800/90 backdrop-blur-xl text-slate-200 hover:text-red-400 p-4 rounded-full shadow-2xl border border-cyan-400/30 transition-all duration-300 hover:scale-110 hover:bg-slate-700/90 group" onClick={onClose}>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-red-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      {/* 图片和内容的容器 */}
      <div className="bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-400/30 relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-indigo-500/50 rounded-3xl blur-lg opacity-60"></div>
        <div className="relative">
          <img src={image.src} alt={image.alt} className="w-full h-auto max-h-[70vh] object-contain" />
          <div className="p-8 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-3xl text-slate-100 mb-4 drop-shadow-lg">{image.title}</h3>
                <p className="text-slate-300 leading-relaxed text-lg">{image.description || "A stunning capture that tells its own unique story"}</p>
              </div>
              <div className="ml-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-2xl text-lg font-bold shadow-2xl shadow-cyan-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/30 to-blue-400/30 animate-pulse"></div>
                <span className="relative">#{image.id}</span>
              </div>
            </div>
            <div className="mt-6 relative">
              <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-lg shadow-cyan-400/50"></div>
              <div className="absolute inset-0 h-2 bg-cyan-300/50 rounded-full blur-md"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);


// --- 主页面组件 ---
const GalleryPage = () => {
  // 状态管理
  const [images, setImages] = useState([]); // 存储从API获取的图片列表，默认为空数组。
  const [selectedImage, setSelectedImage] = useState(null); // 存储当前选中的图片对象，用于打开灯箱。
  // **优化**：引入独立的加载和错误状态，使UI响应更明确。
  const [loading, setLoading] = useState(true); // 初始为 true，表示正在加载。
  const [error, setError] = useState(null); // 存储数据获取过程中发生的错误。

  // 使用 useEffect Hook 在组件首次挂载时获取图片数据。
  useEffect(() => {
    // **优化**：使用 async/await 语法重构数据获取逻辑。
    const fetchGalleries = async () => {
      try {
        // 发送 GET 请求到 Laravel 后端 API。
        const response = await fetch("http://127.0.0.1:8000/api/galleries");
        // 如果响应状态码不是 2xx，则抛出错误。
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // 解析 JSON 格式的响应数据。
        const data = await response.json();
        // 将从API获取的数据映射为前端需要的格式。
        const mappedImages = data.map(item => ({
          id: item.id,
          src: BASE_IMAGE_URL + item.image_path,
          alt: item.title || "Gallery Image",
          title: item.title || "No Title",
          description: item.description || "", // 如果API提供description，则使用它。
        }));
        // 更新图片状态。
        setImages(mappedImages);
      } catch (err) {
        // 如果发生错误，在控制台打印错误，并更新错误状态以在UI中显示。
        console.error("Fetch galleries failed:", err);
        setError("Sorry, we couldn't load the gallery at this moment. Please try again later.");
      } finally {
        // 无论成功或失败，最后都将加载状态设为 false。
        setLoading(false);
      }
    };
    // 调用数据获取函数。
    fetchGalleries();
  }, []); // 空依赖数组意味着此 effect 只在组件挂载时运行一次。

  // **优化**：根据独立的 `loading` 状态显示加载UI。
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-xl animate-pulse"></div>
          <p className="relative text-cyan-300 text-lg font-medium animate-pulse">Loading Gallery...</p>
        </div>
      </div>
    );
  }

  // **优化**：根据独立的 `error` 状态显示错误UI。
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-slate-900 to-red-900 text-center px-4">
        <div>
          <h2 className="text-3xl font-bold text-red-300 mb-4">An Error Occurred</h2>
          <p className="text-red-200 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  // 主页面渲染逻辑。
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.5s'}}></div>
        {[...Array(20)].map((_, i) => (<div key={i} className="absolute w-1 h-1 bg-cyan-300/50 rounded-full animate-pulse" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, animationDuration: `${2 + Math.random() * 2}s` }}></div>))}
      </div>

      {/* 页面头部 */}
      <div className="relative z-10">
        <PageHeader title="Our Gallery" description="Explore our collection of images showcasing our products, events, and team" />
      </div>

      {/* 图库内容区域 */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* **优化**：使用 GalleryImageCard 组件来渲染图片网格，使代码更简洁。 */}
          <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image, index) => (
              <GalleryImageCard 
                key={image.id} 
                image={image}
                onImageSelect={setSelectedImage} // 传入设置选中图片的函数
                index={index} // 传入索引用于动画延迟
              />
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* **优化**：使用 ImageLightbox 组件来显示选中的图片，使代码更简洁。 */}
      {selectedImage && (
        <ImageLightbox 
          image={selectedImage}
          onClose={() => setSelectedImage(null)} // 传入关闭灯箱的函数
        />
      )}

      {/* 用于支持动画的内联 CSS */}
      <style jsx>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform: translateZ(0); }
      `}</style>
    </div>
  );
};

// 导出 GalleryPage 组件，使其可以在其他文件中被导入和使用。
export default GalleryPage;