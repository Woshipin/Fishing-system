// CommentPage.jsx
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, X, Award, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext'; // 导入用户上下文

const CommentPage = () => {
  const { user } = useUser(); // 获取当前用户信息
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const commentsPerPage = 10;
  const API_BASE_URL = 'http://localhost:8000/api';

  // 调试信息
  useEffect(() => {
    console.log("CommentPage: Component mounted");
    console.log("CommentPage: User data:", user);
  }, [user]);

  // Mock data for demonstration (remove when connecting to real API)
  const mockComments = [
    {
      id: 1,
      content: "This is a great discussion starter! I love how we can engage with the community.",
      user: {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        isAdmin: true
      },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      replies: [
        {
          id: 101,
          content: "Absolutely agree! The community here is amazing.",
          user: {
            id: 2,
            name: "Mike Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
          },
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          likes: 2
        }
      ]
    },
    {
      id: 2,
      content: "I've been thinking about this topic for a while. What are everyone's thoughts on the future of web development?",
      user: {
        id: 3,
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      replies: []
    }
  ];

  // API functions with better error handling
  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("CommentPage: Fetching comments from API");
      
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 如果需要认证token，添加Authorization header
          ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const processedComments = Array.isArray(data) ? data : (data.comments || []);
      
      console.log("CommentPage: Comments fetched successfully:", processedComments);
      
      setComments(processedComments.map(comment => ({
        ...comment,
        replies: comment.replies || []
      })));
    } catch (error) {
      console.warn('API not available, using mock data:', error);
      // Fallback to mock data for demonstration
      setComments(mockComments);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (commentData) => {
    try {
      console.log("CommentPage: Posting comment:", commentData);
      
      const response = await fetch(`${API_BASE_URL}/add-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 如果需要认证token，添加Authorization header
          ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
        },
        body: JSON.stringify({
          content: commentData.content,
          user_id: user.userId, // 使用当前用户ID
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("CommentPage: Comment posted successfully:", data);
      return data;
    } catch (error) {
      console.warn('API not available for posting:', error);
      // Return mock response for demonstration
      return {
        id: Date.now(),
        content: commentData.content,
        user: {
          id: user.userId,
          name: user.name,
          avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
        },
        created_at: new Date().toISOString(),
        likes: 0,
        replies: []
      };
    }
  };

  const postReply = async (commentId, replyData) => {
    try {
      console.log("CommentPage: Posting reply:", { commentId, replyData });
      
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 如果需要认证token，添加Authorization header
          ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
        },
        body: JSON.stringify({
          content: replyData.content,
          user_id: user.userId, // 使用当前用户ID
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("CommentPage: Reply posted successfully:", data);
      return data;
    } catch (error) {
      console.warn('API not available for reply posting:', error);
      // Return mock response for demonstration
      return {
        id: Date.now(),
        content: replyData.content,
        user: {
          id: user.userId,
          name: user.name,
          avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
        },
        created_at: new Date().toISOString(),
        likes: 0
      };
    }
  };

  const likeComment = async (commentId, isReply = false, replyId = null) => {
    try {
      const endpoint = isReply 
        ? `${API_BASE_URL}/comments/${commentId}/replies/${replyId}/like`
        : `${API_BASE_URL}/comments/${commentId}/like`;
      
      console.log("CommentPage: Liking comment/reply:", { commentId, isReply, replyId });
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // 如果需要认证token，添加Authorization header
          ...(user.token && { 'Authorization': `Bearer ${user.token}` }),
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("CommentPage: Like successful:", data);
      return data;
    } catch (error) {
      console.warn('API not available for liking:', error);
      // Return success for demonstration
      return { success: true };
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Utility functions
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString();
  };

  const getSortedComments = () => {
    return [...comments].sort((a, b) => {
      switch (sortBy) {
        case "oldest": return new Date(a.created_at) - new Date(b.created_at);
        case "popular": return (b.likes || 0) - (a.likes || 0);
        default: return new Date(b.created_at) - new Date(a.created_at);
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
    const replies = comments.reduce((acc, comment) => acc + (comment.replies?.length || 0), 0);
    return { total: comments.length, replies };
  };

  // Event handlers
  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    
    // 检查用户是否已登录
    if (!user.isLoggedIn) {
      setError("请先登录后再发表评论。");
      return;
    }
    
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log("CommentPage: Adding comment with user:", user);
      
      const commentData = {
        content: newComment,
        user: {
          id: user.userId,
          name: user.name,
          avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
        }
      };

      const response = await postComment(commentData);
      
      const newCommentObj = {
        id: response.id || Date.now(),
        user: response.user || commentData.user,
        content: response.content || newComment,
        created_at: response.created_at || new Date().toISOString(),
        likes: response.likes || 0,
        replies: response.replies || []
      };

      console.log("CommentPage: New comment created:", newCommentObj);

      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setCurrentPage(1);
    } catch (error) {
      console.error("CommentPage: Failed to add comment:", error);
      setError(`Failed to post comment: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (commentId) => {
    // 检查用户是否已登录
    if (!user.isLoggedIn) {
      setError("请先登录后再回复评论。");
      return;
    }
    
    if (!replyContent.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log("CommentPage: Adding reply with user:", user);
      
      const replyData = {
        content: replyContent,
        user: {
          id: user.userId,
          name: user.name,
          avatar: user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
        }
      };

      const response = await postReply(commentId, replyData);
      
      const newReply = {
        id: response.id || Date.now(),
        user: response.user || replyData.user,
        content: response.content || replyContent,
        created_at: response.created_at || new Date().toISOString(),
        likes: response.likes || 0
      };

      console.log("CommentPage: New reply created:", newReply);

      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...(comment.replies || []), newReply] }
          : comment
      ));

      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("CommentPage: Failed to add reply:", error);
      setError(`Failed to post reply: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId, isReply = false, replyId = null) => {
    // 检查用户是否已登录
    if (!user.isLoggedIn) {
      setError("请先登录后再点赞。");
      return;
    }
    
    try {
      console.log("CommentPage: Liking with user:", user);
      
      await likeComment(commentId, isReply, replyId);
      
      // Update local state optimistically
      setComments(comments.map(comment => {
        if (isReply && comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === replyId ? { ...reply, likes: (reply.likes || 0) + 1 } : reply
            )
          };
        } else if (!isReply && comment.id === commentId) {
          return { ...comment, likes: (comment.likes || 0) + 1 };
        }
        return comment;
      }));
    } catch (error) {
      console.error("CommentPage: Failed to like:", error);
      setError(`Failed to like comment: ${error.message}`);
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchComments();
  };

  const stats = getCommentStats();
  const totalPages = getTotalPages();
  const paginatedComments = getPaginatedComments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* 用户状态显示区域 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            {user.isLoggedIn ? (
              <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                <div className="flex flex-wrap items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600">登录状态: </span>
                    <span className="font-bold text-green-600">已登录</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">用户ID: </span>
                    <span className="font-bold text-blue-600">{user.userId}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">姓名: </span>
                    <span className="font-bold text-blue-600">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">邮箱: </span>
                    <span className="font-bold text-blue-600">{user.email}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">登录状态: </span>
                  <span className="font-bold text-red-600">未登录</span>
                  <span className="text-gray-500 ml-4">请先登录以参与评论讨论</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-200 shadow-blue-200/50 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 p-8 text-white relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <MessageCircle className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Community Hub</h1>
              </div>
              <p className="text-blue-100 text-lg mb-6 max-w-2xl">
                Connect, share, and engage with our vibrant community. Your voice matters!
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

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 shadow-red-200/50 text-red-600 px-6 py-4 rounded-xl mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Comment Form Section */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 shadow-blue-200/50 p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            Share Your Thoughts
          </h3>

          {user.isLoggedIn ? (
            <form onSubmit={handleAddComment} className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
              <p className="text-xl text-gray-500 mb-2">请先登录以参与讨论</p>
              <p className="text-gray-400">登录后即可发表评论和回复</p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 shadow-blue-200/50 overflow-hidden">
          {/* Comments Header */}
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

          {/* Loading State */}
          {loading && (
            <div className="p-16 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-gray-600 text-lg">Loading comments...</p>
            </div>
          )}

          {/* Comments List */}
          {!loading && (
            <div className="max-h-[1000px] overflow-y-auto">
              <div className="p-8 space-y-8">
                {paginatedComments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="border-2 border-blue-200 shadow-blue-200/30 rounded-2xl p-8 hover:shadow-lg hover:shadow-blue-300/50 transition-all bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex gap-6">
                      <img
                        src={comment.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                        alt={comment.user?.name || 'User'}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {comment.user?.name || 'Anonymous'}
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
                            } ${!user.isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Heart className={`w-5 h-5 ${comment.likes > 0 ? "fill-current" : ""}`} />
                            <span className="text-base font-medium">{comment.likes || 0}</span>
                          </button>
                          
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            disabled={!user.isLoggedIn}
                            className={`flex items-center gap-3 px-4 py-2 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all border-2 border-gray-200 hover:border-blue-200 ${!user.isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-base font-medium">
                              {replyingTo === comment.id ? "Cancel" : "Reply"}
                            </span>
                          </button>
                        </div>

                        {/* Reply Form */}
                        {replyingTo === comment.id && user.isLoggedIn && (
                          <div className="mt-6 pl-6 border-l-2 border-blue-200">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="flex-1">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
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
                                    disabled={!replyContent.trim() || submitting}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-base font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    {submitting ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Posting...
                                      </>
                                    ) : (
                                      'Reply'
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                          <div className="mt-6 pl-6 border-l-2 border-blue-200 space-y-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex gap-4 p-6 bg-blue-50 rounded-lg border-2 border-blue-200 shadow-blue-200/30"
                              >
                                <img
                                  src={reply.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                                  alt={reply.user?.name || 'User'}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-medium text-gray-800 text-base">
                                      {reply.user?.name || 'Anonymous'}
                                    </h4>
                                    <span className="text-sm text-gray-500">
                                      {getRelativeTime(reply.created_at)}
                                    </span>
                                  </div>
                                  <p className="text-base text-gray-700 mb-3">
                                    {reply.content}
                                  </p>
                                  <button
                                    onClick={() => handleLike(comment.id, true, reply.id)}
                                    disabled={!user.isLoggedIn}
                                    className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full border-2 transition-all ${
                                      reply.likes > 0 ? "text-red-500 border-red-200 bg-red-50" : "text-gray-500 border-gray-200 bg-white"
                                    } hover:text-red-600 hover:border-red-300 ${!user.isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    <Heart className={`w-4 h-4 ${reply.likes > 0 ? "fill-current" : ""}`} />
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
                    <p className="text-base">Be the first to start the conversation!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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