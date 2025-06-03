import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import PackageCard from '../components/PackageCard';
import PageHeader from '../components/PageHeader';

const PackagePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 基础图片URL - 根据你的后端设置调整
  const BASE_IMAGE_URL = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        
        // 处理数据，确保图片URL格式正确，支持多图片
        const processedData = data.map(pkg => {
          let imageUrls = [];
          
          // 处理多种可能的图片数据格式
          if (pkg.images && Array.isArray(pkg.images)) {
            // 如果有 images 数组（类似 products）
            imageUrls = pkg.images.map(img => {
              if (img.image_path) {
                // 确保不重复添加路径
                const imagePath = img.image_path.startsWith('packages/') 
                  ? img.image_path 
                  : `packages/images/${img.image_path}`;
                return `${BASE_IMAGE_URL}${imagePath}`;
              } else if (typeof img === 'string') {
                const imagePath = img.startsWith('packages/') 
                  ? img 
                  : `packages/images/${img}`;
                return `${BASE_IMAGE_URL}${imagePath}`;
              }
              return '';
            }).filter(url => url); // 过滤空URL
          } else if (pkg.image) {
            // 如果只有单个 image 字段
            if (pkg.image.startsWith('http')) {
              imageUrls = [pkg.image];
            } else {
              const imagePath = pkg.image.startsWith('packages/') 
                ? pkg.image 
                : `packages/images/${pkg.image}`;
              imageUrls = [`${BASE_IMAGE_URL}${imagePath}`];
            }
          } else if (pkg.imageUrl) {
            // 如果有 imageUrl 字段
            if (pkg.imageUrl.startsWith('http')) {
              imageUrls = [pkg.imageUrl];
            } else {
              const imagePath = pkg.imageUrl.startsWith('packages/') 
                ? pkg.imageUrl 
                : `packages/images/${pkg.imageUrl}`;
              imageUrls = [`${BASE_IMAGE_URL}${imagePath}`];
            }
          }
          
          // 如果没有图片，使用默认图片
          if (imageUrls.length === 0) {
            imageUrls = [`${BASE_IMAGE_URL}packages/images/default-package.png`];
          }
          
          return {
            id: pkg.id,
            title: pkg.title || pkg.name,
            description: pkg.description,
            price: parseFloat(pkg.price) || 0,
            category: pkg.category || 'general',
            rating: parseInt(pkg.rating, 10) || Math.floor(Math.random() * 5) + 1,
            imageUrls: imageUrls,
            inStock: pkg.inStock !== false && pkg.is_active !== false, // 默认为true
          };
        });
        
        setPackages(processedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const categories = [
    { id: 'all', name: 'All Packages', icon: '🌟' },
    { id: 'individual', name: 'Individual', icon: '👤' },
    { id: 'business', name: 'Business', icon: '🏢' },
    { id: 'enterprise', name: 'Enterprise', icon: '🏭' },
    { id: 'general', name: 'General', icon: '📦' },
  ];

  const filteredPackages =
    selectedCategory === 'all'
      ? packages
      : packages.filter((pkg) => pkg.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-red-100 p-10 max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Packages</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Hero Section */}
      <PageHeader
        title="Our Packages"
        description="Choose the perfect package that suits your needs and budget. All packages come with our exceptional customer support."
      />

      {/* Category Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-y border-blue-100 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-md'
                }`}
                style={{
                  boxShadow:
                    hoveredCategory === category.id ? '0 0 20px rgba(59, 130, 246, 0.5)' : '',
                }}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <span className="ml-1 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full">
                    {filteredPackages.length}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-3">
            <p className="text-gray-600 text-sm md:text-base">
              Showing {filteredPackages.length} packages out of {packages.length} total
            </p>
          </div>

          <AnimatedSection
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            direction="up"
          >
            {filteredPackages.map((packageItem, index) => (
              <motion.div
                key={packageItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
                }}
              >
                <PackageCard
                  title={packageItem.title}
                  description={packageItem.description}
                  imageUrls={packageItem.imageUrls} // 传递图片数组
                  buttonLink={`/packages/${packageItem.id}`}
                  category={packageItem.category}
                  price={packageItem.price}
                  rating={packageItem.rating}
                  inStock={packageItem.inStock}
                />
              </motion.div>
            ))}
          </AnimatedSection>

          {/* Empty state display */}
          {filteredPackages.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100 p-10 max-w-md mx-auto">
                <div className="text-blue-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Packages Found</h3>
                <p className="text-gray-600 mb-6">We couldn't find any packages in this category.</p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                >
                  View All Packages
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Decorative element - bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-100/50 to-transparent z-0"></div>
    </div>
  );
};

export default PackagePage;