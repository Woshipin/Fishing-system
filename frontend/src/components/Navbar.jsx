import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Packages", path: "/packages" },
    { name: "Products", path: "/products" },
    { name: "Gallery", path: "/gallery" },
    { name: "Fishing Time", path: "/fishing-time" },
    { name: "Comment", path: "/comments" },
    { name: "Contact", path: "/contact" },
  ];

  const iconLinks = [
    {
      name: "Cart",
      path: "/cart",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Order",
      path: "/orders",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path) => activeLink === path;

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsOpen(false);
    navigate(path); // 实际跳转
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100/50 py-2"
          : "bg-white/90 backdrop-blur-sm py-3 sm:py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            ModernSite
          </motion.div>

          {/* Desktop Navigation - 添加更大的gap */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-4 ml-8 lg:ml-12 xl:ml-6">
            {navLinks.map((link, index) => (
              <motion.button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`px-2 xl:px-3 2xl:px-4 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-300 whitespace-nowrap relative ${
                  isActive(link.path)
                    ? "text-blue-600 bg-blue-50/80 shadow-md border border-blue-200/60"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-sm"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop Icons and Auth - 优化间距 */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {iconLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`p-2 xl:p-2.5 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-blue-600 bg-blue-50/80 shadow-md border border-blue-200/60"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-sm"
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={link.name}
              >
                {link.icon}
              </motion.button>
            ))}

            {/* Auth Buttons - 优化尺寸 */}
            <div className="flex items-center space-x-1 xl:space-x-2 ml-2 xl:ml-4">
              <motion.button
                onClick={() => handleLinkClick("/login")}
                className="px-3 xl:px-5 py-2 xl:py-2.5 rounded-xl text-xs xl:text-sm font-semibold text-blue-600 bg-white/80 backdrop-blur-sm border border-blue-200/60 hover:border-blue-300/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow:
                    "0 4px 15px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)",
                }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => handleLinkClick("/register")}
                className="px-3 xl:px-5 py-2 xl:py-2.5 rounded-xl text-xs xl:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow:
                    "0 4px 15px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)",
                }}
              >
                Register
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button - 修改断点从xl改为lg */}
          <div className="lg:hidden flex items-center space-x-2">
            {iconLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-blue-600 bg-blue-50/80 shadow-md border border-blue-200/60"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={link.name}
              >
                {link.icon}
              </motion.button>
            ))}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 focus:outline-none"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="pt-4 pb-6 space-y-3">
            {/* Navigation Links with Beautiful Cards */}
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/60 shadow-lg p-2"
              style={{
                boxShadow:
                  "0 8px 25px rgba(59, 130, 246, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.05)",
              }}
            >
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-blue-600 bg-blue-50/80 shadow-md border border-blue-200/60"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-sm"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={() => handleLinkClick("/login")}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-blue-600 bg-white/90 backdrop-blur-sm border border-blue-200/60 hover:border-blue-300/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50/60"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow:
                    "0 4px 15px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)",
                }}
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => handleLinkClick("/register")}
                className="w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow:
                    "0 4px 15px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)",
                }}
              >
                Register
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
