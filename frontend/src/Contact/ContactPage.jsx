// src/Contact/ContactPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import PageHeader from "../components/PageHeader";
import { useUser } from "../contexts/UserContext";

const ContactPage = () => {
  const { user } = useUser(); // 修复：从user对象中获取信息

  // 调试信息
  useEffect(() => {
    console.log("ContactPage: Component mounted");
    console.log("ContactPage: User data:", user);
  }, [user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // 当用户信息变化时，更新表单数据
  useEffect(() => {
    if (user.isLoggedIn) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
      console.log("ContactPage: Form data updated with user info:", {
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log("ContactPage: Form field changed:", { [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ContactPage: Form submitted with data:", formData);
    
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
    
    // 保留用户的姓名和邮箱，清空主题和消息
    setFormData(prev => ({
      ...prev,
      subject: "",
      message: "",
    }));
  };

  const officeLocations = [
    {
      city: "New York",
      address: "123 Broadway, New York, NY 10001",
      phone: "+1 (212) 555-1234",
      email: "newyork@example.com",
    },
    {
      city: "London",
      address: "456 Oxford Street, London, W1C 1AP",
      phone: "+44 20 7123 4567",
      email: "london@example.com",
    },
    {
      city: "Tokyo",
      address: "789 Shibuya, Tokyo, 150-0002",
      phone: "+81 3 1234 5678",
      email: "tokyo@example.com",
    },
  ];

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <motion.div
        className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? "shadow-xl border-blue-600" : "shadow-md border-blue-300/30"
        } border hover:border-blue-500/50`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-6 flex items-center justify-between text-left transition-colors ${
            isOpen ? "bg-blue-50" : "bg-white"
          }`}
        >
          <h3 className={`text-xl font-semibold ${isOpen ? "text-blue-600" : "text-gray-800"}`}>
            {question}
          </h3>
          <div className="text-blue-600 transition-transform duration-300">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 pt-0 text-gray-600">{answer}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      question: "How quickly can I expect a response to my inquiry?",
      answer:
        "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please call our customer service line.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship to most countries worldwide. Shipping rates and delivery times vary by location. Please check our shipping policy for more details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers. For large orders, we also offer financing options.",
    },
    {
      question: "Can I schedule a consultation before purchasing?",
      answer:
        "We offer free consultations to help you find the right product for your needs. You can schedule a call with one of our experts through the contact form.",
    },
    {
      question: "What is your product warranty period?",
      answer:
        "All our products come with a standard one-year warranty. Our premium product line includes an extended three-year warranty. Please refer to the product details page for specific warranty policies.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive an email with a tracking number. You can use this number to track your package on our website or through the carrier's official channels.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* 用户状态显示区域 - 改进版本 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            {user.isLoggedIn ? (
              <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">登录状态: </span>
                    <span className="font-bold text-green-600">已登录</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">用户ID: </span>
                    <span className="font-bold text-blue-600">{user.userId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">姓名: </span>
                    <span className="font-bold text-blue-600">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">邮箱: </span>
                    <span className="font-bold text-blue-600">{user.email}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">登录状态: </span>
                  <span className="font-bold text-red-600">未登录</span>
                  <span className="text-gray-500 ml-4">请先登录以自动填充联系信息</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <PageHeader 
        title="Get in Touch" 
        description="We'd love to hear from you. Reach out with any questions or feedback." 
      />

      {/* Contact Form Section */}
      <section id="form" className="py-20 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-purple-100 opacity-10 blur-3xl w-96 h-96 rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <AnimatedSection className="space-y-8">
              <div>
                <span className="text-blue-600 font-semibold">Contact Form</span>
                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">Send Us a Message</h2>
                <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
                <p className="text-gray-700 leading-relaxed">
                  Fill out the form below and we'll get back to you as soon as possible.
                  {user.isLoggedIn && (
                    <span className="block mt-2 text-sm text-blue-600 font-medium">
                      ✓ Your contact information has been automatically filled in
                    </span>
                  )}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-2xl border border-blue-200 backdrop-blur-sm bg-white/80 p-6 lg:p-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Your Name
                      {user.isLoggedIn && <span className="text-green-600 text-sm ml-2">✓ Auto-filled</span>}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                      placeholder={user.isLoggedIn ? "Your name is auto-filled" : "Enter your name"}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      Email Address
                      {user.isLoggedIn && <span className="text-green-600 text-sm ml-2">✓ Auto-filled</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                      placeholder={user.isLoggedIn ? "Your email is auto-filled" : "Enter your email"}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                    placeholder="What's this message about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-blue-100/40"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/40 inline-flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>

              <AnimatePresence>
                {formStatus.submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`p-5 rounded-xl shadow-lg ${
                      formStatus.success
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {formStatus.success ? (
                        <div className="rounded-full bg-green-100 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="rounded-full bg-red-100 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{formStatus.message}</span>
                        {user.isLoggedIn && formStatus.success && (
                          <p className="text-sm mt-1">
                            We have your contact details on file (User ID: {user.userId})
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedSection>

            <AnimatedSection id="contact-info" className="space-y-8">
              <div>
                <span className="text-blue-600 font-semibold">Get in Touch</span>
                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">Contact Information</h2>
                <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
                <p className="text-gray-700 leading-relaxed">
                  You can also reach us using the contact information below. Available Monday through Friday, 9am to 5pm local time.
                </p>
              </div>

              <div className="space-y-6 bg-white rounded-2xl shadow-2xl border border-blue-200 backdrop-blur-sm bg-white/80 p-6 lg:p-8">
                <div className="flex items-start space-x-5">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-blue-600 text-sm mt-1 font-medium hover:underline cursor-pointer">Call us now</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                    <p className="text-gray-600">info@example.com</p>
                    <p className="text-blue-600 text-sm mt-1 font-medium hover:underline cursor-pointer">Send an email</p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">Address</h3>
                    <p className="text-gray-600">123 Main Street, New York, NY 10001</p>
                    <p className="text-blue-600 text-sm mt-1 font-medium hover:underline cursor-pointer">Get directions</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Monday - Friday:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Saturday:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Sunday:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block mb-2 bg-blue-50 px-4 py-1 rounded-full text-primary font-medium">Global Presence</span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Our Offices</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">Visit us at one of our global locations.</p>
          </AnimatedSection>

          <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10" direction="up">
            {officeLocations.map((office, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100 p-6 lg:p-8 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg mb-4">
                    {office.city}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 group cursor-pointer">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Address</h3>
                        <p>{office.address}</p>
                        <p className="text-blue-600 text-sm mt-1 font-medium group-hover:text-blue-700 transition">Get directions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 group cursor-pointer">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Phone</h3>
                        <p>{office.phone}</p>
                        <p className="text-blue-600 text-sm mt-1 font-medium group-hover:text-blue-700 transition">Call now</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 group cursor-pointer">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105 flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Email</h3>
                        <p>{office.email}</p>
                        <p className="text-blue-600 text-sm mt-1 font-medium group-hover:text-blue-700 transition">Send an email</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
                      <span>View Office Details</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-block mb-3 bg-blue-50 px-4 py-1 rounded-full">
              <span className="text-blue-600 font-medium">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Find answers to common questions about our products and services.
            </p>
          </AnimatedSection>

          <AnimatedSection className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-12 pl-12 rounded-full border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </AnimatedSection>

          <AnimatedSection className="max-w-3xl mx-auto space-y-4" direction="up">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => <FAQItem key={index} question={faq.question} answer={faq.answer} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No matching questions found. Try different keywords or contact us directly.</p>
                <button className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ask a new question
                </button>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;