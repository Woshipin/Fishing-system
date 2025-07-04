// src/pages/HomePage.js

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// 确保这些组件的路径相对于您的项目结构是正确的
import AnimatedSection from "../components/AnimatedSection";
import CTA from "../components/CTA";
import Card from "../components/Card";

const HomePage = () => {
  // --- 状态管理 ---
  const [scrollY, setScrollY] = useState(0);
  const [cmsData, setCmsData] = useState(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API 配置 ---
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  // --- 数据获取的副作用 ---
  useEffect(() => {
    // 处理滚动以实现视差效果
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cmsResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/fishing-cms`),
          fetch(`${API_BASE_URL}/products/popular`),
        ]);

        if (!cmsResponse.ok)
          throw new Error(
            `CMS data could not be loaded (status: ${cmsResponse.status})`
          );
        if (!productsResponse.ok)
          throw new Error(
            `Popular products could not be loaded (status: ${productsResponse.status})`
          );

        const cmsResult = await cmsResponse.json();
        const productsResult = await productsResponse.json();

        setCmsData(cmsResult.cms);
        setPopularProducts(productsResult.data || []);
      } catch (err) {
        setError(err.message);
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 组件卸载时清理监听器
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 辅助函数：获取带回退值的显示数据 ---
  const getDisplayData = () => {
    const defaults = {
      hero_title: "探索深海的奇遇",
      hero_subtitle: "我们提供高品质的渔具和服务，助您征服每一片水域。",
      about_title: "我们的故事",
      about_description:
        "我们是一群充满热情的钓鱼爱好者，致力于为钓鱼社区提供最优质的产品和体验。",
      about_mission:
        "我们的使命是通过创新的工具和对户外运动的热情，为每一位垂钓者赋能。",
      products_title: "🎣 本季热门渔具",
      products_subtitle: "探索我们最受欢迎的渔具，深受数百名垂钓者的信赖。",
      view_all_products_text: "🌊 查看所有装备",
    };

    if (!cmsData) return defaults;

    return {
      hero_title: cmsData.home_title || defaults.hero_title,
      hero_subtitle: cmsData.home_description || defaults.hero_subtitle,
      about_title: cmsData.about_us_title || defaults.about_title,
      about_description:
        cmsData.about_us_description || defaults.about_description,
      about_mission: cmsData.about_mission || defaults.about_mission,
      products_title: cmsData.products_title || defaults.products_title,
      products_subtitle:
        cmsData.products_subtitle || defaults.products_subtitle,
      view_all_products_text:
        cmsData.view_all_products_text || defaults.view_all_products_text,
    };
  };

  const displayData = getDisplayData();

  // --- 渲染逻辑 ---

  // 1. 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-800 text-white">
        <div className="text-xl animate-pulse">正在撒网捕捞数据...</div>
      </div>
    );
  }

  // 2. 错误状态
  if (error && !cmsData && popularProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-rose-50 text-rose-700 p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">糟糕！出现了一些问题。</h2>
        <p className="max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  // 3. 正常渲染
  return (
    <>
      {/* ====================================================================== */}
      {/* ==================== 3D OCEAN BACKGROUND & HERO ====================== */}
      {/* ====================================================================== */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-blue-900 to-indigo-950"></div>
        <div className="absolute inset-0">
          <div
            className="ocean-layer deep-ocean"
            style={{
              transform: `translateY(${scrollY * 0.1}px) scale(${
                1 + scrollY * 0.0002
              })`,
            }}
          ></div>
          <div
            className="ocean-layer mid-ocean"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          ></div>
          <div
            className="ocean-layer surface-ocean"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          ></div>
        </div>
        <div className="absolute inset-0">
          <div
            className="wave-3d wave-primary"
            style={{
              transform: `translateX(${-100 + scrollY * 0.08}%) rotateX(${
                5 + scrollY * 0.005
              }deg)`,
            }}
          ></div>
          <div
            className="wave-3d wave-secondary"
            style={{
              transform: `translateX(${-120 + scrollY * 0.12}%) rotateX(${
                -3 + scrollY * 0.003
              }deg)`,
            }}
          ></div>
          <div
            className="wave-3d wave-tertiary"
            style={{
              transform: `translateX(${-80 + scrollY * 0.06}%) rotateX(${
                2 + scrollY * 0.004
              }deg)`,
            }}
          ></div>
        </div>
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="bubble-3d"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
                width: `${4 + Math.random() * 12}px`,
                height: `${4 + Math.random() * 12}px`,
                transform: `translateY(${
                  scrollY * (0.05 + Math.random() * 0.15)
                }px)`,
              }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => {
            const fishTypes = ["🐠", "🐡", "🐟", "🐙", "🦈"];
            const fishType = fishTypes[i % fishTypes.length];
            const fishSize = 18 + Math.random() * 12;
            const depth = Math.random();
            return (
              <div
                key={i}
                className="marine-life fish-3d"
                style={{
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${Math.random() * 12}s`,
                  animationDuration: `${10 + Math.random() * 8}s`,
                  fontSize: `${fishSize}px`,
                  transform: `translateY(${scrollY * (0.03 + depth * 0.08)}px)`,
                  zIndex: Math.floor(depth * 10),
                  filter: `hue-rotate(${
                    Math.random() * 180
                  }deg) drop-shadow(0 0 ${
                    8 + depth * 12
                  }px rgba(255, 255, 255, ${0.3 + depth * 0.4})) blur(${
                    (1 - depth) * 0.5
                  }px)`,
                }}
              >
                {fishType}
              </div>
            );
          })}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="jellyfish-3d"
              style={{
                left: `${10 + i * 15 + Math.random() * 10}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 6}s`,
                transform: `translateY(${scrollY * 0.04}px)`,
              }}
            >
              🎐
            </div>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="seaweed-3d"
              style={{
                left: `${i * 5 + Math.random() * 4}%`,
                height: `${30 + Math.random() * 50}px`,
                width: `${3 + Math.random() * 3}px`,
                animationDelay: `${Math.random() * 4}s`,
                transform: `translateY(${scrollY * 0.08}px) rotateZ(${
                  scrollY * 0.01 + Math.sin(Date.now() * 0.001 + i) * 3
                }deg)`,
              }}
            ></div>
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="coral-3d"
              style={{
                left: `${i * 8 + Math.random() * 6}%`,
                transform: `translateY(${scrollY * 0.06}px) scale(${
                  0.7 + Math.random() * 0.6
                })`,
              }}
            ></div>
          ))}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="sand-particle"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}px`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="light-ray-3d"
              style={{
                left: `${15 + i * 20}%`,
                transform: `rotateZ(${10 + i * 5 + scrollY * 0.01}deg)`,
                animationDelay: `${i * 1.5}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="water-particle-3d"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                transform: `translateY(${
                  scrollY * (0.01 + Math.random() * 0.03)
                }px)`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <section className="relative h-screen flex items-center overflow-hidden z-10">
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {displayData.hero_title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              {displayData.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="btn bg-white text-blue-500 hover:bg-gray-100 rounded-full border-none shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Explore Products
              </a>
              <a
                href="/contact"
                className="btn btn-outline rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx="true">{`
        /* Ocean Layer Backgrounds */
        .ocean-layer {
          position: absolute;
          inset: 0;
          opacity: 0.7;
          will-change: transform;
        }
        .deep-ocean {
          background: radial-gradient(
            ellipse at center bottom,
            rgba(0, 20, 40, 0.8) 0%,
            transparent 70%
          );
          filter: blur(2px);
        }
        .mid-ocean {
          background: radial-gradient(
            ellipse at center,
            rgba(0, 100, 150, 0.6) 20%,
            transparent 80%
          );
          filter: blur(1px);
        }
        .surface-ocean {
          background: linear-gradient(
            to bottom,
            rgba(100, 200, 255, 0.3) 0%,
            transparent 50%
          );
        } /* 3D Wave System */
        .wave-3d {
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          will-change: transform;
          transform-style: preserve-3d;
        }
        .wave-primary {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 25%,
            rgba(173, 216, 230, 0.2) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 100%
          );
          animation: wave-3d-flow 14s ease-in-out infinite;
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }
        .wave-secondary {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(135, 206, 235, 0.2) 30%,
            rgba(255, 255, 255, 0.1) 60%,
            transparent 100%
          );
          animation: wave-3d-flow-alt 18s ease-in-out infinite;
          opacity: 0.8;
        }
        .wave-tertiary {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 150, 200, 0.15) 40%,
            rgba(255, 255, 255, 0.08) 70%,
            transparent 100%
          );
          animation: wave-3d-flow-slow 22s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes wave-3d-flow {
          0%,
          100% {
            transform: translateX(-100%) rotateX(0deg) rotateZ(0deg);
          }
          25% {
            transform: translateX(-75%) rotateX(2deg) rotateZ(1deg);
          }
          50% {
            transform: translateX(-50%) rotateX(-1deg) rotateZ(-1deg);
          }
          75% {
            transform: translateX(-25%) rotateX(1deg) rotateZ(0.5deg);
          }
        }
        @keyframes wave-3d-flow-alt {
          0%,
          100% {
            transform: translateX(-120%) rotateX(1deg) rotateY(0deg);
          }
          50% {
            transform: translateX(0%) rotateX(-2deg) rotateY(1deg);
          }
        }
        @keyframes wave-3d-flow-slow {
          0%,
          100% {
            transform: translateX(-80%) rotateZ(-1deg);
          }
          50% {
            transform: translateX(20%) rotateZ(1deg);
          }
        } /* Enhanced 3D Bubbles */
        .bubble-3d {
          position: absolute;
          bottom: -50px;
          background: radial-gradient(
            circle at 25% 25%,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.6) 30%,
            rgba(173, 216, 230, 0.4) 60%,
            rgba(255, 255, 255, 0.2) 100%
          );
          border-radius: 50%;
          animation: bubble-3d-rise linear infinite;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4),
            inset -2px -2px 4px rgba(255, 255, 255, 0.2),
            inset 2px 2px 4px rgba(0, 100, 150, 0.1);
          will-change: transform;
          transform-style: preserve-3d;
        }
        @keyframes bubble-3d-rise {
          0% {
            bottom: -50px;
            opacity: 0;
            transform: scale(0.3) rotateY(0deg) rotateX(0deg);
          }
          10% {
            opacity: 1;
            transform: scale(0.6) rotateY(45deg) rotateX(10deg);
          }
          50% {
            transform: scale(1) rotateY(180deg) rotateX(-5deg) translateX(20px);
          }
          80% {
            transform: scale(1.2) rotateY(270deg) rotateX(5deg)
              translateX(-15px);
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 120vh;
            opacity: 0;
            transform: scale(1.5) rotateY(360deg) rotateX(0deg) translateX(0px);
          }
        } /* 3D Marine Life */
        .marine-life {
          position: absolute;
          will-change: transform;
          transform-style: preserve-3d;
        }
        .fish-3d {
          animation: fish-3d-swim linear infinite;
          transition: transform 0.3s ease-out;
          z-index: 3;
        }
        @keyframes fish-3d-swim {
          0% {
            left: -120px;
            transform: scaleX(1) rotateY(0deg) rotateZ(0deg);
          }
          15% {
            transform: scaleX(1) rotateY(5deg) rotateZ(-2deg) translateY(-15px);
          }
          30% {
            transform: scaleX(1) rotateY(-5deg) rotateZ(2deg) translateY(10px);
          }
          45% {
            transform: scaleX(1) rotateY(0deg) rotateZ(0deg) translateY(-5px);
          }
          50% {
            transform: scaleX(-1) rotateY(0deg) rotateZ(0deg);
          }
          65% {
            transform: scaleX(-1) rotateY(5deg) rotateZ(2deg) translateY(15px);
          }
          80% {
            transform: scaleX(-1) rotateY(-5deg) rotateZ(-2deg)
              translateY(-10px);
          }
          95% {
            transform: scaleX(-1) rotateY(0deg) rotateZ(0deg) translateY(5px);
          }
          100% {
            left: calc(100% + 120px);
            transform: scaleX(-1) rotateY(0deg) rotateZ(0deg);
          }
        }
        .jellyfish-3d {
          position: absolute;
          font-size: 28px;
          animation: jellyfish-float 8s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
          transform-style: preserve-3d;
        }
        @keyframes jellyfish-float {
          0%,
          100% {
            transform: translateY(0) rotateZ(0deg) rotateX(0deg);
          }
          25% {
            transform: translateY(-20px) rotateZ(3deg) rotateX(2deg);
          }
          50% {
            transform: translateY(-10px) rotateZ(0deg) rotateX(-1deg);
          }
          75% {
            transform: translateY(-30px) rotateZ(-3deg) rotateX(1deg);
          }
        } /* 3D Ocean Floor */
        .seaweed-3d {
          position: absolute;
          bottom: 0;
          background: linear-gradient(
            to top,
            #1a4d3a 0%,
            #2d7a4f 30%,
            #4a9d6f 60%,
            #6bb890 100%
          );
          border-radius: 50% 50% 0 0;
          transform-origin: bottom center;
          animation: seaweed-3d-sway 8s ease-in-out infinite;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2),
            -1px 0 2px rgba(255, 255, 255, 0.1);
          will-change: transform;
          transform-style: preserve-3d;
        }
        @keyframes seaweed-3d-sway {
          0%,
          100% {
            transform: rotateZ(-12deg) rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateZ(-6deg) rotateY(2deg) rotateX(1deg);
          }
          50% {
            transform: rotateZ(0deg) rotateY(0deg) rotateX(-1deg);
          }
          75% {
            transform: rotateZ(8deg) rotateY(-2deg) rotateX(1deg);
          }
        }
        .coral-3d {
          position: absolute;
          bottom: 0;
          width: 35px;
          height: 30px;
          background: linear-gradient(
            135deg,
            #ff6b6b 0%,
            #ff8e8e 25%,
            #ffb3b3 50%,
            #ff9999 75%,
            #ff7777 100%
          );
          border-radius: 20px 20px 0 0;
          box-shadow: 0 0 8px rgba(255, 107, 107, 0.4),
            inset -2px -2px 4px rgba(0, 0, 0, 0.2),
            inset 2px 2px 4px rgba(255, 255, 255, 0.3);
          animation: coral-3d-pulse 12s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .coral-3d::before,
        .coral-3d::after {
          content: "";
          position: absolute;
          bottom: 0;
          width: 18px;
          height: 25px;
          background: inherit;
          border-radius: 15px 15px 0 0;
          box-shadow: inherit;
        }
        .coral-3d::before {
          left: -10px;
          transform: rotate(-20deg);
        }
        .coral-3d::after {
          right: -10px;
          transform: rotate(20deg);
        }
        @keyframes coral-3d-pulse {
          0%,
          100% {
            transform: scale(1) rotateY(0deg);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotateY(5deg);
            filter: hue-rotate(10deg);
          }
        } /* 3D Light Rays */
        .light-ray-3d {
          position: absolute;
          top: -10%;
          width: 120px;
          height: 110%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.15) 20%,
            rgba(173, 216, 230, 0.1) 40%,
            rgba(255, 255, 255, 0.08) 60%,
            transparent 80%
          );
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          animation: light-ray-3d-dance 10s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          will-change: transform;
          transform-style: preserve-3d;
        }
        @keyframes light-ray-3d-dance {
          0%,
          100% {
            opacity: 0.3;
            width: 120px;
            transform: rotateZ(0deg) rotateX(0deg);
          }
          25% {
            opacity: 0.6;
            width: 140px;
            transform: rotateZ(2deg) rotateX(1deg);
          }
          50% {
            opacity: 0.8;
            width: 160px;
            transform: rotateZ(0deg) rotateX(-1deg);
          }
          75% {
            opacity: 0.5;
            width: 130px;
            transform: rotateZ(-2deg) rotateX(0.5deg);
          }
        } /* Enhanced Water Particles */
        .water-particle-3d {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(173, 216, 230, 0.3) 50%,
            transparent 100%
          );
          border-radius: 50%;
          animation: particle-3d-dance 20s linear infinite;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
        }
        @keyframes particle-3d-dance {
          0% {
            transform: translateY(0) translateX(0) rotateZ(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateY(-15px) translateX(10px) rotateZ(90deg);
          }
          50% {
            transform: translateY(-30px) translateX(-10px) rotateZ(180deg);
          }
          75% {
            transform: translateY(-15px) translateX(5px) rotateZ(270deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(0) translateX(0) rotateZ(360deg);
            opacity: 0;
          }
        } /* Sand Particles */
        .sand-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: rgba(255, 218, 185, 0.6);
          border-radius: 50%;
          animation: sand-drift 15s ease-in-out infinite;
        }
        @keyframes sand-drift {
          0%,
          100% {
            transform: translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(20px) scale(1.2);
            opacity: 0.6;
          }
        } /* Performance Optimizations */
        @media (prefers-reduced-motion: no-preference) {
          .ocean-layer,
          .wave-3d,
          .bubble-3d,
          .fish-3d,
          .jellyfish-3d,
          .seaweed-3d,
          .coral-3d,
          .light-ray-3d,
          .water-particle-3d,
          .sand-particle {
            will-change: transform, opacity;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ocean-layer,
          .wave-3d,
          .bubble-3d,
          .fish-3d,
          .jellyfish-3d,
          .seaweed-3d,
          .coral-3d,
          .light-ray-3d,
          .water-particle-3d,
          .sand-particle {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ====================================================================== */}
      {/* =================== FEATURED PRODUCTS SECTION ====================== */}
      {/* ====================================================================== */}
      <section className="py-16 bg-gradient-to-b from-white/90 to-blue-50/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              {displayData.products_title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {displayData.products_subtitle}
            </p>
            <div className="h-1 w-24 bg-blue-500 mx-auto mt-6"></div>
          </AnimatedSection>

          {popularProducts.length > 0 ? (
            <AnimatedSection
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
              direction="up"
            >
              {popularProducts.map((product) => (
                <Card
                  key={product.id}
                  title={product.title}
                  subtitle={product.description}
                  imageUrls={product.imageUrls}
                  price={product.price}
                  category={product.categoryName}
                  rating={product.rating}
                  footer={
                    <>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                          product.inStock
                            ? "bg-teal-300 text-black"
                            : "bg-rose-500 text-black"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <a
                        href={`/products/${product.id}`}
                        className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm cursor-pointer transition-all duration-300 ease-out hover:bg-blue-700 hover:-translate-y-0.5 transform-gpu shadow-sm hover:shadow-lg shadow-blue-500/20"
                      >
                        View Details
                      </a>
                    </>
                  }
                />
              ))}
            </AnimatedSection>
          ) : (
            <div className="text-center text-gray-500 mt-8 py-10 bg-gray-50/50 rounded-lg">
              <p>目前没有热门产品，请稍后再来看看！</p>
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-block px-6 py-3 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {displayData.view_all_products_text}
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* ======================== ABOUT US SECTION ========================== */}
      {/* ====================================================================== */}
      <section className="py-16 bg-gradient-to-br from-blue-50/90 to-white/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-black inline-block relative">
              {displayData.about_title}
              <span className="block h-1 w-32 bg-blue-600 mt-2 mx-auto"></span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white/60 rounded-xl p-6 shadow-lg backdrop-blur-sm">
            <div className="md:w-2/5">
              <div className="relative overflow-hidden rounded-xl shadow-md">
                <img
                  src="assets/About/about-us.png"
                  alt="About Us"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>
            <div className="md:w-3/5 md:pl-8">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {displayData.about_description}
                </p>
                <div className="p-4 bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <p className="text-gray-700 italic">
                    "{displayData.about_mission}"
                  </p>
                </div>
                <a
                  href="/about"
                  className="inline-block mt-2 px-6 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Learn More About Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================== */}
      {/* =========================== CTA SECTION ============================ */}
      {/* ====================================================================== */}
      <div className="relative z-10">
        <CTA />
      </div>
    </>
  );
};

export default HomePage;
