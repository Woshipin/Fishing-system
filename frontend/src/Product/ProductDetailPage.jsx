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
const API_BASE_URL = "http://127.0.0.1:8000/api";
const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

// --- 数据转换辅助函数 (保持不变) ---
const extractImageUrls = (item) => {
  if (
    item.image_urls &&
    Array.isArray(item.image_urls) &&
    item.image_urls.length > 0
  ) {
    return item.image_urls;
  }
  let imageUrls = [];
  if (item.productImages && Array.isArray(item.productImages)) {
    imageUrls = item.productImages.map(
      (img) => `${BASE_IMAGE_URL}${img.image_path}`
    );
  } else if (item.images && Array.isArray(item.images)) {
    imageUrls = item.images.map((img) =>
      typeof img === "string" ? img : `${BASE_IMAGE_URL}${img.image_path}`
    );
  } else if (item.image) {
    imageUrls = [`${BASE_IMAGE_URL}${item.image}`];
  }
  return imageUrls.length > 0 ? imageUrls : [DEFAULT_IMAGE_URL];
};

const formatProductData = (apiProduct) => {
  if (!apiProduct || typeof apiProduct !== "object") {
    throw new Error("Invalid product data received from server");
  }
  const averageRating = apiProduct.product_reviews_avg_rating
    ? Math.round(parseFloat(apiProduct.product_reviews_avg_rating))
    : 0;
  const reviewCount = apiProduct.product_reviews_count || 0;
  return {
    id: apiProduct.id || 0,
    name: apiProduct.name || "Unnamed Product",
    description: apiProduct.description || "No description available.",
    longDescription:
      apiProduct.long_description ||
      apiProduct.description ||
      "No detailed description available.",
    price: parseFloat(apiProduct.price) || 0,
    discountPrice: apiProduct.discount_price
      ? parseFloat(apiProduct.discount_price)
      : 0,
    category: {
      id: apiProduct.category?.id || 0,
      name: apiProduct.category?.name || "Uncategorized",
    },
    rating: averageRating,
    reviewCount: reviewCount,
    images: extractImageUrls(apiProduct),
    colors: Array.isArray(apiProduct.colors) ? apiProduct.colors : [],
    sizes: Array.isArray(apiProduct.sizes) ? apiProduct.sizes : [],
    inStock: !!apiProduct.is_active,
    featured: !!apiProduct.featured,
    specifications: Array.isArray(apiProduct.specifications)
      ? apiProduct.specifications.map((spec) => ({
          name: spec.name || "Unknown",
          value: spec.value || "N/A",
        }))
      : [],
    reviews: Array.isArray(apiProduct.product_reviews)
      ? apiProduct.product_reviews.map((review) => ({
          id: review.id || Math.random(),
          user: review.user?.name || "Anonymous",
          rating: parseInt(review.rating, 10) || 0,
          date: review.created_at
            ? new Date(review.created_at).toLocaleDateString()
            : "N/A",
          comment: review.comment || "",
        }))
      : [],
    relatedProducts: Array.isArray(apiProduct.related_products)
      ? apiProduct.related_products.map((rp) => {
          const relatedImageUrls = extractImageUrls(rp);
          return {
            id: rp.id || 0,
            name: rp.name || "Related Product",
            price: parseFloat(rp.price) || 0,
            imageUrls: relatedImageUrls,
            imageUrl: relatedImageUrls[0],
            category: {
              id: rp.category?.id || 0,
              name: rp.category?.name || "Uncategorized",
            },
            rating: rp.product_reviews_avg_rating
              ? Math.round(parseFloat(rp.product_reviews_avg_rating))
              : 0,
            inStock: !!rp.is_active,
          };
        })
      : [],
  };
};

// --- React 组件 ---
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 评论分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE_URL;
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      const rawData = response.data.success
        ? response.data.product
        : response.data;
      const formattedProduct = formatProductData(rawData);
      setProduct(formattedProduct);

      if (formattedProduct.images.length > 0) {
        setSelectedImage(0);
      }
      if (formattedProduct.colors.length > 0)
        setSelectedColor(formattedProduct.colors[0]);
      if (formattedProduct.sizes.length > 0)
        setSelectedSize(formattedProduct.sizes[0]);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Product not found.");
      } else {
        setError(
          err.message ||
            "Failed to load product details. Please try again later."
        );
      }
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    // 当产品 ID 变化时，重置评论页码到第一页
    setCurrentPage(1);
  }, [id, fetchProduct]);

  // ✅✅✅ FIX: 实现了完整的 addToCart 函数 ✅✅✅
  const addToCart = async () => {
    if (isAddingToCart || !product.inStock) {
      return;
    }

    if (!userId) {
      showToast("You must be logged in to add items to the cart.", "error");
      return;
    }

    setIsAddingToCart(true);

    // 构建与后端验证规则匹配的 payload
    const payload = {
      user_id: parseInt(userId, 10),
      product_id: product.id,
      name: product.name,
      category_id: product.category?.id || null, // 后端是 nullable，可以安全传递 null
      quantity: quantity,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: product.images[0] || null, // 发送主图的 URL
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/product`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        showToast(response.data.message, "success");
        // 可选: 在此处更新全局购物车状态或数量显示
        // 例如: dispatch({ type: 'UPDATE_CART_COUNT', payload: response.data.cart_count });
      } else {
        showToast(response.data.message || "Could not add to cart.", "error");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      if (err.response) {
        // 后端返回了具体的错误信息
        if (err.response.status === 422) {
          // Validation error
          const errorMessages = Object.values(err.response.data.errors)
            .flat()
            .join(" ");
          showToast(`Error: ${errorMessages}`, "error");
        } else {
          showToast(
            err.response.data.message || "An unexpected error occurred.",
            "error"
          );
        }
      } else {
        // 网络错误等
        showToast("Network error. Please try again.", "error");
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

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
    const payload = {
      user_id: parseInt(userId, 10),
      rating: userRating,
      comment: userComment,
    };
    try {
      const response = await axios.post(
        `${API_BASE_URL}/products/${product.id}/reviews`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.data.success) {
        showToast(response.data.message, "success");
        setUserRating(0);
        setUserComment("");
        await fetchProduct();
        setActiveTab("reviews");
        setCurrentPage(1);
      } else {
        showToast(response.data.message || "An error occurred.", "error");
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 409) {
          showToast(data.message, "error");
        } else if (status === 422) {
          const errorMessages = Object.values(data.errors).flat().join(" ");
          showToast(`Validation failed: ${errorMessages}`, "error");
        } else {
          showToast(data.message || "Failed to submit review.", "error");
        }
      } else {
        showToast("Network error. Please try again.", "error");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const generateSKU = () => {
    if (!product || !product.id) return "PRD-0000";
    return `PRD-${String(product.id).padStart(4, "0")}`;
  };

  // 分页逻辑
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = product
    ? product.reviews.slice(indexOfFirstReview, indexOfLastReview)
    : [];
  const totalPages = product
    ? Math.ceil(product.reviews.length / reviewsPerPage)
    : 0;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">
            Loading product details...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md w-full mx-4">
          <div className="text-5xl mb-4 text-red-500">⚠️</div>
          <div className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Product
          </div>
          <div className="text-gray-600 mb-6">{error}</div>
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

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4">
          <div className="text-5xl mb-4 text-gray-500">🔍</div>
          <div className="text-xl font-semibold text-gray-800 mb-4">
            Product Not Found
          </div>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <style>{`
        @keyframes progress-animation { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes slide-in-from-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-progress { animation: progress-animation 1.5s linear infinite; }
        .animate-slide-in { animation: slide-in-from-right 0.5s ease-out forwards; }
      `}</style>
      {isAddingToCart && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-blue-200 z-50 overflow-hidden">
          <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-600 animate-progress"></div>
        </div>
      )}
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
      <div className="container mx-auto px-4 py-4">
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-blue-800 font-medium">
            {userId
              ? `You are logged in as User ID: ${userId}`
              : "You are not logged in."}
          </p>
        </div>
      </div>
      <section className="py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center cursor-pointer"
                >
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
              <li>
                <div className="flex items-center">
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
              <li aria-current="page">
                <div className="flex items-center">
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
                  <span className="text-sm text-blue-600 font-medium truncate max-w-xs">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <AnimatedSection direction="left" className="space-y-6">
              <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:ring-2 hover:ring-blue-100">
                <img
                  src={product.images[selectedImage]}
                  alt={`${product.name} - Main`}
                  className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedImage === index
                          ? "border-blue-500 shadow-md ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        className="w-full h-16 lg:h-20 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>
            <AnimatedSection
              direction="right"
              className="space-y-6 lg:space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 ring-1 ring-blue-200 ring-opacity-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {product.category.name}
                    </span>
                    {product.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
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
                      <span className="text-sm text-gray-600">
                        {product.rating}/5 ({product.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">SKU:</span> {generateSKU()}
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-3 mt-2">
                    {product.discountPrice > 0 ? (
                      <>
                        <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                          ${product.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
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
                      <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-3">
                    {product.description}
                  </p>
                </div>
                <div className="space-y-6 mt-6">
                  {product.colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Color
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none cursor-pointer ${
                              selectedColor === color
                                ? "bg-blue-600 text-white border border-blue-700 shadow-md ring-2 ring-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:ring-1 hover:ring-blue-200"
                            }`}
                            onClick={() => setSelectedColor(color)}
                          >
                            {color.name || color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Size
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, index) => (
                          <button
                            key={index}
                            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none cursor-pointer ${
                              selectedSize === size
                                ? "bg-blue-600 text-white border border-blue-700 shadow-md ring-2 ring-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:ring-1 hover:ring-blue-200"
                            }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size.name || size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Quantity
                    </h3>
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1 w-fit shadow-sm">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center cursor-pointer"
                        aria-label="Decrease quantity"
                      >
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
                      <div className="w-12 text-center text-sm font-medium bg-blue-50 rounded mx-1 py-1.5 border border-blue-100">
                        {quantity}
                      </div>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center cursor-pointer"
                        aria-label="Increase quantity"
                      >
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
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      onClick={addToCart}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center cursor-pointer ${
                        (!product.inStock || isAddingToCart) &&
                        "opacity-50 cursor-not-allowed hover:scale-100"
                      }`}
                      disabled={!product.inStock || isAddingToCart}
                    >
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
                      {isAddingToCart
                        ? "Adding..."
                        : product.inStock
                        ? "Add to Cart"
                        : "Out of Stock"}
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] transform flex items-center justify-center cursor-pointer">
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
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4 shadow-sm ring-1 ring-blue-200 ring-opacity-50">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          product.inStock ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
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

      {/* 剩余的 JSX 保持不变 */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:ring-1 hover:ring-blue-100">
            <div className="flex flex-wrap border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              {[
                { key: "description", label: "Description" },
                { key: "add-rating", label: "Add Rating" },
                { key: "reviews", label: `Reviews (${product.reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative cursor-pointer ${
                    activeTab === tab.key
                      ? "text-blue-700 bg-white"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === "description" && (
                <AnimatedSection>
                  <div className="prose max-w-none">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Product Overview
                      </h3>
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

              {activeTab === "add-rating" && (
                <AnimatedSection>
                  <div className="max-w-2xl mx-auto py-8">
                    {userId ? (
                      <form
                        onSubmit={handleSubmitReview}
                        className="space-y-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200"
                      >
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-gray-800">
                            Share Your Experience
                          </h3>
                          <p className="text-gray-600 mt-2">
                            How would you rate this product?
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                            Your Rating
                          </label>
                          <div
                            className="flex justify-center space-x-2"
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            {[...Array(5)].map((_, index) => {
                              const ratingValue = index + 1;
                              return (
                                <button
                                  key={ratingValue}
                                  type="button"
                                  className={`text-4xl lg:text-5xl transition-all duration-200 transform hover:scale-125 focus:outline-none cursor-pointer ${
                                    ratingValue <= (hoverRating || userRating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  onClick={() => setUserRating(ratingValue)}
                                  onMouseEnter={() =>
                                    setHoverRating(ratingValue)
                                  }
                                >
                                  ★
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Your Review (Optional)
                          </label>
                          <textarea
                            id="comment"
                            rows="5"
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                            placeholder="Tell us more about what you liked or disliked..."
                          ></textarea>
                        </div>
                        <div className="text-center">
                          <button
                            type="submit"
                            disabled={isSubmittingReview || userRating === 0}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-10 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                          >
                            {isSubmittingReview
                              ? "Submitting..."
                              : "Submit Review"}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-12 px-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200">
                        <div className="text-blue-500 mb-4">
                          <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Login to Leave a Review
                        </h3>
                        <p className="text-gray-600 mb-6">
                          You need to be logged in to share your thoughts about
                          this product.
                        </p>
                        <Link
                          to="/login"
                          className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          Login Now
                        </Link>
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              )}

              {activeTab === "reviews" && (
                <AnimatedSection>
                  <div className="space-y-6">
                    {currentReviews.length > 0 ? (
                      currentReviews.map((review) => (
                        <div
                          key={review.id}
                          className="flex items-start space-x-4 p-5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-medium text-sm">
                              {review.user.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {review.user}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-center my-1">
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
                            <p className="text-gray-700 text-sm leading-relaxed mt-2">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
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
                        <p className="text-gray-500 mb-4">
                          No reviews yet. Be the first to review this product!
                        </p>
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center space-x-4">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>

      {product.relatedProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Products
              </h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer"
              >
                View All
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  imageUrls={relatedProduct.imageUrls}
                  title={relatedProduct.name}
                  price={relatedProduct.price}
                  category={relatedProduct.category.name}
                  rating={relatedProduct.rating}
                  footer={
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          relatedProduct.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {relatedProduct.inStock ? "In Stock" : "Out of Stock"}
                      </span>
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

export default ProductDetailPage;
