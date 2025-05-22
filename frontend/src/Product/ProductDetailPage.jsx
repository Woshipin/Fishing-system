import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AnimatedSection from "../components/AnimatedSection";
import Card from "../components/Card";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Simulate fetching product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock product data
      const mockProduct = {
        id: parseInt(id),
        name: `Product ${id}`,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        longDescription:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        price: Math.floor(Math.random() * 200) + 20,
        discountPrice: Math.floor(Math.random() * 20) + 10,
        category: ["Electronics", "Home", "Clothing", "Office"][
          Math.floor(Math.random() * 4)
        ],
        rating: Math.floor(Math.random() * 5) + 1,
        reviewCount: Math.floor(Math.random() * 100) + 5,
        images: [
          `/assets/About/about-us.png`,
          `/assets/About/about-us.png`,
          `/assets/About/about-us.png`,
          `/assets/About/about-us.png`,
        ],
        colors: ["Red", "Blue", "Green", "Black"],
        sizes: ["S", "M", "L", "XL"],
        inStock: Math.random() > 0.2,
        featured: Math.random() > 0.7,
        specifications: [
          { name: "Dimensions", value: "10 x 5 x 2 inches" },
          { name: "Weight", value: "1.5 lbs" },
          { name: "Material", value: "Premium Quality" },
          { name: "Warranty", value: "1 Year" },
        ],
        reviews: [
          {
            id: 1,
            user: "John Doe",
            rating: 5,
            date: "2023-05-15",
            comment:
              "Great product! Exactly what I was looking for. The quality is excellent and it arrived quickly.",
          },
          {
            id: 2,
            user: "Jane Smith",
            rating: 4,
            date: "2023-04-22",
            comment:
              "Good product for the price. Would recommend to others looking for something similar.",
          },
          {
            id: 3,
            user: "Mike Johnson",
            rating: 3,
            date: "2023-03-10",
            comment:
              "Decent product but had some minor issues. Customer service was helpful in resolving them.",
          },
        ],
        relatedProducts: [
          {
            id: parseInt(id) + 1,
            name: `Related Product ${parseInt(id) + 1}`,
            price: Math.floor(Math.random() * 200) + 20,
            imageUrl: `https://via.placeholder.com/400x300?text=Related+${
              parseInt(id) + 1
            }`,
            category: ["Electronics", "Home", "Clothing", "Office"][
              Math.floor(Math.random() * 4)
            ],
          },
          {
            id: parseInt(id) + 2,
            name: `Related Product ${parseInt(id) + 2}`,
            price: Math.floor(Math.random() * 200) + 20,
            imageUrl: `https://via.placeholder.com/400x300?text=Related+${
              parseInt(id) + 2
            }`,
            category: ["Electronics", "Home", "Clothing", "Office"][
              Math.floor(Math.random() * 4)
            ],
          },
          {
            id: parseInt(id) + 3,
            name: `Related Product ${parseInt(id) + 3}`,
            price: Math.floor(Math.random() * 200) + 20,
            imageUrl: `https://via.placeholder.com/400x300?text=Related+${
              parseInt(id) + 3
            }`,
            category: ["Electronics", "Home", "Clothing", "Office"][
              Math.floor(Math.random() * 4)
            ],
          },
        ],
      };

      setProduct(mockProduct);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <Link
                    to="/products"
                    className="ml-1 text-gray-600 hover:text-primary md:ml-2"
                  >
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2 truncate max-w-xs">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Images */}
            <AnimatedSection direction="left" className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg border border-blue-300/30 overflow-hidden">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-contain p-4"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Product Info */}
            <AnimatedSection direction="right" className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < product.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="mb-4">
                  {product.discountPrice ? (
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-primary mr-2">
                        ${product.price - product.discountPrice}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.price}
                      </span>
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Save ${product.discountPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      ${product.price}
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-6">{product.description}</p>

                <div className="space-y-4 mb-6">
                  {/* Color Selection */}
                  {product.colors && (
                    <div>
                      <h3 className="font-semibold mb-2">Color</h3>
                      <div className="flex space-x-2">
                        {product.colors.map((color, index) => (
                          <button
                            key={index}
                            className="px-4 py-2 border rounded-lg hover:border-primary transition-colors"
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.sizes && (
                    <div>
                      <h3 className="font-semibold mb-2">Size</h3>
                      <div className="flex space-x-2">
                        {product.sizes.map((size, index) => (
                          <button
                            key={index}
                            className="px-4 py-2 border rounded-lg hover:border-primary transition-colors"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <h3 className="font-semibold mb-2">Quantity</h3>
                    <div className="flex items-center">
                      <button
                        onClick={decrementQuantity}
                        className="px-3 py-1 border rounded-l-lg hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center border-t border-b py-1"
                      />
                      <button
                        onClick={incrementQuantity}
                        className="px-3 py-1 border rounded-r-lg hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button
                    className={`btn btn-primary flex-1 ${
                      !product.inStock && "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button className="btn btn-outline flex-1">
                    Add to Wishlist
                  </button>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Shipping Info */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      ></path>
                    </svg>
                    <span className="text-gray-600">
                      Free shipping on orders over $50
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    <span className="text-gray-600">
                      30-day money-back guarantee
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-blue-300/30 overflow-hidden">
            <div className="flex flex-wrap border-b">
              <button
                className={`px-6 py-4 font-medium ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-6 py-4 font-medium ${
                  activeTab === "specifications"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
              <button
                className={`px-6 py-4 font-medium ${
                  activeTab === "reviews"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviews.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <AnimatedSection>
                  <div className="prose max-w-none">
                    {product.longDescription
                      .split("\n\n")
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-700">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </AnimatedSection>
              )}

              {activeTab === "specifications" && (
                <AnimatedSection>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <tbody>
                        {product.specifications.map((spec, index) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="py-3 px-4 font-medium">
                              {spec.name}
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AnimatedSection>
              )}

              {activeTab === "reviews" && (
                <AnimatedSection>
                  <div className="space-y-8">
                    {product.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold">{review.user}</h3>
                          <span className="text-gray-500 text-sm">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}

                    {/* Write a Review Form */}
                    <div className="mt-8 pt-8 border-t">
                      <h3 className="text-xl font-semibold mb-4">
                        Write a Review
                      </h3>
                      <form className="space-y-4">
                        <div>
                          <label
                            htmlFor="rating"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Rating
                          </label>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="text-gray-300 hover:text-yellow-400 text-2xl focus:outline-none"
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="comment"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Your Review
                          </label>
                          <textarea
                            id="comment"
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Share your experience with this product..."
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">
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

      {/* Related Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Related Products</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              You might also be interested in these similar products.
            </p>
          </AnimatedSection>

          <AnimatedSection
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            direction="up"
          >
            {product.relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                imageUrl={relatedProduct.imageUrl}
                title={relatedProduct.name}
                subtitle={relatedProduct.description || relatedProduct.category}
                price={relatedProduct.price}
                category={relatedProduct.category}
                rating={relatedProduct.rating || 0}
                footer={
                  <div className="flex justify-between items-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                      {relatedProduct.inStock ? "In Stock" : "Available"}
                    </span>
                    <Link
                      to={`/products/${relatedProduct.id}`}
                      className="px-4 py-2 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                }
              />
            ))}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
