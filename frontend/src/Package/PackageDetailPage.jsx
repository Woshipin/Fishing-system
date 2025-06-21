import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

// --- 外部组件和常量 ---

// 默认图片URL
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

// 带有后备和加载状态的图片组件
const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const imageSrcToRender = !currentSrc || hasError ? DEFAULT_IMAGE_URL : currentSrc;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
      <img
        key={imageSrcToRender}
        src={imageSrcToRender}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s" }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

// 星级评分组件
const StarRating = ({ rating, className = "" }) => {
  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        let starClass = "text-gray-300";
        if (starValue <= rating) {
          starClass = "text-amber-400";
        }
        return (
          <span key={index} className={`text-lg ${starClass}`}>★</span>
        );
      })}
    </div>
  );
};

// 统一样式对象
const buttonStyle = { background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)", boxShadow: "0 8px 32px rgba(59, 130, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)", border: "1px solid rgba(59, 130, 246, 0.3)", transition: "all 0.3s ease", };
const glowStyle = { boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)", border: "1px solid rgba(59, 130, 246, 0.4)", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(20px)", };


// --- 主页面组件 ---
const PackageDetailPage = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // 评论和标签页状态
  const [activeTab, setActiveTab] = useState('details');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewsPerPage = 5;

  const reviewsRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath || typeof imagePath !== 'string') return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = "http://127.0.0.1:8000";
    return imagePath.startsWith("/") ? `${baseUrl}${imagePath}` : `${baseUrl}/${imagePath}`;
  };

  const fetchPackageDetail = async () => {
    // 包装在try...catch中，即使 setLoading 在 finally 中，也能处理初始错误
    try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://127.0.0.1:8000/api/packages/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        const processImages = (item) => {
            let imageUrls = [];
            if (item.imageUrls?.length) imageUrls = item.imageUrls;
            else if (item.image_url) imageUrls = [item.image_url];
            else if (item.image) imageUrls = [item.image];
            const processedUrls = imageUrls.map(getImageUrl).filter(Boolean);
            return { ...item, imageUrls: processedUrls.length > 0 ? processedUrls : [DEFAULT_IMAGE_URL] };
        };

        let processedPackage = processImages(data);
        if (processedPackage.products?.length) {
            processedPackage.products = processedPackage.products.map(processImages);
        }

        processedPackage.reviews = Array.isArray(data.package_reviews) ? data.package_reviews.map(review => ({
            id: review.id,
            user: review.user?.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment,
            date: new Date(review.created_at).toLocaleDateString()
        })).sort((a, b) => new Date(b.date) - new Date(a.date)) : []; // 按日期降序排序

        processedPackage.rating = data.package_reviews_avg_rating ? parseFloat(data.package_reviews_avg_rating).toFixed(1) : 0;
        processedPackage.reviewCount = data.package_reviews_count || 0;

        setPackageData(processedPackage);
    } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Failed to fetch package details. Please try again.");
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
        setSelectedImageIndex(0);
        setReviewPage(1);
        setActiveTab('details');
        fetchPackageDetail();
    }
  }, [id]);

  const handleAddToCart = async () => { /* ... 保持不变 ... */ };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      showToast("You must be logged in to submit a review.", "error");
      return;
    }
    if (userRating === 0) {
      showToast("Please select a rating before submitting.", "error");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const payload = {
        user_id: parseInt(userId, 10),
        rating: userRating,
        comment: userComment,
      };
      const response = await fetch(`http://127.0.0.1:8000/api/packages/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || "Review submitted successfully!", "success");
        setUserRating(0);
        setUserComment("");
        await fetchPackageDetail();
        setActiveTab('reviews');
        setReviewPage(1);
      } else {
        throw new Error(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 分页逻辑
  const lastReviewIndex = reviewPage * reviewsPerPage;
  const firstReviewIndex = lastReviewIndex - reviewsPerPage;
  const currentReviews = packageData?.reviews.slice(firstReviewIndex, lastReviewIndex) || [];
  const totalReviewPages = Math.ceil((packageData?.reviews.length || 0) / reviewsPerPage);

  // 加载、错误、无数据状态UI (保持不变)
  if (loading) { /* ... */ }
  if (error) { /* ... */ }
  if (!packageData) return null;

  const products = packageData.products || [];
  const imageUrls = packageData.imageUrls || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      {/* 动画和Toast通知 (保持不变) */}
      <style>{`@keyframes progress-animation { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } @keyframes slide-in-from-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-progress { animation: progress-animation 1.5s linear infinite; } .animate-slide-in { animation: slide-in-from-right 0.5s ease-out forwards; }`}</style>
      {addingToCart && ( <div className="fixed top-0 left-0 right-0 h-1 bg-blue-200 z-50 overflow-hidden"> <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 animate-progress"></div> </div> )}
      {toast.show && ( <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white transition-transform transform ${ toast.type === "success" ? "bg-green-500" : "bg-red-500" } animate-slide-in`} > <span>{toast.message}</span> <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 text-xl font-bold hover:opacity-75 cursor-pointer" > × </button> </div> )}
      
      {/* 页面头部 */}
      <motion.div
        className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-12 md:py-20"
        style={{ boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1)" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-cyan-600/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {packageData.title}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Package Details & Included Products
          </motion.p>
        </div>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* 套餐主信息：图片和右侧详情 */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {/* 左侧图片区域 */}
          <div className="space-y-4">
            <motion.div className="relative rounded-3xl overflow-hidden" style={glowStyle} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <ImageWithFallback key={imageUrls[selectedImageIndex] || id} src={imageUrls[selectedImageIndex]} alt={packageData.title} className="w-full h-64 md:h-80 lg:h-96" />
            </motion.div>
            {imageUrls.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <motion.button key={index} onClick={() => setSelectedImageIndex(index)} className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:cursor-pointer ${ selectedImageIndex === index ? "border-blue-400 shadow-lg" : "border-blue-200 hover:border-blue-300" }`} style={{ boxShadow: selectedImageIndex === index ? "0 0 20px rgba(59, 130, 246, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.1)" }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} >
                    <ImageWithFallback src={url} alt={`${packageData.title} ${index + 1}`} className="w-full h-16 md:h-20" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
          {/* ✅ 右侧主信息区域 (布局调整) */}
          <div className="space-y-6">
            <motion.div className="rounded-3xl p-6 md:p-8 h-full flex flex-col" style={glowStyle} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="flex items-center bg-amber-50 px-3 py-2 rounded-xl border border-amber-200" style={{ boxShadow: "0 0 15px rgba(251, 191, 36, 0.3)" }} >
                      <StarRating rating={packageData.rating} />
                      <span className="text-gray-700 ml-2 font-medium"> ({packageData.rating}/5) </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-xl text-sm font-semibold capitalize border border-blue-200" style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }} >
                    {packageData.category}
                  </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">{packageData.title}</h1>
              <p className="text-gray-700 text-base leading-relaxed mb-6">{packageData.description}</p>
              
              <div className="mt-auto pt-6 border-t border-gray-200/80 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          ${parseFloat(packageData.price).toFixed(2)}
                        </span>
                        {packageData.originalPrice > packageData.price && (
                          <span className="text-xl text-gray-500 line-through">${parseFloat(packageData.originalPrice).toFixed(2)}</span>
                        )}
                      </div>
                      {packageData.originalPrice > packageData.price && (
                        <span className="text-green-600 font-semibold text-sm">Save ${(parseFloat(packageData.originalPrice) - parseFloat(packageData.price)).toFixed(2)}</span>
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${ packageData.inStock ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200" : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200" }`} style={{ boxShadow: packageData.inStock ? "0 0 20px rgba(34, 197, 94, 0.3)" : "0 0 20px rgba(239, 68, 68, 0.3)" }} >
                      {packageData.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                    </div>
                  </div>
                  <motion.div className="text-center">
                    <motion.button onClick={handleAddToCart} disabled={!packageData.inStock || addingToCart} className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${ packageData.inStock && !addingToCart ? "text-white transform hover:scale-105 hover:cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300" }`} style={packageData.inStock && !addingToCart ? buttonStyle : {}} whileHover={ packageData.inStock && !addingToCart ? { scale: 1.05 } : {} } whileTap={ packageData.inStock && !addingToCart ? { scale: 0.95 } : {} } >
                        <AnimatePresence mode="wait">
                        {addingToCart ? ( <motion.div key="loading" className="flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} > <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div> Adding... </motion.div> ) : ( <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} > 🛒 Add to Cart </motion.span> )}
                        </AnimatePresence>
                    </motion.button>
                  </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* 包含的产品 */}
        <motion.div className="rounded-3xl p-6 md:p-10 mb-16" style={glowStyle} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8 text-center">
            What's Included ({products.length} Products)
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <motion.div key={product.id} className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300" style={{ boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15), 0 0 20px rgba(6, 182, 212, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)" }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }} whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.25), 0 0 30px rgba(6, 182, 212, 0.2)" }} >
                  <div className="rounded-xl overflow-hidden mb-4 border-2 border-blue-100" style={{ boxShadow: "0 8px 20px rgba(59, 130, 246, 0.15)" }} >
                    <ImageWithFallback src={product.imageUrls[0]} alt={product.name} className="w-full h-32 md:h-40 object-cover transition-transform duration-500 hover:scale-110"/>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-md line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-lg">${parseFloat(product.price).toFixed(2)}</span>
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"><StarRating rating={product.rating} className="text-sm" /></div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">This package currently includes no products.</div>
          )}
        </motion.div>
        
        {/* 评价和评分区块 */}
        <motion.div ref={reviewsRef} className="rounded-3xl p-6 md:p-10" style={glowStyle} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} >
          <div className="space-y-10">
            {/* 提交评论表单 */}
            <div className="p-6 border rounded-2xl bg-white/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Leave a Review</h3>
              {userId ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                      {[...Array(5)].map((_, index) => (<button type="button" key={index} onClick={() => setUserRating(index + 1)} onMouseEnter={() => setHoverRating(index + 1)} className={`text-4xl transition-transform duration-200 transform hover:scale-125 focus:outline-none ${index < (hoverRating || userRating) ? 'text-amber-400' : 'text-gray-300'}`}>★</button>))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                    <textarea id="comment" value={userComment} onChange={e => setUserComment(e.target.value)} rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                  </div>
                  <button type="submit" disabled={isSubmittingReview || userRating === 0} style={buttonStyle} className="px-6 py-2.5 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <p className="text-gray-600">Please <a href="/login" className="text-blue-600 hover:underline font-semibold">log in</a> to leave a review.</p>
              )}
            </div>

            {/* 评论列表 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800">Customer Reviews ({packageData.reviewCount})</h3>
              {currentReviews.length > 0 ? currentReviews.map(review => (
                <div key={review.id} className="p-5 border rounded-2xl bg-white/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">{review.user.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="font-bold text-gray-900">{review.user}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <p className="mt-3 text-gray-700 pl-13">{review.comment || <span className="italic text-gray-400">No comment provided.</span>}</p>
                </div>
              )) : (
                <p className="text-center text-gray-500 py-8">No reviews for this package yet. Be the first!</p>
              )}
            </div>
            
            {/* 分页控件 */}
            {totalReviewPages > 1 && (
              <div className="flex justify-center items-center space-x-4 pt-4">
                <button onClick={() => setReviewPage(p => p - 1)} disabled={reviewPage === 1} className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 transition hover:bg-gray-50">Previous</button>
                <span className="font-medium text-gray-700">Page {reviewPage} of {totalReviewPages}</span>
                <button onClick={() => setReviewPage(p => p + 1)} disabled={reviewPage === totalReviewPages} className="px-4 py-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 transition hover:bg-gray-50">Next</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageDetailPage;