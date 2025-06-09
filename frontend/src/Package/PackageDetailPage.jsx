import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

const DEFAULT_IMAGE_URL = "/assets/About/about-us.png";

const PackageDetailPage = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    console.log("User ID:", storedUserId);
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.warn(
        "Image path is null or empty, using default fallback image."
      );
      return DEFAULT_IMAGE_URL;
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    if (imagePath.startsWith("/storage")) {
      return `http://127.0.0.1:8000${imagePath}`;
    }

    if (imagePath.startsWith("storage")) {
      return `http://127.0.0.1:8000/${imagePath}`;
    }

    return `http://127.0.0.1:8000/storage/${imagePath}`;
  };

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://127.0.0.1:8000/api/packages/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched package data:", data);

        if (data.imageUrls && Array.isArray(data.imageUrls)) {
          data.imageUrls = data.imageUrls
            .map((url) => {
              const fullUrl = getImageUrl(url);
              console.log("Constructed image URL:", fullUrl);
              return fullUrl;
            })
            .filter((url) => url);
        }

        if (data.products && Array.isArray(data.products)) {
          data.products = data.products.map((product) => {
            let imageUrls = product.imageUrls || [];

            if (
              product.imageUrls &&
              Array.isArray(product.imageUrls) &&
              product.imageUrls.length > 0
            ) {
              imageUrls = product.imageUrls
                .map((url) => {
                  const fullUrl = getImageUrl(url);
                  console.log("Constructed product image URL:", fullUrl);
                  return fullUrl;
                })
                .filter((url) => url);
            } else if (product.image_url) {
              const fullUrl = getImageUrl(product.image_url);
              console.log(
                "Constructed product image URL from image_url:",
                fullUrl
              );
              imageUrls = [fullUrl];
            } else if (product.image) {
              const fullUrl = getImageUrl(product.image);
              console.log("Constructed product image URL from image:", fullUrl);
              imageUrls = [fullUrl];
            }

            if (imageUrls.length === 0) {
              imageUrls = [DEFAULT_IMAGE_URL];
            }

            return {
              ...product,
              imageUrls: imageUrls,
            };
          });
        }

        setPackageData(data);
      } catch (err) {
        console.error("Error fetching package details:", err);
        setError("Failed to fetch package details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageDetail();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!packageData?.inStock || !userId) {
      alert("You need to be logged in to add packages to the cart.");
      return;
    }

    setAddingToCart(true);
    try {
      const payload = {
        user_id: userId,
        package_id: packageData.id,
        name: packageData.title,
        image: packageData.imageUrls[0],
        category_id: packageData.category_id, // Ensure category_id is included
        quantity: 1,
        price: parseFloat(packageData.price),
        features: packageData.features || [],
      };

      console.log("Add to Cart Data:", payload); // Log the payload data

      const response = await fetch("http://127.0.0.1:8000/api/cart/package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Package added to cart successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add to cart:", errorData);
        alert(
          errorData.message ||
            "Failed to add package to cart. Please try again."
        );
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add package to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return Array(5)
      .fill(0)
      .map((_, index) => {
        let starClass = "text-gray-300";
        if (index < fullStars) {
          starClass = "text-amber-400";
        } else if (index === fullStars && hasHalfStar) {
          starClass = "text-amber-400";
        }

        return (
          <span
            key={index}
            className={`text-lg ${starClass}`}
            style={{
              filter:
                index < fullStars || (index === fullStars && hasHalfStar)
                  ? "drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))"
                  : "none",
              textShadow:
                index < fullStars || (index === fullStars && hasHalfStar)
                  ? "0 0 8px rgba(251, 191, 36, 0.5)"
                  : "none",
            }}
          >
            {index === fullStars && hasHalfStar ? "☆" : "★"}
          </span>
        );
      });
  };

  const ImageWithFallback = ({ src, alt, className, ...props }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;

      setImageSrc(src);
      setHasError(false);
      setIsLoading(!!src && src !== DEFAULT_IMAGE_URL);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (src && src !== DEFAULT_IMAGE_URL) {
        timeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && isLoading) {
            console.warn("Image load timeout:", src);
            setHasError(true);
            setIsLoading(false);
          }
        }, 5000);
      }

      return () => {
        isMountedRef.current = false;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [src]);

    const handleImageError = () => {
      if (!isMountedRef.current) return;
      console.log("Image failed to load:", src);
      setHasError(true);
      setIsLoading(false);
    };

    const handleImageLoad = () => {
      if (!isMountedRef.current) return;
      setIsLoading(false);
      setHasError(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const displaySrc = hasError || !imageSrc ? DEFAULT_IMAGE_URL : imageSrc;

    return (
      <div className="relative">
        {isLoading && (
          <div
            className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0 z-10`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        <img
          src={displaySrc}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          {...props}
        />
      </div>
    );
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
    boxShadow:
      "0 8px 32px rgba(59, 130, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
  };

  const glowStyle = {
    boxShadow:
      "0 20px 40px rgba(59, 130, 246, 0.3), 0 0 30px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          className="text-center p-8 rounded-3xl bg-white/90 backdrop-blur-xl border shadow-2xl max-w-md w-full"
          style={glowStyle}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"
              style={{
                filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))",
              }}
            ></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 blur-xl animate-pulse"></div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">
            Loading package details...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          className="text-center p-8 rounded-3xl bg-white/90 backdrop-blur-xl border shadow-2xl max-w-md w-full"
          style={{
            ...glowStyle,
            border: "1px solid rgba(239, 68, 68, 0.4)",
            boxShadow:
              "0 20px 40px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.2)",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Package
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105"
            style={buttonStyle}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!packageData) return null;

  const products = packageData.products || [];
  const imageUrls = packageData.imageUrls || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white py-12 md:py-20"
        style={{
          boxShadow:
            "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 -1px 0 rgba(255, 255, 255, 0.1)",
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-cyan-600/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            style={{
              textShadow:
                "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.2)",
            }}
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
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="space-y-4">
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              style={glowStyle}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {imageUrls.length > 0 ? (
                <ImageWithFallback
                  src={imageUrls[selectedImageIndex]}
                  alt={packageData.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
              ) : (
                <ImageWithFallback
                  src={DEFAULT_IMAGE_URL}
                  alt={packageData.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>

            {imageUrls.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {imageUrls.map((url, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? "border-blue-400 shadow-lg"
                        : "border-blue-200 hover:border-blue-300"
                    }`}
                    style={{
                      boxShadow:
                        selectedImageIndex === index
                          ? "0 0 20px rgba(59, 130, 246, 0.5)"
                          : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ImageWithFallback
                      src={url}
                      alt={`${packageData.title} ${index + 1}`}
                      className="w-full h-16 md:h-20 object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              className="rounded-3xl p-6 md:p-8"
              style={glowStyle}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div
                    className="flex items-center bg-amber-50 px-3 py-2 rounded-xl border border-amber-200"
                    style={{ boxShadow: "0 0 15px rgba(251, 191, 36, 0.3)" }}
                  >
                    {renderStars(packageData.rating)}
                    <span className="text-gray-700 ml-2 font-medium">
                      ({packageData.rating}/5)
                    </span>
                  </div>
                </div>
                <span
                  className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-xl text-sm font-semibold capitalize border border-blue-200"
                  style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)" }}
                >
                  {packageData.category}
                </span>
              </div>

              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8">
                {packageData.description}
              </p>

              {packageData.features && packageData.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Package Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {packageData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200"
                        style={{
                          boxShadow: "0 0 10px rgba(59, 130, 246, 0.1)",
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div
                          className="w-2 h-2 bg-blue-600 rounded-full mr-3"
                          style={{
                            boxShadow: "0 0 8px rgba(59, 130, 246, 0.6)",
                          }}
                        ></div>
                        <span className="font-medium text-gray-900">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ${parseFloat(packageData.price).toFixed(2)}
                    </span>
                    {packageData.originalPrice &&
                      packageData.originalPrice > packageData.price && (
                        <span className="text-xl text-gray-500 line-through">
                          ${parseFloat(packageData.originalPrice).toFixed(2)}
                        </span>
                      )}
                  </div>
                  {packageData.originalPrice &&
                    packageData.originalPrice > packageData.price && (
                      <span className="text-green-600 font-semibold text-sm">
                        Save $
                        {(
                          parseFloat(packageData.originalPrice) -
                          parseFloat(packageData.price)
                        ).toFixed(2)}
                      </span>
                    )}
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                    packageData.inStock
                      ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                      : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200"
                  }`}
                  style={{
                    boxShadow: packageData.inStock
                      ? "0 0 20px rgba(34, 197, 94, 0.3)"
                      : "0 0 20px rgba(239, 68, 68, 0.3)",
                  }}
                >
                  {packageData.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl p-6 md:p-10 mb-12"
          style={glowStyle}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8 text-center">
            What's Included in This Package ({products.length} Products)
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300"
                  style={{
                    boxShadow:
                      "0 8px 32px rgba(59, 130, 246, 0.15), 0 0 20px rgba(6, 182, 212, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 40px rgba(59, 130, 246, 0.25), 0 0 30px rgba(6, 182, 212, 0.2)",
                  }}
                >
                  <div
                    className="rounded-xl overflow-hidden mb-4 border-2 border-blue-100"
                    style={{ boxShadow: "0 8px 20px rgba(59, 130, 246, 0.15)" }}
                  >
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <ImageWithFallback
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-full h-32 md:h-40 object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-32 md:h-40 flex items-center justify-center bg-gray-200 text-gray-500">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🛍️</div>
                          <div className="text-xs">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2 text-lg">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-blue-600 font-bold text-xl">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <div
                      className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                      style={{ boxShadow: "0 0 10px rgba(251, 191, 36, 0.2)" }}
                    >
                      {renderStars(product.rating)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 font-medium"
                      style={{ boxShadow: "0 0 8px rgba(156, 163, 175, 0.15)" }}
                    >
                      {product.category || "Uncategorized"}
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        product.is_active && product.stock > 0
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {product.is_active && product.stock > 0
                        ? `Stock: ${product.stock}`
                        : "Out of Stock"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500">
                This package doesn't contain any products yet.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.button
            onClick={handleAddToCart}
            disabled={!packageData.inStock || addingToCart}
            className={`px-8 md:px-12 py-4 md:py-5 rounded-3xl font-bold text-lg md:text-xl transition-all duration-300 border-2 ${
              packageData.inStock && !addingToCart
                ? "text-white transform hover:scale-105"
                : "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
            }`}
            style={packageData.inStock && !addingToCart ? buttonStyle : {}}
            whileHover={
              packageData.inStock && !addingToCart ? { scale: 1.05 } : {}
            }
            whileTap={
              packageData.inStock && !addingToCart ? { scale: 0.95 } : {}
            }
          >
            <AnimatePresence mode="wait">
              {addingToCart ? (
                <motion.div
                  key="loading"
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
                    }}
                  ></div>
                  Adding to Cart...
                </motion.div>
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  🛒 Add Entire Package to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <p className="text-gray-600 mt-4 text-sm md:text-base">
            Get all {products.length} products in one convenient package
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
