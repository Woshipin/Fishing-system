import { motion } from "framer-motion";

const PackageCard = ({
  title,
  description,
  buttonLink = "#",
  category,
  price,
  rating = 5,
}) => {
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
      className="bg-white border border-blue-200/70 overflow-hidden transition-all duration-300 flex flex-col rounded-3xl h-[500px] w-full"
      whileHover={{ y: -4, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.15)" }}
      style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
    >
      <div className="relative h-[50%] overflow-hidden">
        <img
          src="/assets/About/about-us.png"
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md">
          ${price}
        </div>
        {category && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {category}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col h-[50%] overflow-auto scrollbar-thin">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 max-w-full sm:max-w-[70%]">
            {title}
          </h3>
          <div className="flex self-start sm:self-center shrink-0">
            {renderStars(rating)}
          </div>
        </div>

        <div className="flex-grow overflow-auto mb-3">
          <p className="text-gray-700 text-sm">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs whitespace-nowrap">
            In Stock
          </span>
          <a
            href={buttonLink || "/products"}
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-xs sm:text-sm whitespace-nowrap ml-2"
          >
            View Details
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;
