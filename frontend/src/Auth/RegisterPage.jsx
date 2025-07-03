// src/Auth/RegisterPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      let strength = 0;
      if (value.length >= 1) strength += 1;
      if (value.length >= 4) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-600";
      default:
        return "bg-gray-200";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("Registration form data:", formData);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      console.log("Registration successful:", response.data);

      // 修复: 使用正确的token字段名
      if (response.data && response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("name", response.data.user.name);
        
        console.log("Stored user data:", {
          token: response.data.access_token,
          userId: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name
        });

        // 触发状态更新事件
        window.dispatchEvent(new Event("login-status-change"));
        navigate("/");
      } else {
        console.error("Invalid response structure:", response.data);
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join("\n"));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100">
        <AnimatedSection className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Create an Account</h1>
              <p className="text-gray-600">Join our community and get started today</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-lg mb-6"
              >
                {error.split("\n").map((msg, i) => (
                  <p key={i}>{msg}</p>
                ))}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                        <div className={`h-full rounded-full ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
                      </div>
                      <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                    </div>
                    <p className="text-xs text-gray-500">You can use simple passwords like number combinations</p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Terms of Service
                  </a>
                  and
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600 mb-4">Or sign up with</div>
              <div className="flex space-x-4">
                <button className="flex-1 flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button className="flex-1 flex items-center justify-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default RegisterPage;