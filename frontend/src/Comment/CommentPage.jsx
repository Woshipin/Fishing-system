// CommentPage.jsx

// 导入 React 核心库，以及用于状态管理 (useState) 和副作用处理 (useEffect) 的 Hooks。
import React, { useState, useEffect } from "react";
// 从 lucide-react 库导入一系列图标组件，用于美化用户界面。
import {
  Heart,
  MessageCircle,
  Send,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
// **新增**：从 react-hot-toast 库导入 toast 函数（用于触发通知）和 Toaster 组件（用于渲染通知）。
import toast, { Toaster } from "react-hot-toast";
// 导入自定义的 UserContext Hook，用于在组件中访问和使用当前登录用户的信息。
import { useUser } from "../contexts/UserContext";

// 定义 CommentPage 组件，这是一个功能完整的评论区页面。
const CommentPage = () => {
  // 使用 useUser Hook 获取全局用户上下文中的用户信息。
  const { user } = useUser();
  // 使用 useState Hook 定义组件的各种状态。
  const [comments, setComments] = useState([]); // 存储从API获取的评论列表。
  const [newComment, setNewComment] = useState(""); // 存储用户正在输入的新评论内容。
  const [replyingTo, setReplyingTo] = useState(null); // 存储当前正在回复的评论ID，null表示没有回复任何评论。
  const [replyContent, setReplyContent] = useState(""); // 存储用户正在输入的回复内容。
  const [sortBy, setSortBy] = useState("newest"); // 存储评论的排序方式，默认为 "newest" (最新)。
  const [currentPage, setCurrentPage] = useState(1); // 存储当前评论列表的页码。
  const [loading, setLoading] = useState(false); // 标记是否正在从API加载评论数据。
  const [submitting, setSubmitting] = useState(false); // 标记是否正在提交新评论或回复。
  // **移除**：旧的 error 状态不再需要，已被 react-hot-toast 替代。

  // 定义每页显示的评论数量。
  const commentsPerPage = 10;
  // 定义后端API的基础URL，方便统一管理和修改。
  const API_BASE_URL = "http://localhost:8000/api";

  // 使用 useEffect Hook 在组件挂载或用户信息更新时打印调试信息。
  useEffect(() => {
    console.log("CommentPage: Component mounted");
    console.log("CommentPage: User data:", user);
  }, [user]);

  // 异步函数：从API获取评论列表。
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(user.token && { Authorization: `Bearer ${user.token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedComments = Array.isArray(data)
        ? data
        : data.comments || [];
      setComments(
        processedComments.map((comment) => ({
          ...comment,
          replies: comment.replies || [],
        }))
      );
    } catch (error) {
      console.error("Failed to fetch comments from API:", error);
      // **改进**：使用 toast.error 弹出加载失败的通知。
      toast.error("Failed to load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 异步函数：向API提交一条新的评论。
  const postComment = async (commentData) => {
    const response = await fetch(`${API_BASE_URL}/add-comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(user.token && { Authorization: `Bearer ${user.token}` }),
      },
      body: JSON.stringify({
        content: commentData.content,
        user_id: user.userId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  };

  // 异步函数：向API提交一条对现有评论的回复。
  const postReply = async (commentId, replyData) => {
    const response = await fetch(
      `${API_BASE_URL}/comments/${commentId}/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(user.token && { Authorization: `Bearer ${user.token}` }),
        },
        body: JSON.stringify({
          content: replyData.content,
          user_id: user.userId,
        }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  };

  // 异步函数：向API发送点赞请求（可用于评论或回复）。
  const likeComment = async (commentId, isReply = false, replyId = null) => {
    const endpoint = isReply
      ? `${API_BASE_URL}/comments/${commentId}/replies/${replyId}/like`
      : `${API_BASE_URL}/comments/${commentId}/like`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(user.token && { Authorization: `Bearer ${user.token}` }),
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  };

  // 使用 useEffect Hook，在组件第一次挂载时调用 fetchComments 函数来获取初始数据。
  useEffect(() => {
    fetchComments();
  }, []);

  // 工具函数（无变化）。
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString();
  };
  const getSortedComments = () => {
    return [...comments].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  };
  const getPaginatedComments = () => {
    const sorted = getSortedComments();
    const startIndex = (currentPage - 1) * commentsPerPage;
    return sorted.slice(startIndex, startIndex + commentsPerPage);
  };
  const getTotalPages = () => Math.ceil(comments.length / commentsPerPage);
  const getCommentStats = () => {
    const replies = comments.reduce(
      (acc, comment) => acc + (comment.replies?.length || 0),
      0
    );
    return { total: comments.length, replies };
  };

  // 事件处理函数：处理添加新评论的逻辑。
  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    // **改进**：使用 toast 通知代替 setError。
    if (!user.isLoggedIn) {
      toast("Please log in to post a comment.", { icon: "🔒" });
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await postComment({ content: newComment });
      setNewComment("");
      setCurrentPage(1);
      await fetchComments();
      // **改进**：添加成功发布的 toast 通知。
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.error("CommentPage: Failed to add comment:", error);
      // **改进**：使用 toast.error 显示错误信息。
      toast.error(`Failed to post comment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 事件处理函数：处理添加新回复的逻辑。
  const handleAddReply = async (commentId) => {
    // **改进**：使用 toast 通知代替 setError。
    if (!user.isLoggedIn) {
      toast("Please log in to reply.", { icon: "🔒" });
      return;
    }
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await postReply(commentId, { content: replyContent });
      setReplyingTo(null);
      setReplyContent("");
      await fetchComments();
      // **改进**：添加成功发布的 toast 通知。
      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("CommentPage: Failed to add reply:", error);
      // **改进**：使用 toast.error 显示错误信息。
      toast.error(`Failed to post reply: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 事件处理函数：处理点赞操作（乐观更新）。
  const handleLike = async (commentId, isReply = false, replyId = null) => {
    // **改进**：使用 toast 通知代替 setError。
    if (!user.isLoggedIn) {
      toast("Please log in to like comments.", { icon: "🔒" });
      return;
    }

    // 乐观更新 UI
    setComments((currentComments) =>
      currentComments.map((comment) => {
        if (isReply && comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === replyId
                ? { ...reply, likes: (reply.likes || 0) + 1 }
                : reply
            ),
          };
        } else if (!isReply && comment.id === commentId) {
          return { ...comment, likes: (comment.likes || 0) + 1 };
        }
        return comment;
      })
    );

    try {
      await likeComment(commentId, isReply, replyId);
    } catch (error) {
      console.error("CommentPage: Failed to like:", error);
      // **改进**：使用 toast.error 显示错误信息。
      toast.error(`Failed to like: ${error.message}`);
      // 回滚 UI
      await fetchComments();
    }
  };

  // **移除**：旧的 handleRetry 函数不再需要。

  const stats = getCommentStats();
  const totalPages = getTotalPages();
  const paginatedComments = getPaginatedComments();

  // 返回组件的 JSX 结构，用于在浏览器中渲染。
  return (
    // 最外层容器，设置了背景渐变色。
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 
        **新增**：Toaster 组件是所有弹出通知的“渲染容器”。
        它应该被放置在组件树的顶层，以便覆盖整个页面。
        这里的定制化选项使其外观更美观，并与您的设计系统保持一致。
      */}
      <Toaster
        position="top-right" // 设置通知出现在右上角。
        reverseOrder={false} // 新通知出现在旧通知上方。
        toastOptions={{
          // 为所有通知定义通用样式。
          duration: 4000, // 默认持续时间为4秒。
          style: {
            background: "#ffffff", // 背景色。
            color: "#374151", // 文本颜色。
            boxShadow:
              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #E5E7EB",
          },
          // 为特定类型的通知定义样式。
          success: {
            style: {
              background: "#F0FDF4",
              color: "#166534",
              border: "1px solid #A7F3D0",
            },
            iconTheme: { primary: "#22C55E", secondary: "#FFFFFF" },
          },
          error: {
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #FECACA",
            },
            iconTheme: { primary: "#EF4444", secondary: "#FFFFFF" },
          },
        }}
      />

      {/* 用户状态显示区域 (无变化) */}
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
                    Please log in to participate in the discussion
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主内容容器 */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* 页面头部区域 (无变化) */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 shadow-blue-200/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 p-8 text-white relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Community Hub</h1>
              </div>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                Connect, share, and engage with our vibrant community. Your
                voice matters!
              </p>
              <div className="flex flex-wrap gap-6 text-base">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                  <MessageCircle className="w-5 h-5" />
                  <span>{stats.total} Comments</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                  <Heart className="w-5 h-5" />
                  <span>{stats.replies} Replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* **移除**：旧的错误信息显示区域已被删除。 */}

        {/* 评论表单区域 */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 shadow-blue-200/50 p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            Share Your Thoughts
          </h3>
          {user.isLoggedIn ? (
            <form
              onSubmit={handleAddComment}
              className="flex items-start gap-6"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-blue-200 shadow-blue-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:shadow-blue-400/50 transition-all resize-none text-lg"
                  rows="4"
                  disabled={submitting}
                  required
                />
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl text-gray-500 mb-2">
                Please log in to participate in the discussion
              </p>
              <p className="text-gray-400">
                Log in to post comments and replies
              </p>
            </div>
          )}
        </div>

        {/* 评论列表区域 (无变化) */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 shadow-blue-200/50 overflow-hidden">
          <div className="p-8 border-b-2 border-blue-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Discussions ({stats.total})
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border-2 border-blue-200 shadow-blue-200/30 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:shadow-blue-400/50 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          {loading && (
            <div className="p-16 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-600 text-lg">Loading comments...</p>
            </div>
          )}
          {!loading && (
            <div className="max-h-[1000px] overflow-y-auto">
              <div className="p-8 space-y-8">
                {paginatedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-2 border-blue-200 shadow-blue-200/30 rounded-2xl p-8 hover:shadow-lg hover:shadow-blue-300/50 transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex gap-6">
                      <img
                        src={
                          comment.user?.avatar ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                        }
                        alt={comment.user?.name || "User"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {comment.user?.name || "Anonymous"}
                          </h3>
                          {comment.user?.isAdmin && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                              <Award className="w-4 h-4" />
                              Admin
                            </span>
                          )}
                          <span className="text-base text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {getRelativeTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleLike(comment.id)}
                            disabled={!user.isLoggedIn}
                            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all ${
                              comment.likes > 0
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
                                : "text-gray-500 hover:bg-gray-100 border-2 border-gray-200"
                            } ${
                              !user.isLoggedIn
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                comment.likes > 0 ? "fill-current" : ""
                              }`}
                            />
                            <span className="text-base font-medium">
                              {comment.likes || 0}
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === comment.id ? null : comment.id
                              )
                            }
                            disabled={!user.isLoggedIn}
                            className={`flex items-center gap-3 px-4 py-2 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all border-2 border-gray-200 hover:border-blue-200 ${
                              !user.isLoggedIn
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-base font-medium">
                              {replyingTo === comment.id ? "Cancel" : "Reply"}
                            </span>
                          </button>
                        </div>
                        {replyingTo === comment.id && user.isLoggedIn && (
                          <div className="mt-6 pl-6 border-l-2 border-blue-200">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                {user.name
                                  ? user.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) =>
                                    setReplyContent(e.target.value)
                                  }
                                  placeholder="Write a thoughtful reply..."
                                  className="w-full px-4 py-3 border-2 border-blue-200 shadow-blue-200/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:shadow-blue-400/50 text-base resize-none"
                                  rows="4"
                                  disabled={submitting}
                                />
                                <div className="mt-4 flex gap-3">
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="px-4 py-2 border-2 border-gray-300 rounded-lg text-base text-gray-600 hover:bg-gray-50 transition-colors"
                                    disabled={submitting}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleAddReply(comment.id)}
                                    disabled={
                                      !replyContent.trim() || submitting
                                    }
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-base font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    {submitting ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Posting...
                                      </>
                                    ) : (
                                      "Reply"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {comment.replies?.length > 0 && (
                          <div className="mt-6 pl-6 border-l-2 border-blue-200 space-y-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex gap-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200 shadow-blue-200/30"
                              >
                                <img
                                  src={
                                    reply.user?.avatar ||
                                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
                                  }
                                  alt={reply.user?.name || "User"}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium text-gray-800 text-base">
                                      {reply.user?.name || "Anonymous"}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                      {getRelativeTime(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-base text-gray-700 mb-3">
                                    {reply.content}
                                  </p>
                                  <button
                                    onClick={() =>
                                      handleLike(comment.id, true, reply.id)
                                    }
                                    disabled={!user.isLoggedIn}
                                    className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border-2 transition-all ${
                                      reply.likes > 0
                                        ? "text-red-500 border-red-200 bg-red-50"
                                        : "text-gray-500 border-gray-200 bg-white"
                                    } hover:text-red-600 hover:border-red-300 ${
                                      !user.isLoggedIn
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    <Heart
                                      className={`w-4 h-4 ${
                                        reply.likes > 0 ? "fill-current" : ""
                                      }`}
                                    />
                                    <span>{reply.likes || 0}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {paginatedComments.length === 0 && !loading && (
                  <div className="text-center py-16 text-gray-500">
                    <MessageCircle className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                    <p className="text-xl">No comments yet</p>
                    <p className="text-base">
                      Be the first to start the conversation!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          {totalPages > 1 && !loading && (
            <div className="p-8 border-t-2 border-blue-100 bg-gray-50">
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-lg border-2 border-blue-200 shadow-blue-200/30 text-gray-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-3 rounded-lg transition-all border-2 ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white shadow-md border-blue-500"
                        : "border-blue-200 shadow-blue-200/30 text-gray-600 hover:bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-lg border-2 border-blue-200 shadow-blue-200/30 text-gray-600 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
