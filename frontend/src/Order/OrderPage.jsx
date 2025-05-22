import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "../components/AnimatedSection";
import PageHeader from "../components/PageHeader"
const OrderPage = () => {
  // Order data
  const [orders] = useState([
    {
      id: "ORD-12345",
      date: "2023-05-15",
      status: "Delivered",
      total: 129.99,
      type: "product", // Product order
      items: [
        {
          id: 1,
          name: "Fishing Rod Pro",
          price: 49.99,
          quantity: 1,
          image: "assets/About/about-us.png",
        },
        {
          id: 2,
          name: "Fishing Line Premium",
          price: 79.99,
          quantity: 1,
          image: "assets/About/about-us.png",
        },
      ],
      payment: {
        method: "Credit Card",
        last4: "1234",
        expiryDate: "05/25",
      },
      tax: 4.0,
    },
    {
      id: "ORD-67890",
      date: "2023-05-18", // Today's order
      status: "Processing",
      total: 189.99,
      type: "package", // Package order
      items: [
        {
          id: 3,
          name: "Weekend Fishing Package",
          price: 189.99,
          quantity: 1,
          image: "assets/About/about-us.png",
          description:
            "Includes fishing rod, fishing line, bait and a day at lakeside spot",
        },
      ],
      payment: {
        method: "TNG",
        phone: "012-3456789",
      },
      tax: 5.99,
    },
    {
      id: "ORD-24680",
      date: "2023-03-10",
      status: "Cancelled",
      total: 159.98,
      type: "product", // Product order
      items: [
        {
          id: 4,
          name: "Bait Set",
          price: 59.99,
          quantity: 2,
          image: "assets/About/about-us.png",
        },
        {
          id: 5,
          name: "Fishing Hat",
          price: 39.99,
          quantity: 1,
          image: "assets/About/about-us.png",
        },
      ],
      payment: {
        method: "Cash",
      },
      tax: 4.5,
    },
    {
      id: "ORD-13579",
      date: "2023-04-05",
      status: "Delivered",
      total: 299.99,
      type: "package", // Package order
      items: [
        {
          id: 6,
          name: "Family Fishing Package",
          price: 299.99,
          quantity: 1,
          image: "assets/About/about-us.png",
          description:
            "Complete fishing equipment for 4 people and a day at lakeside spot",
        },
      ],
      payment: {
        method: "Debit Card",
        last4: "5678",
        expiryDate: "08/26",
      },
      tax: 7.5,
    },
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    type: "all", // all, product, package
    date: "all", // all, today
    paymentMethod: "all", // all, tng, cash, debit, credit
  });

  // Expanded order ID
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filtered orders
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Update filtered orders when filter conditions change
  useEffect(() => {
    let result = [...orders];

    // Filter by type
    if (filters.type !== "all") {
      result = result.filter((order) => order.type === filters.type);
    }

    // Filter by date
    if (filters.date === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (order) => new Date(order.date).toISOString().split("T")[0] === today
      );
    }

    // Filter by payment method
    if (filters.paymentMethod !== "all") {
      const methodMap = {
        tng: "TNG",
        cash: "Cash",
        debit: "Debit Card",
        credit: "Credit Card",
      };
      result = result.filter(
        (order) => order.payment.method === methodMap[filters.paymentMethod]
      );
    }

    setFilteredOrders(result);
  }, [filters, orders]);

  // Toggle order expand/collapse
  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Get status color
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

  // Get order type label
  const getOrderTypeLabel = (type) => {
    return type === "product" ? "Product Order" : "Package Order";
  };

  // Get order type color
  const getOrderTypeColor = (type) => {
    return type === "product"
      ? "bg-cyan-100 text-cyan-800"
      : "bg-blue-100 text-blue-800";
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHeader
        title="My Orders"
        description="View and manage all your orders here"
      />

      {/* Filters Section */}
      <section className="py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Order Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Order Type:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px]"
                  value={filters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="product">Product Orders</option>
                  <option value="package">Package Orders</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Date:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px]"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="today">Today's Orders</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Payment Method:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px]"
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    handleFilterChange("paymentMethod", e.target.value)
                  }
                >
                  <option value="all">All</option>
                  <option value="tng">TNG</option>
                  <option value="cash">Cash</option>
                  <option value="debit">Debit Card</option>
                  <option value="credit">Credit Card</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Order Count Display */}
            <div className="ml-auto bg-blue-500 px-4 py-2 rounded-lg shadow-md">
              <span className="text-white font-medium text-sm">
                Total: {filteredOrders.length} orders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection className="space-y-6 sm:space-y-8">
            {filteredOrders.length === 0 ? (
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
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-6">
                  You don't have any orders matching your filter criteria
                </p>
                <a
                  href="/products"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Start Shopping
                </a>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-200/60 ${
                    order.type === "product"
                      ? "border-2 border-cyan-300/70"
                      : "border-2 border-blue-300/70"
                  } ${
                    order.status === "Delivered"
                      ? "border-l-4 border-l-green-500"
                      : order.status === "Processing"
                      ? "border-l-4 border-l-blue-500"
                      : order.status === "Shipped"
                      ? "border-l-4 border-l-purple-500"
                      : order.status === "Cancelled"
                      ? "border-l-4 border-l-red-500"
                      : ""
                  }`}
                  style={{ boxShadow: "0 0 15px rgba(191, 219, 254, 0.3)" }}
                >
                  {/* Order Header */}
                  <div
                    className="p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            Order #{order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${getOrderTypeColor(
                              order.type
                            )}`}
                          >
                            {getOrderTypeLabel(order.type)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm sm:text-base">
                          Order Date:{" "}
                          {new Date(order.date).toLocaleDateString()}
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
                            <h4 className="font-semibold mb-3 sm:mb-4 text-blue-800">
                              Order Items
                            </h4>
                            <div className="space-y-3 sm:space-y-4">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className={`flex items-start gap-3 sm:gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow transition-all duration-200 border ${
                                    order.type === "product"
                                      ? "border-cyan-200"
                                      : "border-blue-200"
                                  }`}
                                >
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm sm:text-base">
                                      {item.name}
                                    </h5>
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </p>
                                    {item.description && (
                                      <p className="text-gray-500 text-xs mt-1 italic">
                                        {item.description}
                                      </p>
                                    )}
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
                                <span className="text-gray-600">Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-base sm:text-lg mt-2 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="mb-5">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800">
                                Order Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Order ID:
                                  </span>
                                  <span className="font-medium">
                                    {order.id}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Order Date:
                                  </span>
                                  <span>
                                    {new Date(order.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Order Type:
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${getOrderTypeColor(
                                      order.type
                                    )}`}
                                  >
                                    {getOrderTypeLabel(order.type)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mb-5">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800">
                                Payment Method
                              </h4>
                              <div className="text-gray-600 text-sm sm:text-base">
                                <p className="font-medium">
                                  {order.payment.method}
                                </p>
                                {order.payment.last4 && (
                                  <p className="mt-1">
                                    **** **** **** {order.payment.last4}
                                    <br />
                                    Expiry Date: {order.payment.expiryDate}
                                  </p>
                                )}
                                {order.payment.email && (
                                  <p className="mt-1">{order.payment.email}</p>
                                )}
                                {order.payment.phone && (
                                  <p className="mt-1">{order.payment.phone}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base">
                                View Details
                              </button>
                              {order.status !== "Cancelled" && (
                                <button className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm sm:text-base">
                                  Cancel Order
                                </button>
                              )}
                              <button className="w-full px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors text-sm sm:text-base">
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
