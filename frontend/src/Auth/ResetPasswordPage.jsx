"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedSection from "../components/AnimatedSection"

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // For demo purposes, just log the email
      console.log("Reset password requested for:", email)
      setSuccess(true)
    } catch (err) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <AnimatedSection className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h1>
              <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {success ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-600 p-4 rounded-lg mb-6"
              >
                <p className="font-medium">Password Reset Email Sent!</p>
                <p className="mt-1">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check
                  your spam folder.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default ResetPasswordPage
