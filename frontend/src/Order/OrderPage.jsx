"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";

const OrderPage = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-12345",
      date: "2023-05-15",
      status: "Delivered",
      total: 129.99,
      items: [
        {
          id: 1,
          name: "Product 1",
          price: 49.99,
          quantity: 1,
          image: "https://via.placeholder.com/100",
        },
        {
          id: 2,
          name: "Product 2",
          price: 79.99,
          quantity: 1,
          image: "https://via.placeholder.com/100",
        },
      ],
      shipping: {
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "USA",
      },
      payment: {
        method: "Credit Card",
        last4: "1234",
        expiryDate: "05/25",
      },
    },
    {
      id: "ORD-67890",
      date: "2023-04-22",
      status: "Processing",
      total: 89.99,
      items: [
        {
          id: 3,
          name: "Product 3",
          price: 89.99,
          quantity: 1,
          image: "https://via.placeholder.com/100",
        },
      ],
      shipping: {
        address: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zip: "90001",
        country: "USA",
      },
      payment: {
        method: "PayPal",
        email: "user@example.com",
      },
    },
    {
      id: "ORD-24680",
      date: "2023-03-10",
      status: "Cancelled",
      total: 159.98,
      items: [
        {
          id: 4,
          name: "Product 4",
          price: 59.99,
          quantity: 2,
          image: "https://via.placeholder.com/100",
        },
        {
          id: 5,
          name: "Product 5",
          price: 39.99,
          quantity: 1,
          image: "https://via.placeholder.com/100",
        },
      ],
      shipping: {
        address: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zip: "60007",
        country: "USA",
      },
      payment: {
        method: "Credit Card",
        last4: "5678",
        expiryDate: "09/24",
      },
    },
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 md:py-16 lg:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Your Orders
            </h1>
            <p className="text-base sm:text-lg md:text-xl mt-4">
              Track and manage all your orders in one place.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Orders Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="space-y-6 sm:space-y-8">
            {orders.length === 0 ? (
              <div className="text-center py-10 sm:py-12 bg-white rounded-2xl shadow-lg border border-blue-300/30 transition-all duration-300 hover:shadow-blue-200/50">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet.
                </p>
                <a href="/products" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm sm:text-base">
                  Start Shopping
                </a>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg border border-blue-300/40 overflow-hidden transition-all duration-300 hover:shadow-blue-200/60 hover:border-blue-400/50"
                  style={{ boxShadow: "0 0 15px rgba(191, 219, 254, 0.3)" }}
                >
                  {/* Order Header */}
                  <div
                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                          Order #{order.id}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="font-semibold">
                          ${order.total.toFixed(2)}
                        </span>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            expandedOrder === order.id
                              ? "transform rotate-180"
                              : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-blue-50/30"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                          {/* Order Items */}
                          <div className="md:col-span-2">
                            <h4 className="font-semibold mb-3 sm:mb-4 text-blue-800">Order Items</h4>
                            <div className="space-y-3 sm:space-y-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-start gap-3 sm:gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow transition-all duration-200"
                                >
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm sm:text-base">{item.name}</h5>
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-semibold text-sm sm:text-base">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-5 pt-5 border-t border-gray-200">
                              <div className="flex justify-between mb-2 text-sm sm:text-base">
                                <span className="text-gray-600">Subtotal</span>
                                <span>
                                  $
                                  {order.items
                                    .reduce(
                                      (sum, item) =>
                                        sum + item.price * item.quantity,
                                      0
                                    )
                                    .toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between mb-2 text-sm sm:text-base">
                                <span className="text-gray-600">Shipping</span>
                                <span>$5.99</span>
                              </div>
                              <div className="flex justify-between mb-2 text-sm sm:text-base">
                                <span className="text-gray-600">Tax</span>
                                <span>$4.00</span>
                              </div>
                              <div className="flex justify-between font-semibold text-base sm:text-lg mt-2 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping & Payment Info */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="mb-5">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800">
                                Shipping Information
                              </h4>
                              <address className="not-italic text-gray-600 text-sm sm:text-base">
                                <p>{order.shipping.address}</p>
                                <p>
                                  {order.shipping.city}, {order.shipping.state}{" "}
                                  {order.shipping.zip}
                                </p>
                                <p>{order.shipping.country}</p>
                              </address>
                            </div>

                            <div className="mb-5">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800">
                                Payment Method
                              </h4>
                              <div className="text-gray-600 text-sm sm:text-base">
                                <p>{order.payment.method}</p>
                                {order.payment.last4 && (
                                  <p>
                                    **** **** **** {order.payment.last4}
                                    <br />
                                    Expires: {order.payment.expiryDate}
                                  </p>
                                )}
                                {order.payment.email && (
                                  <p>{order.payment.email}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm sm:text-base">
                                Track Order
                              </button>
                              <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm sm:text-base">
                                Return Items
                              </button>
                              <button className="w-full px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors text-sm sm:text-base">
                                Need Help?
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))
            )}
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default OrderPage;
