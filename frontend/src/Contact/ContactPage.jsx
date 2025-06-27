import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import AnimatedSection from "../components/AnimatedSection";
import PageHeader from "../components/PageHeader";
import { useUser } from "../contexts/UserContext";

// Icon Components
const PhoneIcon = () => (
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
);

const EmailIcon = () => (
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
);

const LocationIcon = () => (
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
);

const ArrowRightIcon = () => (
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
);

// Reusable UI Components
const ContactInfoItem = ({ icon, title, text, actionText }) => (
  <div className="flex items-start space-x-5 group cursor-pointer">
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg transform group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-300 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-gray-600">{text}</p>
      <p className="text-blue-600 text-sm mt-1 font-medium group-hover:underline transition">
        {actionText}
      </p>
    </div>
  </div>
);

const OfficeLocationCard = ({ office }) => (
  <div
    key={office.city}
    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-100 p-6 lg:p-8 hover:translate-y-[-8px] transition-all duration-500 relative overflow-hidden"
  >
    <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg mb-4">
      {office.city}
    </div>
    <div className="space-y-4">
      <ContactInfoItem
        icon={<LocationIcon />}
        title="Address"
        text={office.address}
        actionText="Get directions"
      />
      <ContactInfoItem
        icon={<PhoneIcon />}
        title="Phone"
        text={office.phone}
        actionText="Call now"
      />
      <ContactInfoItem
        icon={<EmailIcon />}
        title="Email"
        text={office.email}
        actionText="Send an email"
      />
    </div>
    <div className="mt-8 pt-4 border-t border-gray-200">
      <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2">
        <span>View Office Details</span>
        <ArrowRightIcon />
      </button>
    </div>
  </div>
);

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
        <h3
          className={`text-xl font-semibold ${
            isOpen ? "text-blue-600" : "text-gray-800"
          }`}
        >
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

// Main Page Component
const ContactPage = () => {
  const { user } = useUser();
  const API_BASE_URL = "http://localhost:8000/api";
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/fishing-cms');
        if (!response.ok) {
          throw new Error('Failed to fetch CMS data');
        }
        const data = await response.json();
        setCmsData(data.cms);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCMSData();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.isLoggedIn) {
      toast.error("Please log in before sending a message.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/add-contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user_id: user.userId,
          user_name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      toast.success("Thank you! Your Contact Message has been sent.");
      setFormData((prev) => ({ ...prev, subject: "", message: "" }));
    } catch (error) {
      toast.error(`Submission failed: ${error.message}`);
      console.error("ContactPage: Failed to submit form:", error);
    } finally {
      setSubmitting(false);
    }
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

  const [searchTerm, setSearchTerm] = useState("");
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisplayData = () => {
    if (!cmsData) return {
      opening_days_text: "Monday - Friday",
      closing_day_text: "Sunday",
      open_time: "09:00",
      close_time: "18:00",
      special_holidays_text: "Closed on Public Holidays",
      address: "123 Main Street, New York, NY 10001",
      email: "info@example.com",
      phone_number: "(123) 456-7890",
    };

    return {
      opening_days_text: cmsData.opening_days_text || "Monday - Friday",
      closing_day_text: cmsData.closing_day_text || "Sunday",
      open_time: cmsData.open_time || "09:00",
      close_time: cmsData.close_time || "18:00",
      special_holidays_text: cmsData.special_holidays_text || "Closed on Public Holidays",
      address: cmsData.address || "123 Main Street, New York, NY 10001",
      email: cmsData.email || "info@example.com",
      phone_number: cmsData.phone_number || "(123) 456-7890",
    };
  };

  const displayData = getDisplayData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error('CMS Data Error:', error);
  }

  return (
    <div className="min-h-screen">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#ffffff",
            color: "#374151",
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            duration: 3000,
            style: {
              background: "#F0FDF4",
              color: "#166534",
            },
            iconTheme: {
              primary: "#22C55E",
              secondary: "#FFFFFF",
            },
          },
          error: {
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            {user.isLoggedIn ? (
              <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">Login Status: </span>
                    <span className="font-bold text-green-600">Logged In</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">User ID: </span>
                    <span className="font-bold text-blue-600">
                      {user.userId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Name: </span>
                    <span className="font-bold text-blue-600">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Email: </span>
                    <span className="font-bold text-blue-600">
                      {user.email}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Login Status: </span>
                  <span className="font-bold text-red-600">Not Logged In</span>
                  <span className="text-gray-500 ml-4">
                    Log in to auto-fill your contact information
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PageHeader
        title="Get in Touch"
        description="We'd love to hear from you. Reach out with any questions or feedback."
      />

      <section
        id="form"
        className="py-20 relative bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="absolute inset-0 bg-purple-100 opacity-10 blur-3xl w-96 h-96 rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
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
                  Fill out the form below and we'll get back to you as soon as possible.
                  {user.isLoggedIn && (
                    <span className="block mt-2 text-sm text-blue-600 font-medium">
                      ✓ Your contact information has been automatically filled in
                    </span>
                  )}
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white rounded-2xl shadow-2xl border border-blue-200 backdrop-blur-sm bg-white/80 p-6 lg:p-8"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Name{" "}
                      {user.isLoggedIn && (
                        <span className="text-green-600 text-sm ml-2">
                          ✓ Auto-filled
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                      placeholder={
                        user.isLoggedIn
                          ? "Your name is auto-filled"
                          : "Enter your name"
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address{" "}
                      {user.isLoggedIn && (
                        <span className="text-green-600 text-sm ml-2">
                          ✓ Auto-filled
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-blue-100/40"
                      placeholder={
                        user.isLoggedIn
                          ? "Your email is auto-filled"
                          : "Enter your email"
                      }
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
                    placeholder="What's this message about?"
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
                  disabled={submitting || !user.isLoggedIn}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/40 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>

            <AnimatedSection id="contact-info" className="space-y-8">
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
                  Available Monday through Friday, 9am to 5pm local time.
                </p>
              </div>
              <div className="space-y-6 bg-white rounded-2xl shadow-2xl border border-blue-200 backdrop-blur-sm bg-white/80 p-6 lg:p-8">
                <ContactInfoItem
                  icon={<PhoneIcon />}
                  title="Phone"
                  text={displayData.phone_number}
                  actionText="Call us now"
                />
                <ContactInfoItem
                  icon={<EmailIcon />}
                  title="Email"
                  text={displayData.email}
                  actionText="Send an email"
                />
                <ContactInfoItem
                  icon={<LocationIcon />}
                  title="Address"
                  text={displayData.address}
                  actionText="Get directions"
                />
              </div>

              <div className="mt-8 bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Open Day:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      {displayData.opening_days_text}
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Close Day:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      {displayData.closing_day_text}
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Special Holidays:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      {displayData.special_holidays_text}
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">Open TIme:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      {displayData.open_time} - {displayData.close_time}
                    </div>
                  </div>
                </div>
              </div>

            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-block mb-2 bg-blue-50 px-4 py-1 rounded-full text-blue-600 font-medium">
              Global Presence
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Offices
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Visit us at one of our global locations.
            </p>
          </AnimatedSection>
          <AnimatedSection
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
            direction="up"
          >
            {officeLocations.map((office) => (
              <OfficeLocationCard key={office.city} office={office} />
            ))}
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-block mb-3 bg-blue-50 px-4 py-1 rounded-full">
              <span className="text-blue-600 font-medium">FAQ</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
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
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </AnimatedSection>
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
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
