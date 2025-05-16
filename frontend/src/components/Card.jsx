import { motion } from "framer-motion"

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
      {/* Image Section - 70% */}
      <div className="relative h-[350px] overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={imageAlt}
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

      {/* Content Section - 30% */}
      <div className="p-4 flex flex-col h-[150px] overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-1 mb-2">
          {title && (
            <h3 className="text-lg font-bold text-gray-800 truncate max-w-full sm:max-w-[70%]">
              {title}
            </h3>
          )}
          {rating > 0 && (
            <div className="flex self-start sm:self-center">
              {renderStars(rating)}
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-gray-700 mb-2 line-clamp-2 text-sm overflow-hidden">
            {subtitle}
          </p>
        )}
        {children}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex">
            {/* Stock status or other tags can be placed here */}
          </div>
          {footer && <div className="w-full">{footer}</div>}
        </div>
      </div>
    </motion.div>
  )
}

export default Card
