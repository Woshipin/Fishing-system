// src/Contact/ContactPage.jsx

// 导入 React 核心库中的 useState 和 useEffect Hooks，用于状态管理和副作用处理。
import { useState, useEffect } from "react";
// 从 framer-motion 库导入 motion 和 AnimatePresence，用于创建丰富的动画效果。
import { motion, AnimatePresence } from "framer-motion";
// 从 lucide-react 库导入图标组件，用于美化界面。
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
// **新增**：从 react-hot-toast 库导入 toast 函数（用于触发通知）和 Toaster 组件（用于渲染通知）。
import toast, { Toaster } from "react-hot-toast";
// 导入自定义的动画容器组件，用于分段加载动画。
import AnimatedSection from "../components/AnimatedSection";
// 导入自定义的页面头部组件。
import PageHeader from "../components/PageHeader";
// 导入自定义的 UserContext Hook，用于获取全局用户状态。
import { useUser } from "../contexts/UserContext";

// --- 可重用的图标组件 (代码无变化) ---
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

// --- 可重用的 UI 组件 (代码无变化) ---
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

// --- 主页面组件 ---
const ContactPage = () => {
  // 使用 useUser Hook 从上下文中获取当前用户信息。
  const { user } = useUser();
  // 定义 API 的基础 URL，方便统一管理。
  const API_BASE_URL = "http://localhost:8000/api";

  // 使用 useEffect 监听 user 对象的变化，并在控制台打印调试信息。
  useEffect(() => {
    console.log("ContactPage: Component mounted");
    console.log("ContactPage: User data:", user);
  }, [user]);

  // 使用 useState 管理联系表单的数据。
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  // 使用 useState 管理表单是否正在提交中，用于UI反馈（如加载动画）。
  const [submitting, setSubmitting] = useState(false);

  // **移除**：旧的 formStatus 状态不再需要，已被 react-hot-toast 替代。

  // 当用户信息变化时，自动填充表单。
  useEffect(() => {
    if (user.isLoggedIn) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
      console.log("ContactPage: Form data updated with user info:", {
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  // 表单输入框内容变化时的统一处理函数。
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 表单提交处理函数，现在使用 react-hot-toast 来显示通知。
  const handleSubmit = async (e) => {
    // 阻止表单提交的默认行为（即页面刷新）。
    e.preventDefault();

    // 前端验证：确保用户已登录才能提交。
    if (!user.isLoggedIn) {
      // **改进**：使用 toast.error 弹出错误通知。
      toast.error("Please log in before sending a message.");
      return;
    }

    // 开始提交，设置 `submitting` 状态为 true。
    setSubmitting(true);
    // 打印将要发送到API的数据，便于调试。
    console.log("ContactPage: Submitting form data to API:", formData);

    try {
      // 使用 fetch 函数向 Laravel 后端发送 POST 请求。
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

      // 解析服务器返回的 JSON 响应数据。
      const result = await response.json();
      // 检查HTTP响应状态码，如果不是成功状态（2xx），则抛出错误。
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      // **改进**：如果请求成功，使用 toast.success 弹出成功通知。
      toast.success("Thank you! Your Conact Message has been sent.");
      // 清空主题和消息输入框，保留姓名和邮箱。
      setFormData((prev) => ({ ...prev, subject: "", message: "" }));
    } catch (error) {
      // **改进**：如果发生错误，使用 toast.error 弹出包含错误信息的失败通知。
      toast.error(`Submission failed: ${error.message}`);
      console.error("ContactPage: Failed to submit form:", error);
    } finally {
      // 无论成功还是失败，最后都将 `submitting` 状态设为 false。
      setSubmitting(false);
    }
  };

  // 静态数据（无变化）。
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

  // 返回页面的JSX结构，用于渲染UI。
  return (
    <div className="min-h-screen">
      {/* 
        **新增**：Toaster 组件是所有弹出通知的容器。
        它应该被放置在组件树的顶层，以便覆盖整个页面。
        这里的定制化选项使其外观更美观，并与您的设计系统保持一致。
      */}
      <Toaster
        position="top-right" // 设置通知出现在右上角。
        reverseOrder={false} // 新通知出现在旧通知上方。
        toastOptions={{
          // 为所有通知定义通用样式。
          className: "",
          duration: 5000, // 默认持续时间为5秒。
          style: {
            background: "#ffffff", // 背景色。
            color: "#374151", // 文本颜色。
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", // 阴影。
            borderRadius: "8px", // 圆角。
            padding: "16px", // 内边距。
          },
          // 为特定类型的通知定义样式。
          success: {
            duration: 3000, // 成功通知持续3秒。
            style: {
              background: "#F0FDF4", // 浅绿色背景。
              color: "#166534", // 深绿色文字。
            },
            iconTheme: {
              primary: "#22C55E", // 绿色图标。
              secondary: "#FFFFFF",
            },
          },
          error: {
            style: {
              background: "#FEF2F2", // 浅红色背景。
              color: "#991B1B", // 深红色文字。
            },
            iconTheme: {
              primary: "#EF4444", // 红色图标。
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      {/* 用户状态显示区域 */}
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

      {/* 页面头部组件 */}
      <PageHeader
        title="Get in Touch"
        description="We'd love to hear from you. Reach out with any questions or feedback."
      />

      {/* 联系表单和信息区域 */}
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
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                  {user.isLoggedIn && (
                    <span className="block mt-2 text-sm text-blue-600 font-medium">
                      ✓ Your contact information has been automatically filled
                      in
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
              {/* **移除**：旧的 AnimatePresence 和 motion.div 提示信息已被删除。 */}
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
                  text="+1 (555) 123-4567"
                  actionText="Call us now"
                />
                <ContactInfoItem
                  icon={<EmailIcon />}
                  title="Email"
                  text="info@example.com"
                  actionText="Send an email"
                />
                <ContactInfoItem
                  icon={<LocationIcon />}
                  title="Address"
                  text="123 Main Street, New York, NY 10001"
                  actionText="Get directions"
                />
              </div>
              <div className="mt-8 bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl border border-blue-200 shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-md">
                    <span className="text-gray-600 font-medium">
                      Monday - Friday:
                    </span>
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
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Closed</span>
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

// 导出 ContactPage 组件，使其可以在其他文件中被导入和使用。
export default ContactPage;
