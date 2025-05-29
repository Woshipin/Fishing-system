import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedSection from "../components/AnimatedSection";
import CTA from "../components/CTA";
import PackageCard from "../components/PackageCard";

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  const featuredProducts = [
    {
      id: 1,
      title: "Product 1",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "26",
      category: "Electronics",
      rating: 5,
    },
    {
      id: 2,
      title: "Product 10",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "112",
      category: "Home",
      rating: 3,
    },
    {
      id: 3,
      title: "Product 8",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "129",
      category: "Home",
      rating: 2,
    },
    {
      id: 4,
      title: "Product 5",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "89",
      category: "Office",
      rating: 4,
    },
    {
      id: 5,
      title: "Product 12",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "199",
      category: "Electronics",
      rating: 5,
    },
    {
      id: 6,
      title: "Product 7",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "75",
      category: "Home",
      rating: 3,
    },
    {
      id: 7,
      title: "Product 3",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "45",
      category: "Office",
      rating: 4,
    },
    {
      id: 8,
      title: "Product 9",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "149",
      category: "Electronics",
      rating: 5,
    },
  ];

  return (
    <>
      {/* Enhanced 3D Ocean Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Main Ocean Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-blue-900 to-indigo-950"></div>

        {/* Layered Ocean Depth Effect */}
        <div className="absolute inset-0">
          {/* Deep Ocean Layer */}
          <div
            className="ocean-layer deep-ocean"
            style={{
              transform: `translateY(${scrollY * 0.1}px) scale(${1 + scrollY * 0.0002})`
            }}
          ></div>

          {/* Mid Ocean Layer */}
          <div
            className="ocean-layer mid-ocean"
            style={{
              transform: `translateY(${scrollY * 0.15}px) translateX(${mousePosition.x * 0.01}px)`
            }}
          ></div>

          {/* Surface Ocean Layer */}
          <div
            className="ocean-layer surface-ocean"
            style={{
              transform: `translateY(${scrollY * 0.2}px) translateX(${mousePosition.x * 0.02}px)`
            }}
          ></div>
        </div>

        {/* Dynamic Wave System */}
        <div className="absolute inset-0">
          {/* Primary Wave Layers */}
          <div
            className="wave-3d wave-primary"
            style={{
              transform: `translateX(${-100 + (scrollY * 0.08)}%) rotateX(${5 + scrollY * 0.005}deg) rotateY(${mousePosition.x * 0.01}deg)`
            }}
          ></div>

          <div
            className="wave-3d wave-secondary"
            style={{
              transform: `translateX(${-120 + (scrollY * 0.12)}%) rotateX(${-3 + scrollY * 0.003}deg) rotateY(${-mousePosition.x * 0.015}deg)`
            }}
          ></div>

          <div
            className="wave-3d wave-tertiary"
            style={{
              transform: `translateX(${-80 + (scrollY * 0.06)}%) rotateX(${2 + scrollY * 0.004}deg) rotateZ(${mousePosition.y * 0.005}deg)`
            }}
          ></div>
        </div>

        {/* Advanced Bubble System */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => {
            const size = 4 + Math.random() * 12;
            const delay = Math.random() * 8;
            const duration = 4 + Math.random() * 6;
            const xPos = Math.random() * 100;

            return (
              <div
                key={i}
                className="bubble-3d"
                style={{
                  left: `${xPos}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  width: `${size}px`,
                  height: `${size}px`,
                  transform: `translateY(${scrollY * (0.05 + Math.random() * 0.15)}px) translateX(${mousePosition.x * (0.02 + Math.random() * 0.03)}px)`
                }}
              ></div>
            );
          })}
        </div>

        {/* Enhanced Marine Life */}
        <div className="absolute inset-0">
          {/* Swimming Fish with 3D Movement */}
          {[...Array(12)].map((_, i) => {
            const fishTypes = ['🐠', '🐡', '🐟', '🐙', '🦈'];
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
                  transform: `translateY(${scrollY * (0.03 + depth * 0.08)}px) translateX(${mousePosition.x * (0.01 + depth * 0.02)}px) rotateY(${mousePosition.x * 0.02}deg)`,
                  zIndex: Math.floor(depth * 10),
                  filter: `hue-rotate(${Math.random() * 180}deg) drop-shadow(0 0 ${8 + depth * 12}px rgba(255, 255, 255, ${0.3 + depth * 0.4})) blur(${(1 - depth) * 0.5}px)`
                }}
              >
                {fishType}
              </div>
            );
          })}

          {/* Floating Jellyfish */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="jellyfish-3d"
              style={{
                left: `${10 + i * 15 + Math.random() * 10}%`,
                top: `${20 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 6}s`,
                transform: `translateY(${scrollY * 0.04}px) translateX(${mousePosition.x * 0.015}px) rotateZ(${mousePosition.y * 0.01}deg)`
              }}
            >
              🎐
            </div>
          ))}
        </div>

        {/* Ocean Floor with 3D Elements */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Animated Seaweed Forest */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="seaweed-3d"
              style={{
                left: `${i * 5 + Math.random() * 4}%`,
                height: `${30 + Math.random() * 50}px`,
                width: `${3 + Math.random() * 3}px`,
                animationDelay: `${Math.random() * 4}s`,
                transform: `translateY(${scrollY * 0.08}px) rotateZ(${scrollY * 0.01 + Math.sin(Date.now() * 0.001 + i) * 3}deg) perspective(100px) rotateX(${mousePosition.y * 0.02}deg)`
              }}
            ></div>
          ))}

          {/* 3D Coral Reef System */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="coral-3d"
              style={{
                left: `${i * 8 + Math.random() * 6}%`,
                transform: `translateY(${scrollY * 0.06}px) scale(${0.7 + Math.random() * 0.6}) perspective(50px) rotateY(${mousePosition.x * 0.01}deg) rotateX(${5 + mousePosition.y * 0.005}deg)`
              }}
            ></div>
          ))}

          {/* Ocean Floor Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="sand-particle"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `${Math.random() * 20}px`,
                animationDelay: `${Math.random() * 10}s`,
                transform: `translateX(${mousePosition.x * 0.003}px)`
              }}
            ></div>
          ))}
        </div>

        {/* Dynamic Light Ray System */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="light-ray-3d"
              style={{
                left: `${15 + i * 20}%`,
                transform: `
                  translateX(${mousePosition.x * (0.002 + i * 0.001)}px)
                  translateY(${mousePosition.y * (0.001 + i * 0.0005)}px)
                  rotateZ(${10 + i * 5 + scrollY * 0.01}deg)
                  perspective(200px)
                  rotateX(${mousePosition.y * 0.02}deg)
                `,
                animationDelay: `${i * 1.5}s`
              }}
            ></div>
          ))}
        </div>

        {/* Floating Particles System */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="water-particle-3d"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                transform: `translateY(${scrollY * (0.01 + Math.random() * 0.03)}px) translateX(${mousePosition.x * (0.001 + Math.random() * 0.002)}px)`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero Section with Fishing Theme 3D Background */}
      <section className="relative h-screen flex items-center overflow-hidden z-10">
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="text-white">Beautiful</span> Solutions for Your
              <span className="text-white"> Business</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white">
              We provide high-quality products and services to help your
              business grow and succeed in today's competitive market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/products"
                className="btn bg-white text-blue-500 hover:bg-gray-100 rounded-full border-none shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Explore Products
              </a>
              <a href="/contact" className="btn btn-outline rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-1">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced 3D Ocean CSS Styles */}
      <style jsx="true">{`
        /* Ocean Layer Backgrounds */
        .ocean-layer {
          position: absolute;
          inset: 0;
          opacity: 0.7;
          will-change: transform;
        }

        .deep-ocean {
          background: radial-gradient(ellipse at center bottom, rgba(0, 20, 40, 0.8) 0%, transparent 70%);
          filter: blur(2px);
        }

        .mid-ocean {
          background: radial-gradient(ellipse at center, rgba(0, 100, 150, 0.6) 20%, transparent 80%);
          filter: blur(1px);
        }

        .surface-ocean {
          background: linear-gradient(to bottom, rgba(100, 200, 255, 0.3) 0%, transparent 50%);
        }

        /* 3D Wave System */
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
          background: linear-gradient(90deg,
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
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(135, 206, 235, 0.2) 30%,
            rgba(255, 255, 255, 0.1) 60%,
            transparent 100%
          );
          animation: wave-3d-flow-alt 18s ease-in-out infinite;
          opacity: 0.8;
        }

        .wave-tertiary {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(0, 150, 200, 0.15) 40%,
            rgba(255, 255, 255, 0.08) 70%,
            transparent 100%
          );
          animation: wave-3d-flow-slow 22s ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes wave-3d-flow {
          0%, 100% {
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
          0%, 100% {
            transform: translateX(-120%) rotateX(1deg) rotateY(0deg);
          }
          50% {
            transform: translateX(0%) rotateX(-2deg) rotateY(1deg);
          }
        }

        @keyframes wave-3d-flow-slow {
          0%, 100% {
            transform: translateX(-80%) rotateZ(-1deg);
          }
          50% {
            transform: translateX(20%) rotateZ(1deg);
          }
        }

        /* Enhanced 3D Bubbles */
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
          box-shadow:
            0 0 10px rgba(255, 255, 255, 0.4),
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
            transform: scale(1.2) rotateY(270deg) rotateX(5deg) translateX(-15px);
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 120vh;
            opacity: 0;
            transform: scale(1.5) rotateY(360deg) rotateX(0deg) translateX(0px);
          }
        }

        /* 3D Marine Life */
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
            transform: scaleX(-1) rotateY(-5deg) rotateZ(-2deg) translateY(-10px);
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
          0%, 100% {
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
        }

        /* 3D Ocean Floor */
        .seaweed-3d {
          position: absolute;
          bottom: 0;
          background: linear-gradient(to top,
            #1a4d3a 0%,
            #2d7a4f 30%,
            #4a9d6f 60%,
            #6bb890 100%
          );
          border-radius: 50% 50% 0 0;
          transform-origin: bottom center;
          animation: seaweed-3d-sway 8s ease-in-out infinite;
          box-shadow:
            2px 0 4px rgba(0, 0, 0, 0.2),
            -1px 0 2px rgba(255, 255, 255, 0.1);
          will-change: transform;
          transform-style: preserve-3d;
        }

        @keyframes seaweed-3d-sway {
          0%, 100% {
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
          background: linear-gradient(135deg,
            #ff6b6b 0%,
            #ff8e8e 25%,
            #ffb3b3 50%,
            #ff9999 75%,
            #ff7777 100%
          );
          border-radius: 20px 20px 0 0;
          box-shadow:
            0 0 8px rgba(255, 107, 107, 0.4),
            inset -2px -2px 4px rgba(0, 0, 0, 0.2),
            inset 2px 2px 4px rgba(255, 255, 255, 0.3);
          animation: coral-3d-pulse 12s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .coral-3d::before, .coral-3d::after {
          content: '';
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
          0%, 100% {
            transform: scale(1) rotateY(0deg);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotateY(5deg);
            filter: hue-rotate(10deg);
          }
        }

        /* 3D Light Rays */
        .light-ray-3d {
          position: absolute;
          top: -10%;
          width: 120px;
          height: 110%;
          background: linear-gradient(to bottom,
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
          0%, 100% {
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
        }

        /* Enhanced Water Particles */
        .water-particle-3d {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle,
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
        }

        /* Sand Particles */
        .sand-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: rgba(255, 218, 185, 0.6);
          border-radius: 50%;
          animation: sand-drift 15s ease-in-out infinite;
        }

        @keyframes sand-drift {
          0%, 100% {
            transform: translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateX(20px) scale(1.2);
            opacity: 0.6;
          }
        }

        /* Performance Optimizations */
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

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-white/90 to-blue-50/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              🎣 精选钓具装备
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              发现我们最受欢迎的钓鱼装备，这些产品已经帮助数百位钓鱼爱好者
              实现了他们的钓鱼梦想和目标。
            </p>
            <div className="h-1 w-24 bg-blue-500 mx-auto mt-6"></div>
          </AnimatedSection>

          <AnimatedSection
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            direction="up"
          >
            {featuredProducts.map((product) => (
              <PackageCard
                key={product.id}
                title={product.title}
                description={product.subtitle}
                imageUrl={product.imageUrl}
                buttonLink={`/products/${product.id}`}
                category={product.category}
                price={product.price}
                rating={product.rating}
              />
            ))}
          </AnimatedSection>

          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-block px-6 py-3 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
🌊 查看所有钓具
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50/90 to-white/90 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-black inline-block relative">
              About Our Company
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
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">About Us</span>
                </div>
              </div>
            </div>

            <div className="md:w-3/5 md:pl-8">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We are a team of passionate professionals dedicated to
                  providing the best products and services to our clients. With
                  years of experience in the industry, we understand the
                  challenges businesses face and offer tailored solutions to
                  help them succeed.
                </p>

                <div className="p-4 bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <p className="text-gray-700 italic">
                    "Our mission is to empower businesses with innovative tools
                    and strategies that drive growth and create lasting value."
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

      {/* CTA Section */}
      <div className="relative z-10">
        <CTA />
      </div>
    </>
  );
};

export default HomePage;
