import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, PlusCircle } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import PageHeader from "../components/PageHeader"
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });

    // Reset form after successful submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
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

  // FAQ组件
  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <motion.div
        className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? "shadow-xl border-primary" : "shadow-md border-blue-300/30"
        } border hover:border-primary/50`}
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
          <h3
            className={`text-xl font-semibold ${
              isOpen ? "text-primary" : "text-gray-800"
            }`}
          >
            {question}
          </h3>
          <div
            className={`text-primary transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
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

  // FAQ部分的数据
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
      
      {/* Hero Section */}
      <PageHeader
        title="Get in Touch"
        description="We'd love to hear from you. Reach out to us with any questions,
              feedback, or inquiries."
      />

      {/* Contact Form Section */}
      <section
        id="form"
        className="py-20 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        {/* 简化背景装饰元素 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-purple-100 opacity-20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <AnimatedSection className="space-y-8">
              <div>
                <span className="text-blue-600 font-semibold">
                  Contact Form
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">
                  Send Us a Message
                </h2>
                <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
                <p className="text-gray-700 leading-relaxed">
                  Fill out the form below and we'll get back to you as soon as
                  possible. We value your feedback and are here to answer any
                  questions you may have.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white rounded-2xl p-6 lg:p-8 shadow-2xl border border-blue-200 backdrop-blur-sm bg-white/80 relative overflow-hidden"
                style={{
                  boxShadow:
                    "0 10px 40px -10px rgba(0, 0, 100, 0.1), 0 5px 20px -5px rgba(0, 0, 100, 0.2), 0 0 15px rgba(59, 130, 246, 0.5)",
                }}
              >
                {/* 简化表单背景装饰元素 */}

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                      style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                      style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 font-medium mb-2"
                  >
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
                    style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none shadow-blue-100/40"
                    style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/40 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                >
                  <span>Send Message</span>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="rounded-full bg-red-100 p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414-1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="font-medium">{formStatus.message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedSection>

            <AnimatedSection
              id="contact-info"
              className="space-y-8"
            >
              <div>
                <span className="text-blue-600 font-semibold">
                  Get in Touch
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold mt-2 mb-4">
                  Contact Information
                </h2>
                <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
                <p className="text-gray-700 leading-relaxed">
                  You can also reach us using the contact information below.
                  We're available Monday through Friday, 9am to 5pm local time.
                </p>
              </div>

              <div
                className="space-y-6 bg-white rounded-2xl p-6 lg:p-8 shadow-2xl border border-blue-200 relative overflow-hidden backdrop-blur-sm bg-white/80"
                style={{
                  boxShadow:
                    "0 10px 40px -10px rgba(0, 0, 100, 0.1), 0 5px 20px -5px rgba(0, 0, 100, 0.2), 0 0 15px rgba(59, 130, 246, 0.5)",
                }}
              >
                {/* 简化联系信息背景装饰元素 */}

                <div className="flex items-start space-x-5 relative z-10">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Phone
                    </h3>
                    <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                    <p className="text-blue-600 text-sm mt-1 font-medium hover:text-blue-700 transition cursor-pointer">
                      Call us now
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 relative z-10">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Email
                    </h3>
                    <p className="text-gray-600 mt-1">info@example.com</p>
                    <p className="text-blue-600 text-sm mt-1 font-medium hover:text-blue-700 transition cursor-pointer">
                      Send an email
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5 relative z-10">
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      Address
                    </h3>
                    <p className="text-gray-600 mt-1">
                      123 Main Street, New York, NY 10001
                    </p>
                    <p className="text-blue-600 text-sm mt-1 font-medium hover:text-blue-700 transition cursor-pointer">
                      Get directions
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-8 bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-2xl relative overflow-hidden"
                style={{
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 100, 0.15)",
                }}
              >
                {/* 简化Business hours装饰元素 */}

                <h3 className="text-xl font-semibold mb-4 text-gray-800 relative z-10">
                  Business Hours
                </h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">
                      Monday - Friday:
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-semibold text-gray-800">
                        9:00 AM - 5:00 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Saturday:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span className="font-semibold text-gray-800">
                        10:00 AM - 2:00 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Sunday:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="font-semibold text-gray-800">
                        Closed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-blue-200 pt-4 relative z-10">
                  <div className="flex gap-4 justify-center">
                    {/* Social Media Icons */}
                    {["facebook", "twitter", "instagram", "linkedin"].map(
                      (social, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition duration-300 border border-blue-100 transform hover:-translate-y-1 hover:scale-110"
                        >
                          <div className="text-blue-600">
                            {social === "facebook" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                              </svg>
                            )}
                            {social === "twitter" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                              </svg>
                            )}
                            {social === "instagram" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                              </svg>
                            )}
                            {social === "linkedin" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                              </svg>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 relative overflow-hidden">
        {/* Enhanced background with gradient and decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 z-0"></div>

        {/* Content container */}
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-blue-600 font-semibold block mb-2">
              Global Presence
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Offices</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6 mx-auto"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Visit us at one of our office locations around the world. Our
              teams are ready to assist you with any inquiries or requests.
            </p>
          </AnimatedSection>

          <AnimatedSection
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
            direction="up"
          >
            {officeLocations.map((office, index) => (
              <div key={index} className="relative group">
                {/* Card with enhanced styling */}
                <div
                  className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100 p-6 lg:p-8 hover:translate-y-[-8px] transition-all duration-500 h-full flex flex-col relative overflow-hidden z-10"
                  style={{
                    boxShadow:
                      "0 10px 40px -10px rgba(0, 0, 100, 0.1), 0 5px 20px -5px rgba(0, 0, 100, 0.15)",
                  }}
                >
                  {/* City badge */}
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg mb-4 transform transition-transform group-hover:scale-105">
                    {office.city}
                  </div>

                  <div className="space-y-6 relative z-10 flex-grow">
                    {/* Office image/illustration placeholder */}
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-6 overflow-hidden shadow-md group-hover:shadow-lg transition-all">
                      <div className="w-full h-full bg-cover bg-center p-4 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-20 w-20 text-indigo-500 opacity-60"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-4">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Address
                          </h3>
                          <p className="text-gray-600">{office.address}</p>
                          <p className="text-blue-600 text-sm mt-1 font-medium group-hover:text-blue-700 transition">
                            Get directions
                          </p>
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
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Phone
                          </h3>
                          <p className="text-gray-600">{office.phone}</p>
                          <p className="text-blue-600 text-sm mt-1 font-medium group-hover:text-blue-700 transition">
                            Call now
                          </p>
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
                          <h3 className="font-semibold text-gray-800 mb-1">
                            Email
                          </h3>
                          <p className="text-gray-600">{office.email}</p>
                          <p className="text-blue-600 text-sm mt-1 font-medium group-hover:text-blue-700 transition">
                            Send an email
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="mt-8 pt-4 border-t border-gray-200 relative z-10">
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 group-hover:shadow-lg">
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

                {/* 删除卡片光效果 */}
              </div>
            ))}
          </AnimatedSection>

          {/* World map or global presence indicator */}
          <AnimatedSection className="mt-16 text-center" direction="up">
            <div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100 p-6 lg:p-8 relative overflow-hidden"
              style={{
                boxShadow:
                  "0 10px 40px -10px rgba(0, 0, 100, 0.1), 0 5px 20px -5px rgba(0, 0, 100, 0.2)",
              }}
            >
              {/* 简化装饰元素 */}

              <h3 className="text-2xl font-bold mb-4 relative z-10">
                Need Help Finding Us?
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto relative z-10">
                Our team is here to help you locate the nearest office. Contact
                our support team for directions or any other inquiries.
              </p>
              <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/30 inline-flex items-center justify-center gap-2 transform hover:-translate-y-1 relative z-10">
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
                    d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Find the Nearest Office</span>
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Map Section */}
      {/* 删除未使用的Map Section */}

      {/* FAQ Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decorations - 简化 */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-white to-primary/10 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-block mb-3 bg-blue-50 px-4 py-1 rounded-full">
              <span className="text-primary font-medium">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Find answers to common questions about our products and services.
              If you can't find what you're looking for, feel free to contact us
              directly.
            </p>
          </AnimatedSection>

          {/* Search box */}
          <AnimatedSection className="max-w-xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pl-12 rounded-full border border-blue-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </AnimatedSection>

          {/* FAQ list */}
          <AnimatedSection
            className="max-w-3xl mx-auto space-y-4"
            direction="up"
          >
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No matching questions found. Try different keywords or contact
                  us directly.
                </p>
                <button className="mt-4 inline-flex items-center text-primary hover:text-primary-dark transition-colors">
                  <PlusCircle size={18} className="mr-2" />
                  Ask a new question
                </button>
              </div>
            )}
          </AnimatedSection>

          {/* Contact information */}
          <AnimatedSection className="text-center mt-16">
            <p className="text-gray-600">
              Have more questions? Please
              <a href="#contact" className="text-primary hover:underline ml-1">
                contact us
              </a>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
