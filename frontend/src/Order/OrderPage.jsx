import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/PageHeader";
import { useUser } from '../contexts/UserContext'; // 添加UserContext

const OrderPage = () => {
  const { user } = useUser(); // 获取当前用户信息
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    date: "all",
    paymentMethod: "all",
    status: "all",
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  const [initialLoad, setInitialLoad] = useState(true);

  // 调试信息
  useEffect(() => {
    console.log("OrderPage: Component mounted");
    console.log("OrderPage: User data:", user);
  }, [user]);

  // 修复的主要逻辑：只有在用户登录时才加载订单数据
  useEffect(() => {
    const initializeOrders = async () => {
      setInitialLoad(true);
      
      if (user.isLoggedIn && user.userId) {
        console.log("OrderPage: User is logged in, loading orders...");
        await fetchOrders(user.userId);
      } else {
        console.log("OrderPage: User not logged in, showing empty orders");
        // 用户未登录，设置空订单
        setOrders([]);
      }
      
      setInitialLoad(false);
    };

    initializeOrders();
  }, [user.isLoggedIn, user.userId]);

  const getHeaders = () => ({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
  });

  const fetchOrders = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      console.log("OrderPage: Fetching orders for user:", userId);

      const url = `http://127.0.0.1:8000/api/get-orders?user_id=${userId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("OrderPage: Orders fetched:", data);

      const ordersArray = Array.isArray(data) ? data : [];
      setOrders(ordersArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (user.isLoggedIn && user.userId) {
      await fetchOrders(user.userId);
    }
  };

  useEffect(() => {
    console.log("Filtering orders. Total orders:", orders.length);
    let result = [...orders];

    if (filters.type !== "all") {
      result = result.filter((order) => order.type === filters.type);
      console.log("After type filter:", result.length);
    }

    if (filters.date === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter((order) => {
        const orderDate = new Date(order.date).toISOString().split("T")[0];
        return orderDate === today;
      });
      console.log("After date filter:", result.length);
    }

    if (filters.paymentMethod !== "all") {
      const methodMap = {
        tng: "TNG",
        cash: "Cash",
        debit: "Debit Card",
        credit: "Credit Card",
      };
      result = result.filter(
        (order) => order.payment?.method === methodMap[filters.paymentMethod]
      );
      console.log("After payment method filter:", result.length);
    }

    if (filters.status !== "all") {
      result = result.filter(
        (order) => order.status?.toLowerCase() === filters.status
      );
      console.log("After status filter:", result.length);
    }

    console.log("Final filtered orders:", result);
    setFilteredOrders(result);
  }, [filters, orders]);

  const handleCancelOrder = async (orderId) => {
    if (!user.isLoggedIn) {
      setError("Please login to cancel orders");
      return;
    }

    try {
      setCancellingOrders((prev) => new Set(prev).add(orderId));

      console.log(`Attempting to cancel order ${orderId}`);

      const response = await fetch(
        `http://127.0.0.1:8000/api/cancel-order/${orderId}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            user_id: user.userId,
          }),
        }
      );

      console.log("Cancel response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cancel response error:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Cancel response data:", data);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      console.log(`Order ${orderId} successfully cancelled`);
    } catch (error) {
      console.error(`Error cancelling order ${orderId}:`, error);
      setError(`Failed to cancel order: ${error.message}`);
    } finally {
      setCancellingOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderTypeLabel = (type) => {
    return type === "product" ? "Product Order" : "Package Order";
  };

  const getOrderTypeColor = (type) => {
    return type === "product"
      ? "bg-cyan-100 text-cyan-800"
      : "bg-blue-100 text-blue-800";
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
    return numPrice.toFixed(2);
  };

  // 修复的加载逻辑：只在初始加载时显示loading页面
  if (initialLoad) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="My Orders"
          description="View and manage all your orders here"
        />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // 检查用户登录状态
  if (!user.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader
          title="My Orders"
          description="View and manage all your orders here"
        />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-orange-800">
              Login Required
            </h3>
            <p className="text-gray-600 mb-4">
              Please log in to view your orders
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHeader
        title="My Orders"
        description="View and manage all your orders here"
      />

      {/* User Info Display */}
      {user.isLoggedIn && (
        <div className="container mx-auto px-4 py-2">
          <div className="text-center text-sm text-gray-600">
            Welcome back, {user.name} (ID: {user.userId})
            <button
              onClick={refreshOrders}
              disabled={loading}
              className="ml-4 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded text-xs transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <section className="py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
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

            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Status:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px]"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
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
          <div className="space-y-6 sm:space-y-8">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 sm:py-12 bg-white rounded-2xl shadow-lg border border-blue-300/30 transition-all duration-300 hover:shadow-blue-200/50">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-6">
                  {orders.length === 0
                    ? "You don't have any orders yet"
                    : "No orders match your filter criteria"}
                </p>
                <button 
                  onClick={() => window.location.href = '/products'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Start Shopping
                </button>
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
                    order.status?.toLowerCase() === "delivered" ||
                    order.status?.toLowerCase() === "completed"
                      ? "border-l-4 border-l-green-500"
                      : order.status?.toLowerCase() === "processing"
                      ? "border-l-4 border-l-blue-500"
                      : order.status?.toLowerCase() === "shipped"
                      ? "border-l-4 border-l-purple-500"
                      : order.status?.toLowerCase() === "cancelled"
                      ? "border-l-4 border-l-red-500"
                      : order.status?.toLowerCase() === "pending"
                      ? "border-l-4 border-l-yellow-500"
                      : ""
                  }`}
                  style={{ boxShadow: "0 0 15px rgba(191, 219, 254, 0.3)" }}
                >
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
                          Order Date: {formatDate(order.date)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status || "Processing"}
                        </span>
                        <span className="font-semibold">
                          ${formatPrice(order.total)}
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
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

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
                          <div className="md:col-span-2">
                            <h4 className="font-semibold mb-3 sm:mb-4 text-blue-800">
                              Order Items
                            </h4>
                            <div className="space-y-3 sm:space-y-4">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item) => (
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
                                      onError={(e) => {
                                        e.target.src = "/placeholder.svg";
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm sm:text-base">
                                        {item.name}
                                      </h5>
                                      <p className="text-gray-600 text-xs sm:text-sm">
                                        ${formatPrice(item.price)} x{" "}
                                        {item.quantity}
                                      </p>
                                      {item.description && (
                                        <p className="text-gray-500 text-xs mt-1 italic">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <span className="font-semibold text-sm sm:text-base">
                                        $
                                        {formatPrice(
                                          item.price * item.quantity
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-500 text-center py-4">
                                  No items found for this order
                                </div>
                              )}
                            </div>

                            <div className="mt-5 pt-5 border-t border-gray-200">
                              <div className="flex justify-between mb-2 text-sm sm:text-base">
                                <span className="text-gray-600">Subtotal</span>
                                <span>
                                  $
                                  {order.items && order.items.length > 0
                                    ? formatPrice(
                                        order.items.reduce(
                                          (sum, item) =>
                                            sum + item.price * item.quantity,
                                          0
                                        )
                                      )
                                    : formatPrice(
                                        parseFloat(order.total) -
                                          parseFloat(order.tax || 0)
                                      )}
                                </span>
                              </div>
                              <div className="flex justify-between mb-2 text-sm sm:text-base">
                                <span className="text-gray-600">Tax</span>
                                <span>${formatPrice(order.tax || 0)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-base sm:text-lg mt-2 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>${formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>

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
                                  <span>{formatDate(order.date)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status || "Processing"}
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
                                {order.table && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Table:
                                    </span>
                                    <span>{order.table.number}</span>
                                  </div>
                                )}
                                {order.duration && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Duration:
                                    </span>
                                    <span>{order.duration.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mb-5">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800">
                                Payment Method
                              </h4>
                              <div className="text-gray-600 text-sm sm:text-base">
                                <p className="font-medium">
                                  {order.payment?.method || "Not specified"}
                                </p>
                                {order.payment?.last4 && (
                                  <p className="mt-1">
                                    **** **** **** {order.payment.last4}
                                    {order.payment.expiryDate && (
                                      <>
                                        <br />
                                        Expiry Date: {order.payment.expiryDate}
                                      </>
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                              {order.status?.toLowerCase() !== "cancelled" &&
                                order.status?.toLowerCase() !== "completed" &&
                                order.status?.toLowerCase() !== "delivered" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelOrder(order.id);
                                    }}
                                    disabled={cancellingOrders.has(order.id) || !user.isLoggedIn}
                                    className={`w-full px-4 py-2 border rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                      cancellingOrders.has(order.id) || !user.isLoggedIn
                                        ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                                        : "border-red-500 text-red-500 hover:bg-red-50"
                                    }`}
                                  >
                                    {cancellingOrders.has(order.id) ? (
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                        Cancelling...
                                      </div>
                                    ) : (
                                      "Cancel Order"
                                    )}
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderPage;