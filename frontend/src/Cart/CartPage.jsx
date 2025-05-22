import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import AnimatedSection from "../components/AnimatedSection"
import PageHeader from "../components/PageHeader"

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Package",
      price: 99.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Standard Package",
      price: 59.99,
      quantity: 1,
      image: "https://via.placeholder.com/100",
    },
  ])

  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [isHovering, setIsHovering] = useState(null)

  // 添加鼠标悬停效果
  const handleMouseEnter = (id) => {
    setIsHovering(id)
  }

  const handleMouseLeave = () => {
    setIsHovering(null)
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    // Simple promo code logic for demo
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true)
      setPromoDiscount(10)
    } else {
      setPromoApplied(false)
      setPromoDiscount(0)
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax - promoDiscount

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      
      {/* Hero Section */}
      <PageHeader
        title="Your Shopping Cart"
        description="Review your selected items and proceed to checkout when you're ready."
      />

      <div className="container mx-auto px-4 py-16">
        <AnimatedSection>

          {cartItems.length === 0 ? (
            <motion.div 
              className="bg-white rounded-2xl p-10 text-center border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "linear-gradient(to bottom right, #ffffff, #f0f7ff)",
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
              }}
            >
              <div className="relative w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                <div className="absolute inset-0 rounded-full border border-blue-200 opacity-50 animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Explore our products and find something you'll love!</p>
              <Link
                to="/products"
                className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 inline-flex items-center gap-2"
              >
                <span>Browse Products</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <motion.div 
                  className="bg-white rounded-2xl overflow-hidden border border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f8faff)",
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                  }}
                >
                  <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Cart Items <span className="ml-2 text-sm bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full">{cartItems.length}</span>
                    </h2>
                  </div>

                  <div className="divide-y divide-blue-100">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        className={`p-6 flex flex-wrap md:flex-nowrap items-center transition-all duration-200 ${isHovering === item.id ? 'bg-blue-50/50' : 'bg-white'}`}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-full md:w-auto md:mr-6 mb-4 md:mb-0 flex justify-center">
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <img
                              src="assets/About/about-us.png"
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-xl border border-blue-100 shadow-md transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-lg text-gray-800">{item.name}</h3>
                          <p className="text-blue-600 font-semibold mb-3">${item.price.toFixed(2)}</p>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded-l-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                              className="w-12 h-8 border-t border-b border-blue-200 text-center focus:outline-none bg-white"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-blue-200 rounded-r-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col items-end">
                          <span className="font-semibold text-lg text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm mt-2 flex items-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div 
                  className="bg-white rounded-2xl overflow-hidden border border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{
                    background: "linear-gradient(145deg, #ffffff, #f8faff)",
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                  }}
                >
                  <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between items-center py-2 text-green-600">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                          </svg>
                          Promo Discount
                        </span>
                        <span className="font-medium">-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-blue-100">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo Code"
                          className="flex-grow px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all font-medium shadow-sm hover:shadow-md"
                        >
                          Apply
                        </button>
                      </div>
                      {promoApplied && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-100 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Promo code applied successfully!
                        </motion.div>
                      )}
                    </div>

                    <button className="w-full py-4 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Proceed to Checkout
                    </button>

                    <div className="text-center mt-6">
                      <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  )
}

export default CartPage
