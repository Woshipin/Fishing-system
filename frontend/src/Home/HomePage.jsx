import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import CTA from "../components/CTA";
import PackageCard from "../components/PackageCard";

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      title: "Product 1",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "26",
      category: "Electronics",
      rating: 5,
    },
    {
      id: 2,
      title: "Product 10",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "112",
      category: "Home",
      rating: 3,
    },
    {
      id: 3,
      title: "Product 8",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "129",
      category: "Home",
      rating: 2,
    },
    {
      id: 4,
      title: "Product 5",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "89",
      category: "Office",
      rating: 4,
    },
    {
      id: 5,
      title: "Product 12",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "199",
      category: "Electronics",
      rating: 5,
    },
    {
      id: 6,
      title: "Product 7",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "75",
      category: "Home",
      rating: 3,
    },
    {
      id: 7,
      title: "Product 3",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "45",
      category: "Office",
      rating: 4,
    },
    {
      id: 8,
      title: "Product 9",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/api/placeholder/400/320",
      price: "149",
      category: "Electronics",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-100 z-0"></div>

        <div className="container mx-auto px-4 z-10">
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

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular products that have helped hundreds of
              businesses achieve their goals.
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
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="relative overflow-hidden rounded-lg shadow-lg max-w-lg mx-auto">
                <img
                  src="assets/About/about-us.png"
                  alt="About Us"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-50"></div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="space-y-6 p-4">
                <div className="inline-block">
                  <h2 className="text-3xl md:text-4xl font-bold text-black relative">
                    About Our Company
                    <span className="block h-1 w-24 bg-blue-600 mt-2"></span>
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  We are a team of passionate professionals dedicated to
                  providing the best products and services to our clients. With
                  years of experience in the industry, we understand the
                  challenges businesses face and offer tailored solutions to
                  help them succeed.
                </p>

                <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500 my-6">
                  <p className="text-gray-700 italic">
                    "Our mission is to empower businesses with innovative tools
                    and strategies that drive growth and create lasting value."
                  </p>
                </div>

                <div className="flex items-center space-x-4 mt-8">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Innovative Thinking
                    </h3>
                    <p className="text-sm text-gray-600">
                      We constantly explore new methods to provide cutting-edge
                      solutions
                    </p>
                  </div>
                </div>

                <a
                  href="/about"
                  className="inline-block mt-4 px-6 py-3 rounded-full transition-all duration-300 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Learn More About Us
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA />
    </div>
  );
};

export default HomePage;
