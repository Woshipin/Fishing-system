import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  imageUrl,
  imageAlt = "Card image",
  title,
  subtitle,
  footer,
  price,
  category,
  rating = 0,
  ...props
}) => {
  // Render stars based on rating
  const renderStars = (count) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={`text-lg ${
            index < count ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ));
  };

  return (
    <motion.div
      className={`bg-white border border-gray-200 shadow overflow-hidden transition-all duration-300 flex flex-col rounded-3xl h-[500px] w-full ${className}`}
      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
      {...props}
    >
      {/* Image Section - Fixed height */}
      <div className="relative h-[50%] overflow-hidden">
        <img
          src={imageUrl || "/assets/About/about-us.png"}
          alt={title || imageAlt}
          className="w-full h-full object-cover"
        />
        {price && (
          <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md">
            ${price}
          </div>
        )}
        {category && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {category}
          </div>
        )}
      </div>

      {/* Content Section - Fixed height */}
      <div
        className="p-4 flex flex-col h-[50%] overflow-auto"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
          {title && (
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2 max-w-full sm:max-w-[70%]">
              {title}
            </h3>
          )}
          {rating > 0 && (
            <div className="flex self-start sm:self-center shrink-0">
              {renderStars(rating)}
            </div>
          )}
        </div>

        {subtitle && (
          <div className="flex-grow overflow-auto mb-3">
            <p className="text-gray-700 text-sm">{subtitle}</p>
          </div>
        )}

        {children}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div className="flex">
            {/* Stock status or other tags can be placed here */}
          </div>
          {footer && <div className="w-full">{footer}</div>}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
