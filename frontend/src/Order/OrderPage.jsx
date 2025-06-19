// 导入 React 的核心 Hooks: useState 用于管理组件状态, useEffect 用于处理副作用(如数据获取)。
import { useState, useEffect, useMemo } from "react";
// 导入 framer-motion 库，用于实现丰富的动画效果。
import { motion } from "framer-motion";
// 导入 PageHeader 组件，用于显示页面标题和描述。
import PageHeader from "../components/PageHeader";
// 导入自定义的 UserContext Hook，用于获取全局的用户状态。
import { useUser } from "../contexts/UserContext";

// 定义 OrderPage 组件，这是一个展示用户订单历史的页面。
const OrderPage = () => {
  // --- 状态管理 (State Management) ---

  // 从 UserContext 中获取当前用户信息。
  const { user } = useUser();
  // 定义一个 state 变量 `orders`，用于存储从 API 获取的原始订单列表，初始值为空数组。
  const [orders, setOrders] = useState([]);
  // 定义一个 state 变量 `loading`，用于跟踪数据加载状态，初始值为 false。
  const [loading, setLoading] = useState(false);
  // 定义一个 state 变量 `error`，用于存储API请求中发生的错误信息，初始值为 null。
  const [error, setError] = useState(null);
  // 定义一个 state 变量 `filters`，用于存储用户选择的过滤条件，包含类型、日期、支付方式和状态。
  const [filters, setFilters] = useState({
    type: "all",
    date: "all",
    paymentMethod: "all",
    status: "all",
  });
  // 定义一个 state 变量 `expandedOrder`，用于跟踪当前哪个订单被展开显示详情，初始值为 null。
  const [expandedOrder, setExpandedOrder] = useState(null);
  // 定义一个 state 变量 `cancellingOrders`，使用 Set 来存储正在被取消的订单ID，以防止重复点击。
  const [cancellingOrders, setCancellingOrders] = useState(new Set());
  // 定义一个 state 变量 `initialLoad`，用于标记是否是组件的首次加载，以显示初始加载动画。
  const [initialLoad, setInitialLoad] = useState(true);

  // --- 副作用钩子 (Side Effects - useEffect) ---

  // 此 useEffect 用于在组件首次挂载和用户信息变化时初始化订单数据。
  useEffect(() => {
    // 定义一个异步函数来初始化订单。
    const initializeOrders = async () => {
      // 标记为初始加载状态。
      setInitialLoad(true);

      // 检查用户是否已登录并且有用户ID。
      if (user.isLoggedIn && user.userId) {
        // 如果已登录，调用 fetchOrders 函数获取订单数据。
        await fetchOrders(user.userId);
      } else {
        // 如果未登录，将订单列表清空。
        setOrders([]);
      }

      // 取消初始加载状态。
      setInitialLoad(false);
    };

    // 调用初始化函数。
    initializeOrders();
    // 依赖项数组：当 user.isLoggedIn 或 user.userId 发生变化时，此 effect 将重新执行。
  }, [user.isLoggedIn, user.userId]);

  // --- 数据获取与处理函数 (Data Fetching & Handlers) ---

  // 定义一个辅助函数，用于生成API请求所需的HTTP头。
  const getHeaders = () => ({
    // 指定接受JSON格式的响应。
    Accept: "application/json",
    // 指定发送JSON格式的请求体。
    "Content-Type": "application/json",
    // 如果用户已登录并有token，则在请求头中加入Authorization字段。
    ...(user.token && { Authorization: `Bearer ${user.token}` }),
  });

  // 定义一个异步函数 `fetchOrders`，用于根据用户ID从服务器获取订单数据。
  const fetchOrders = async (userId) => {
    // 开始获取数据前，设置加载状态为 true，并清除之前的错误信息。
    setLoading(true);
    setError(null);
    try {
      // 构建获取订单的API URL，并附带用户ID作为查询参数。
      const url = `http://127.0.0.1:8000/api/get-orders?user_id=${userId}`;
      // 使用 fetch 函数发送 GET 请求。
      const response = await fetch(url, {
        method: "GET", // 请求方法。
        headers: getHeaders(), // 请求头。
      });

      // 如果响应状态码不是 "ok" (例如 404, 500)，则抛出错误。
      if (!response.ok) {
        const errorText = await response.text(); // 获取错误响应体文本。
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        ); // 抛出包含状态码和错误信息的错误。
      }

      // 解析响应的 JSON 数据。
      const data = await response.json();
      // 确保返回的数据是数组格式，如果不是则使用空数组，以增加代码健壮性。
      const ordersArray = Array.isArray(data) ? data : [];
      // 更新 `orders` state。
      setOrders(ordersArray);
    } catch (error) {
      // 捕获在 try 块中发生的任何错误。
      console.error("Error fetching orders:", error); // 在控制台打印错误信息。
      setError(error.message); // 将错误信息设置到 `error` state 中，以便在UI上显示。
      setOrders([]); // 获取失败时清空订单列表。
    } finally {
      // 无论请求成功还是失败，最后都将加载状态设置为 false。
      setLoading(false);
    }
  };

  // 定义一个异步函数 `refreshOrders`，用于手动刷新订单列表。
  const refreshOrders = async () => {
    // 只有在用户登录的情况下才执行刷新操作。
    if (user.isLoggedIn && user.userId) {
      await fetchOrders(user.userId);
    }
  };

  // 定义一个异步函数 `handleCancelOrder`，用于处理取消订单的逻辑。
  const handleCancelOrder = async (orderId) => {
    // 如果用户未登录，则设置错误信息并返回。
    if (!user.isLoggedIn) {
      setError("Please login to cancel orders");
      return;
    }

    try {
      // 将当前要取消的订单ID添加到 `cancellingOrders` 集合中，用于UI反馈（如显示加载动画）。
      setCancellingOrders((prev) => new Set(prev).add(orderId));

      // 发送 PUT 请求到取消订单的 API 端点。
      const response = await fetch(
        `http://127.0.0.1:8000/api/cancel-order/${orderId}`,
        {
          method: "PUT", // 请求方法。
          headers: getHeaders(), // 请求头。
          body: JSON.stringify({ user_id: user.userId }), // 请求体，包含用户ID以供后端验证。
        }
      );

      // 如果响应状态码不是 "ok"，则抛出错误。
      if (!response.ok) {
        const errorText = await response.text(); // 获取错误响应体文本。
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        ); // 抛出错误。
      }

      // 如果成功，更新本地的订单列表，将对应订单的状态修改为 'cancelled'，实现即时UI更新。
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (error) {
      // 捕获取消订单过程中发生的错误。
      console.error(`Error cancelling order ${orderId}:`, error); // 在控制台打印错误。
      setError(`Failed to cancel order: ${error.message}`); // 在UI上显示错误信息。
    } finally {
      // 无论成功还是失败，都将订单ID从 `cancellingOrders` 集合中移除。
      setCancellingOrders((prev) => {
        const newSet = new Set(prev); // 创建一个新的 Set 副本。
        newSet.delete(orderId); // 从副本中删除ID。
        return newSet; // 返回新的 Set。
      });
    }
  };

  // --- 派生状态与计算 (Derived State & Computations) ---

  // 使用 useMemo 优化过滤逻辑。
  // 仅当 `orders` 或 `filters` 状态发生变化时，才会重新计算 `filteredOrders`。
  // 这避免了在每次组件渲染时都执行昂贵的过滤操作。
  const filteredOrders = useMemo(() => {
    // 从原始订单列表开始过滤。
    let result = [...orders];

    // 根据订单类型过滤。
    if (filters.type !== "all") {
      result = result.filter((order) => order.type === filters.type);
    }
    // 根据日期过滤（今天）。
    if (filters.date === "today") {
      const today = new Date().toISOString().split("T")[0];
      result = result.filter(
        (order) => new Date(order.date).toISOString().split("T")[0] === today
      );
    }
    // 根据支付方式过滤。
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
    }
    // 根据订单状态过滤。
    if (filters.status !== "all") {
      result = result.filter(
        (order) => order.status?.toLowerCase() === filters.status
      );
    }

    // 返回最终过滤后的订单数组。
    return result;
  }, [orders, filters]); // 依赖项数组。

  // --- 辅助与格式化函数 (Helpers & Formatters) ---

  // 定义 `toggleOrderExpand` 函数，用于切换订单详情的展开和折叠状态。
  const toggleOrderExpand = (orderId) => {
    // 如果点击的订单已经是展开状态，则折叠它（设为null），否则展开它。
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // 定义 `handleFilterChange` 函数，用于更新过滤条件状态。
  const handleFilterChange = (filterType, value) => {
    // 使用函数式更新，基于前一个状态创建一个新对象。
    setFilters((prev) => ({
      ...prev, // 复制之前的过滤条件。
      [filterType]: value, // 更新指定的过滤条件。
    }));
  };

  // 根据订单状态返回不同的 Tailwind CSS 颜色类。
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

  // 根据订单类型返回易于阅读的标签文本。
  const getOrderTypeLabel = (type) =>
    type === "product" ? "Product Order" : "Package Order";
  // 根据订单类型返回不同的 Tailwind CSS 颜色类。
  const getOrderTypeColor = (type) =>
    type === "product"
      ? "bg-cyan-100 text-cyan-800"
      : "bg-blue-100 text-blue-800";

  // 格式化日期字符串为 "Month Day, Year" 格式。
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date"; // 如果日期格式无效，则返回一个提示。
    }
  };

  // 格式化价格，确保始终显示两位小数。
  const formatPrice = (price) => {
    const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
    return numPrice.toFixed(2);
  };

  // --- 渲染逻辑 (Render Logic) ---

  // 1. 初始加载状态渲染
  // 如果是首次加载，则显示一个全屏的加载动画。
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

  // 2. 用户未登录状态渲染
  // 如果用户未登录，则显示一个提示登录的消息页面。
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. 主要内容渲染（用户已登录）
  return (
    // 页面根容器，设置最小高度和背景色。
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部，显示标题和描述。 */}
      <PageHeader
        title="My Orders"
        description="View and manage all your orders here"
      />

      {/* 用户信息和刷新按钮区域 */}
      {user.isLoggedIn && (
        <div className="container mx-auto px-4 py-2">
          <div className="text-center text-sm text-gray-600">
            Welcome back, {user.name} (ID: {user.userId})
            <button
              onClick={refreshOrders}
              disabled={loading}
              className="ml-4 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded text-xs transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {/* 根据加载状态显示不同文本 */}
              {loading ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </div>
      )}

      {/* 错误信息显示区域 */}
      {error && (
        <div className="container mx-auto px-4 py-2">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
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
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* 过滤功能区域，使用 sticky 定位使其在滚动时固定在顶部。 */}
      <section className="py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 订单类型过滤器 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Order Type:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px] cursor-pointer"
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

            {/* 日期过滤器 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Date:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px] cursor-pointer"
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

            {/* 支付方式过滤器 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Payment Method:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px] cursor-pointer"
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

            {/* 状态过滤器 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-sm font-medium whitespace-nowrap">
                Status:
              </span>
              <div className="relative">
                <select
                  className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-blue-500 text-sm min-w-[100px] cursor-pointer"
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

            {/* 显示过滤后的订单总数 */}
            <div className="ml-auto bg-blue-500 px-4 py-2 rounded-lg shadow-md">
              <span className="text-white font-medium text-sm">
                Total: {filteredOrders.length} orders
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 订单列表区域 */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            {/* 条件渲染：检查是否有过滤后的订单 */}
            {filteredOrders.length === 0 ? (
              // 如果没有订单，显示 "无订单" 的提示信息。
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
                  {/* 根据原始订单列表是否为空，显示不同的提示文本。 */}
                  {orders.length === 0
                    ? "You don't have any orders yet"
                    : "No orders match your filter criteria"}
                </p>
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              // 如果有订单，则遍历并渲染每个订单卡片。
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  // 动态设置卡片的样式，包括边框、阴影和过渡效果。
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-200/60 
                  ${
                    order.type === "product"
                      ? "border-2 border-cyan-300/70"
                      : "border-2 border-blue-300/70"
                  } 
                  ${
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
                  {/* 订单卡片的头部，点击可展开/折叠 */}
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

                  {/* 订单详情，仅在 expandedOrder 与当前订单ID匹配时显示 */}
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
                          {/* 左侧：订单项目和总计 */}
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

                            {/* 价格总计部分 */}
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

                          {/* 右侧：订单信息、支付方式和操作按钮 */}
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="mb-5">
                              <h4 className="font-semibold mb-2 sm:mb-3 text-blue-800">
                                Order Information
                              </h4>
                              <div className="space-y-2 text-sm">
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
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Status:</span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status || "Processing"}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
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
                              {/* 条件渲染：只有在特定状态下才显示取消按钮 */}
                              {order.status?.toLowerCase() !== "cancelled" &&
                                order.status?.toLowerCase() !== "completed" &&
                                order.status?.toLowerCase() !== "delivered" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelOrder(order.id);
                                    }}
                                    disabled={
                                      cancellingOrders.has(order.id) ||
                                      !user.isLoggedIn
                                    }
                                    className={`w-full px-4 py-2 border rounded-lg font-medium transition-colors text-sm sm:text-base 
                                  ${
                                    cancellingOrders.has(order.id) ||
                                    !user.isLoggedIn
                                      ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
                                      : "border-red-500 text-red-500 hover:bg-red-50 cursor-pointer"
                                  }`}
                                  >
                                    {cancellingOrders.has(order.id) ? (
                                      // 正在取消时显示加载动画
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

// 导出 OrderPage 组件，以便在应用的其他部分使用。
export default OrderPage;
