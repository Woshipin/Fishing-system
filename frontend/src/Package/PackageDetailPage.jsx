import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import PageHeader from '../components/PageHeader';

const PackageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // 硬编码的包数据
  const hardcodedPackages = {
    '1': {
      id: 1,
      title: 'Premium Fishing Package',
      description: 'Complete fishing experience with high-quality equipment and guided tours. Perfect for both beginners and experienced anglers.',
      price: 299.99,
      category: 'premium',
      rating: 5,
      imageUrls: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500',
        'https://images.unsplash.com/photo-1582805586555-cc67929d8bbf?w=500'
      ],
      inStock: true,
    },
    '2': {
      id: 2,
      title: 'Basic Fishing Starter Kit',
      description: 'Essential fishing gear for beginners. Includes all the basic equipment you need to start your fishing journey.',
      price: 99.99,
      category: 'basic',
      rating: 4,
      imageUrls: [
        'https://images.unsplash.com/photo-1572392640988-ba48d1a74457?w=500',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500'
      ],
      inStock: true,
    },
    '3': {
      id: 3,
      title: 'Family Fishing Adventure',
      description: 'Family-friendly fishing package with equipment for all ages. Great for creating lasting memories with your loved ones.',
      price: 199.99,
      category: 'family',
      rating: 5,
      imageUrls: [
        'https://images.unsplash.com/photo-1510312305653-8ed496efcb1f?w=500',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
      ],
      inStock: true,
    }
  };

  // 硬编码的产品数据
  const hardcodedProducts = {
    '1': [
      {
        id: 101,
        name: 'Professional Fishing Rod',
        description: 'High-quality carbon fiber fishing rod with excellent sensitivity and durability.',
        price: 89.99,
        category: 'Equipment',
        isActive: true,
        rating: 5,
        imageUrls: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300']
      },
      {
        id: 102,
        name: 'Premium Tackle Box',
        description: 'Complete tackle box with various lures, hooks, and fishing accessories.',
        price: 45.99,
        category: 'Accessories',
        isActive: true,
        rating: 4,
        imageUrls: ['https://images.unsplash.com/photo-1572392640988-ba48d1a74457?w=300']
      },
      {
        id: 103,
        name: 'Fishing Guide Service',
        description: 'Professional fishing guide for 4 hours to help you find the best spots.',
        price: 120.00,
        category: 'Service',
        isActive: true,
        rating: 5,
        imageUrls: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300']
      }
    ],
    '2': [
      {
        id: 201,
        name: 'Basic Fishing Rod',
        description: 'Starter fishing rod perfect for beginners learning to fish.',
        price: 29.99,
        category: 'Equipment',
        isActive: true,
        rating: 4,
        imageUrls: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300']
      },
      {
        id: 202,
        name: 'Basic Tackle Set',
        description: 'Essential tackle set with hooks, sinkers, and basic lures.',
        price: 19.99,
        category: 'Accessories',
        isActive: true,
        rating: 4,
        imageUrls: ['https://images.unsplash.com/photo-1572392640988-ba48d1a74457?w=300']
      }
    ],
    '3': [
      {
        id: 301,
        name: 'Family Rod Set (4 rods)',
        description: 'Set of 4 adjustable fishing rods suitable for different ages.',
        price: 79.99,
        category: 'Equipment',
        isActive: true,
        rating: 5,
        imageUrls: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300']
      },
      {
        id: 302,
        name: 'Family Picnic Kit',
        description: 'Complete picnic set to enjoy meals during your fishing trip.',
        price: 35.99,
        category: 'Accessories',
        isActive: true,
        rating: 4,
        imageUrls: ['https://images.unsplash.com/photo-1572392640988-ba48d1a74457?w=300']
      }
    ]
  };

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        setLoading(true);
        
        // 模拟 API 调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 检查硬编码数据中是否存在该包
        const packageExists = hardcodedPackages[id];
        if (!packageExists) {
          throw new Error('Package not found');
        }

        // 设置包数据
        setPackageData(hardcodedPackages[id]);
        
        // 设置产品数据
        setProducts(hardcodedProducts[id] || []);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching package details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPackageDetail();
    }
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      // 模拟添加到购物车的API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该调用实际的添加到购物车API
      // const response = await fetch('/api/cart/add-package', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ packageId: id })
      // });
      
      alert('Package added to cart successfully!');
    } catch (err) {
      alert('Failed to add package to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const renderStars = (count) => {
    return Array(5).fill(0).map((_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < count ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'
        }`}
        style={{
          filter: index < count ? 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.5))' : 'none'
        }}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-blue-200 shadow-2xl"
             style={{
               boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(59, 130, 246, 0.3)'
             }}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
               style={{
                 filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))'
               }}></div>
          <p className="text-gray-600 font-medium">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-red-200 shadow-2xl"
             style={{
               boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(239, 68, 68, 0.3)'
             }}>
          <div className="text-red-500 text-6xl mb-4 animate-pulse">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/packages')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 border border-blue-300 shadow-lg"
            style={{
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39), 0 0 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100">
      <PageHeader 
        title={packageData.title}
        subtitle="Package Details"
        backgroundImage="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Package Images */}
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-2xl"
                   style={{
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(59, 130, 246, 0.3)',
                     borderColor: 'rgba(59, 130, 246, 0.4)'
                   }}>
                <img
                  src={packageData.imageUrls[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'}
                  alt={packageData.title}
                  className="w-full h-96 object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              {packageData.imageUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {packageData.imageUrls.slice(1).map((url, index) => (
                    <div key={index} 
                         className="rounded-xl overflow-hidden border-2 border-blue-200 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                         style={{
                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 0 12px rgba(59, 130, 246, 0.2)',
                           borderColor: 'rgba(59, 130, 246, 0.3)'
                         }}>
                      <img
                        src={url}
                        alt={`${packageData.title} ${index + 2}`}
                        className="w-full h-24 object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Package Info */}
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-200 shadow-2xl"
                   style={{
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 25px rgba(59, 130, 246, 0.3)',
                     borderColor: 'rgba(59, 130, 246, 0.4)'
                   }}>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                  {packageData.title}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center bg-amber-50 px-3 py-2 rounded-xl border border-amber-200"
                       style={{
                         boxShadow: '0 0 10px rgba(251, 191, 36, 0.2)'
                       }}>
                    {renderStars(packageData.rating)}
                    <span className="text-gray-700 ml-2 font-medium">({packageData.rating}/5)</span>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 rounded-xl text-sm font-semibold capitalize border border-blue-200"
                        style={{
                          boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
                        }}>
                    {packageData.category}
                  </span>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-8 font-medium">
                  {packageData.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    ${packageData.price}
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                    packageData.inStock 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200' 
                      : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200'
                  }`}
                       style={{
                         boxShadow: packageData.inStock 
                           ? '0 0 15px rgba(34, 197, 94, 0.3)' 
                           : '0 0 15px rgba(239, 68, 68, 0.3)'
                       }}>
                    {packageData.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!packageData.inStock || addingToCart}
                  className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 border-2 ${
                    packageData.inStock && !addingToCart
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 border-blue-300'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
                  }`}
                  style={packageData.inStock && !addingToCart ? {
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.3)'
                  } : {}}
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"
                           style={{
                             filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'
                           }}></div>
                      Adding to Cart...
                    </div>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Included Products */}
        {products.length > 0 && (
          <AnimatedSection>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border-2 border-blue-200"
                 style={{
                   boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 30px rgba(59, 130, 246, 0.3)',
                   borderColor: 'rgba(59, 130, 246, 0.4)'
                 }}>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8">
                What's Included in This Package
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl"
                    style={{
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 0 15px rgba(59, 130, 246, 0.2)',
                      borderColor: 'rgba(59, 130, 246, 0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 25px rgba(59, 130, 246, 0.4)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-xl overflow-hidden mb-4 border-2 border-blue-100 shadow-lg"
                         style={{
                           boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1), 0 0 10px rgba(59, 130, 246, 0.2)'
                         }}>
                      <img
                        src={product.imageUrls[0] || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300'}
                        alt={product.name}
                        className="w-full h-40 object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-blue-600 font-bold text-xl">
                        ${product.price}
                      </span>
                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200"
                           style={{
                             boxShadow: '0 0 8px rgba(251, 191, 36, 0.2)'
                           }}>
                        {renderStars(product.rating)}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 font-medium"
                         style={{
                           boxShadow: '0 0 5px rgba(156, 163, 175, 0.2)'
                         }}>
                      Category: {product.category}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default PackageDetailPage;