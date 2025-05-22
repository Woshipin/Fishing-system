import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import CTA from "../components/CTA";
import PackageCard from "../components/PackageCard"; 

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      title: "Product 1,orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...，orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...Product 1,orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...，orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...Product 1,orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...，orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...，orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...,consectetur adipiscing elit. Sed do eiusmod tempor...,consectetur adipiscing elit. Sed do eiusmod tempor...,consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "26",
      category: "Electronics",
      rating: 5,
    },
    {
      id: 2,
      title: "Product 10",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "112",
      category: "Home",
      rating: 3,
    },
    {
      id: 3,
      title: "Product 8",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "129",
      category: "Home",
      rating: 2,
    },
    {
      id: 4,
      title: "Product 5",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "89",
      category: "Office",
      rating: 4,
    },
    {
      id: 5,
      title: "Product 12",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "199",
      category: "Electronics",
      rating: 5,
    },
    {
      id: 6,
      title: "Product 7",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "75",
      category: "Home",
      rating: 3,
    },
    {
      id: 7,
      title: "Product 3",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
      price: "45",
      category: "Office",
      rating: 4,
    },
    {
      id: 8,
      title: "Product 9",
      subtitle:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor...",
      imageUrl: "/assets/About/about-us.png",
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
      <CTA />
    </div>
  );
};

export default HomePage;
