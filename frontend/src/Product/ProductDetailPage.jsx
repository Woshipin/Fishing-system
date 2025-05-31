import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card";

const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";
const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          setProduct(null);
          return;
        }
        const data = await response.json();

        const formattedProduct = {
          id: data.id,
          name: data.name || "Unnamed Product",
          description: data.description || "No description available.",
          longDescription: data.long_description || data.description || "No detailed description available.",
          price: parseFloat(data.price) || 0,
          discountPrice: data.discount_price ? parseFloat(data.discount_price) : 0, 
          category: data.category ? data.category.name : "Uncategorized",
          rating: parseInt(data.rating, 10) || 0,
          reviewCount: data.reviews_count || (data.reviews ? data.reviews.length : 0),
          images: data.images && data.images.length > 0 
            ? data.images.map(img => `${BASE_IMAGE_URL}${img.image_path}`)
            : [DEFAULT_IMAGE_URL],
          colors: data.colors || [],
          sizes: data.sizes || [],
          inStock: !!data.is_active,
          featured: !!data.featured,
          specifications: data.specifications && data.specifications.length > 0 
            ? data.specifications.map(spec => ({ name: spec.name, value: spec.value })) 
            : [],
          reviews: data.reviews && data.reviews.length > 0 
            ? data.reviews.map(review => ({
                id: review.id,
                user: review.user ? review.user.name : "Anonymous",
                rating: parseInt(review.rating, 10) || 0,
                date: review.created_at ? new Date(review.created_at).toLocaleDateString() : "N/A",
                comment: review.comment || "",
              }))
            : [],
          relatedProducts: data.related_products && data.related_products.length > 0 
            ? data.related_products.map(rp => ({
                id: rp.id,
                name: rp.name || "Related Product",
                price: parseFloat(rp.price) || 0,
                imageUrls: rp.images && rp.images.length > 0 
                  ? rp.images.map(img => `${BASE_IMAGE_URL}${img.image_path}`) 
                  : [DEFAULT_IMAGE_URL],
                imageUrl: rp.images && rp.images.length > 0 
                  ? `${BASE_IMAGE_URL}${rp.images[0].image_path}` 
                  : DEFAULT_IMAGE_URL,
                category: rp.category ? rp.category.name : "Uncategorized",
                rating: parseInt(rp.rating, 10) || 0,
                inStock: !!rp.is_active,
              })) 
            : [],
        };
        
        // 设置默认选中的颜色和尺寸
        if (formattedProduct.colors.length > 0) {
          setSelectedColor(formattedProduct.colors[0]);
        }
        if (formattedProduct.sizes.length > 0) {
          setSelectedSize(formattedProduct.sizes[0]);
        }
        
        setProduct(formattedProduct);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details. Please try again later.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = DEFAULT_IMAGE_URL;
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-medium text-gray-700">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-200 max-w-md w-full mx-4">
          <div className="text-5xl mb-4 text-red-500">⚠️</div>
          <div className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Product</div>
          <div className="text-gray-600 mb-6">{error}</div>
          <Link 
            to="/products" 
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
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
          <div className="text-xl font-semibold text-gray-800 mb-4">Product Not Found</div>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/products" 
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* Enhanced Breadcrumb */}
      <section className="py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <Link to="/products" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-300 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-sm text-blue-600 font-medium truncate max-w-xs">
                    {product?.name || 'Product Details'}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Enhanced Product Detail */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Enhanced Product Images */}
            <AnimatedSection direction="left" className="space-y-6">
              <div className="group relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:ring-2 hover:ring-blue-100">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={product.images && product.images.length > 0 ? product.images[selectedImage] : DEFAULT_IMAGE_URL}
                  alt={`${product.name || 'Product'} - Image ${selectedImage + 1}`}
                  className="w-full h-80 lg:h-[500px] object-contain p-6 transition-all duration-500 group-hover:scale-105 relative z-10"
                  onError={handleImageError}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              
              {product.images && product.images.length > 1 && (
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
                        src={image || DEFAULT_IMAGE_URL}
                        alt={`${product.name || 'Product'} - Thumbnail ${index + 1}`}
                        className="w-full h-16 lg:h-20 object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>

            {/* Enhanced Product Info */}
            <AnimatedSection direction="right" className="space-y-6 lg:space-y-8">
              {/* 添加了背景、阴影和发光边框的容器 */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 ring-1 ring-blue-200 ring-opacity-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name || "Product Name Not Available"}
                  </h1>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < (product.rating || 0) ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
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
                      <span className="font-medium">SKU:</span> PRD-{product.id.toString().padStart(4, '0')}
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-3 mt-2">
                    {(product.discountPrice && product.price && product.discountPrice < product.price) ? (
                      <>
                        <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                          ${(product.discountPrice || 0).toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${(product.price || 0).toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium">
                          {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl lg:text-3xl font-bold text-blue-600">
                        ${(product.price || 0).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-3">
                    {product.description || "No description available."}
                  </p>
                </div>

                <div className="space-y-6 mt-6">
                  {/* Enhanced Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, index) => {
                          const colorName = typeof color === 'string' ? color : color.name || 'N/A';
                          return (
                            <button
                              key={index}
                              className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none ${
                                selectedColor === color
                                  ? "bg-blue-600 text-white border border-blue-700 shadow-md ring-2 ring-blue-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:ring-1 hover:ring-blue-200"
                              }`}
                              onClick={() => setSelectedColor(color)}
                            >
                              {colorName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, index) => {
                          const sizeName = typeof size === 'string' ? size : size.name || 'N/A';
                          return (
                            <button
                              key={index}
                              className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none ${
                                selectedSize === size
                                  ? "bg-blue-600 text-white border border-blue-700 shadow-md ring-2 ring-blue-200"
                                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:ring-1 hover:ring-blue-200"
                              }`}
                              onClick={() => setSelectedSize(size)}
                            >
                              {sizeName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Quantity - Clear Design */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Quantity</h3>
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1 w-fit shadow-sm">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center"
                        aria-label="Decrease quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <div className="w-12 text-center text-sm font-medium bg-blue-50 rounded mx-1 py-1.5 border border-blue-100">
                        {quantity}
                      </div>
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center"
                        aria-label="Increase quantity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <button
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform flex items-center justify-center ${
                        !product.inStock && "opacity-50 cursor-not-allowed hover:scale-100"
                      }`}
                      disabled={!product.inStock}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02] transform flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Wishlist
                    </button>
                  </div>

                  {/* Enhanced Stock Status with Glow Effect */}
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4 shadow-sm ring-1 ring-blue-200 ring-opacity-50">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
                      <span className={`text-sm font-medium ${product.inStock ? "text-green-700" : "text-red-700"}`}>
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

      {/* Enhanced Product Tabs with Glow Effect */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:ring-1 hover:ring-blue-100">
            <div className="flex flex-wrap border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-4 text-sm font-medium transition-all duration-200 relative ${
                    activeTab === tab
                      ? "text-blue-700 bg-white"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "reviews" && ` (${product.reviews.length})`}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === "description" && (
                <AnimatedSection>
                  <div className="prose max-w-none">
                    <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">Product Overview</h3>
                      {product.longDescription
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <p key={index} className="mb-3 text-gray-700 text-sm lg:text-base leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {activeTab === "specifications" && (
                <AnimatedSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 px-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50"
                      >
                        <span className="font-medium text-gray-900 text-sm">{spec.name}</span>
                        <span className="text-blue-700 font-medium text-sm">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              )}

              {activeTab === "reviews" && (
                <AnimatedSection>
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm ring-1 ring-blue-200 ring-opacity-50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-white font-medium text-sm">
                                {review.user.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 text-sm">{review.user}</h3>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "text-yellow-400" : "text-gray-200"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed ml-13">{review.comment}</p>
                      </div>
                    ))}

                    {/* Enhanced Review Form */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <h3 className="text-lg font-semibold mb-6 text-gray-900">Write a Review</h3>
                      <form className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="text-2xl focus:outline-none transition-colors duration-200 text-gray-300 hover:text-yellow-400"
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ring-1 ring-blue-200 ring-opacity-50"
                            placeholder="Share your experience with this product..."
                          ></textarea>
                        </div>
                        <button 
                          type="submit" 
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transform"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
              <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Card 
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  imageUrl={relatedProduct.imageUrl}
                  category={relatedProduct.category}
                  rating={relatedProduct.rating}
                  inStock={relatedProduct.inStock}
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