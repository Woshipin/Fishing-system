import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Send, X, ThumbsUp, Award, Clock, MoreHorizontal } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";

const CommentPage = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "https://via.placeholder.com/40",
      },
      content:
        "This product exceeded my expectations! The quality is excellent and it arrived quickly.",
      date: "2023-05-15T14:30:00",
      likes: 12,
      replies: [
        {
          id: 101,
          user: {
            name: "Admin",
            avatar: "https://via.placeholder.com/40",
            isAdmin: true,
          },
          content:
            "Thank you for your feedback! We're glad you enjoyed the product.",
          date: "2023-05-15T15:45:00",
          likes: 3,
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Jane Smith",
        avatar: "https://via.placeholder.com/40",
      },
      content:
        "I had a question about the sizing. Is it true to size or should I order a size up?",
      date: "2023-05-14T10:15:00",
      likes: 5,
      replies: [
        {
          id: 102,
          user: {
            name: "Admin",
            avatar: "https://via.placeholder.com/40",
            isAdmin: true,
          },
          content:
            "Hi Jane, our products typically run true to size, but you can check our size guide for specific measurements. Let us know if you need any further assistance!",
          date: "2023-05-14T11:30:00",
          likes: 2,
        },
      ],
    },
    {
      id: 3,
      user: {
        name: "Mike Johnson",
        avatar: "https://via.placeholder.com/40",
      },
      content:
        "The delivery was fast, but the packaging was damaged. Fortunately, the product inside was intact.",
      date: "2023-05-13T09:20:00",
      likes: 8,
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [commentStats, setCommentStats] = useState({
    total: 0,
    replies: 0,
  });
  const [sortBy, setSortBy] = useState("newest");

  // Calculate comment statistics
  useEffect(() => {
    let total = comments.length;
    let replies = 0;
    comments.forEach(comment => {
      replies += comment.replies.length;
    });
    setCommentStats({ total, replies });
  }, [comments]);

  // Sort comments based on selected option
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "oldest") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "popular") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      user: {
        name: "You",
        avatar: "https://via.placeholder.com/40",
      },
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (commentId) => {
    if (!replyContent.trim()) return;

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: Date.now(),
              user: {
                name: "You",
                avatar: "https://via.placeholder.com/40",
              },
              content: replyContent,
              date: new Date().toISOString(),
              likes: 0,
            },
          ],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleLike = (commentId, isReply = false, replyId = null) => {
    const updatedComments = comments.map((comment) => {
      if (isReply) {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === replyId) {
                return { ...reply, likes: reply.likes + 1 };
              }
              return reply;
            }),
          };
        }
      } else if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <AnimatedSection className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-blue-200" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
            
            {/* Header */}
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-100 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white opacity-10 rounded-full -mr-16 sm:-mr-24 lg:-mr-32 -mt-16 sm:-mt-24 lg:-mt-32"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-black opacity-5 rounded-full -ml-10 sm:-ml-16 lg:-ml-20 -mb-10 sm:-mb-16 lg:-mb-20"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle size={20} className="text-white opacity-80 sm:w-6 sm:h-6" />
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Community Discussions</h1>
                </div>
                <p className="text-white text-opacity-90 text-sm sm:text-base max-w-lg">
                  Join the conversation and share your thoughts with our community. We value your feedback and questions!
                </p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={14} className="text-white opacity-80 sm:w-4 sm:h-4" />
                    <span className="text-white text-opacity-90 text-sm">{commentStats.total} Comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={14} className="text-white opacity-80 sm:w-4 sm:h-4" />
                    <span className="text-white text-opacity-90 text-sm">{commentStats.replies} Replies</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Sort Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 pb-4 border-b border-gray-100 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg font-semibold text-black">All Comments</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-500">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs sm:text-sm bg-gray-100 border border-blue-200 rounded-lg px-2 sm:px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-blue-100/40"
                    style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Liked</option>
                  </select>
                </div>
              </div>

              {/* Add Comment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 sm:mb-10 bg-gray-100 p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm shadow-blue-100/40"
                style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
              >
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Leave a Comment</h3>
                <form onSubmit={handleAddComment}>
                  <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-black font-bold text-sm sm:text-lg flex-shrink-0">
                      Y
                    </div>
                    <div className="flex-grow w-full sm:w-auto">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white rounded-xl border border-blue-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-blue-100/40 text-sm sm:text-base"
                        style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                        rows="3"
                      ></textarea>
                      <div className="mt-3 flex justify-end">
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-4 sm:px-5 py-2 bg-white text-black rounded-lg font-medium border border-blue-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-blue-100/40 text-sm sm:text-base"
                          style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                        >
                          <Send size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Post Comment</span>
                          <span className="sm:hidden">Post</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Comments List */}
              <div className="space-y-6 sm:space-y-8">
                <AnimatePresence>
                  {sortedComments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-100 pb-6 sm:pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 bg-gray-100 p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm shadow-blue-100/40" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
                        <div className="flex-shrink-0 self-start">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200">
                            <img
                              src="/assets/About/about-us.png"
                              alt={`${comment.user.name}'s Avatar`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 shadow-sm shadow-blue-100/40" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 space-y-1 sm:space-y-0">
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  {comment.user.name}
                                </h3>
                                {comment.user.isAdmin && (
                                  <span className="ml-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center">
                                    <Award size={10} className="mr-0.5 sm:mr-1 sm:w-3 sm:h-3" />
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-xs sm:text-sm text-gray-500">
                                <Clock size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
                                <span>{getRelativeTime(comment.date)}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base break-words">{comment.content}</p>
                            
                            <div className="flex items-center space-x-4 sm:space-x-6">
                              <button
                                onClick={() => handleLike(comment.id)}
                                className={`flex items-center text-xs sm:text-sm group ${
                                  comment.likes > 0 ? "text-red-500" : "text-gray-500"
                                } hover:text-red-600 transition-colors`}
                              >
                                <Heart size={14} className={`mr-1 sm:mr-1.5 group-hover:scale-110 transition-transform sm:w-4 sm:h-4 ${
                                  comment.likes > 0 ? "fill-red-500" : ""
                                }`} />
                                <span>{comment.likes || ""}</span>
                              </button>
                              
                              <button
                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-primary transition-colors"
                              >
                                <MessageCircle size={14} className="mr-1 sm:mr-1.5 sm:w-4 sm:h-4" />
                                <span>{replyingTo === comment.id ? "Cancel" : "Reply"}</span>
                              </button>
                              
                              <button className="flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                <MoreHorizontal size={14} className="sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Reply Form */}
                          <AnimatePresence>
                            {replyingTo === comment.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-2 sm:pl-4 border-l-2 border-gray-100"
                              >
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                                    Y
                                  </div>
                                  <div className="flex-grow">
                                    <textarea
                                      value={replyContent}
                                      onChange={(e) => setReplyContent(e.target.value)}
                                      placeholder="Write a thoughtful reply..."
                                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-blue-100/40"
                                      style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                                      rows="2"
                                    ></textarea>
                                    <div className="mt-2 flex justify-end space-x-2">
                                      <button
                                        onClick={() => setReplyingTo(null)}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-blue-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center shadow-blue-100/40"
                                      >
                                        <X size={12} className="mr-0.5 sm:mr-1 sm:w-3.5 sm:h-3.5" />
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleAddReply(comment.id)}
                                        disabled={!replyContent.trim()}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary text-white rounded-lg font-medium border border-blue-200 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-blue-100/40"
                                        style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' }}
                                      >
                                        <Send size={12} className="mr-0.5 sm:mr-1 sm:w-3.5 sm:h-3.5" />
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="mt-3 sm:mt-4 pl-3 sm:pl-6 space-y-3 sm:space-y-4">
                              {comment.replies.map((reply, replyIndex) => (
                                <motion.div
                                  key={reply.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: replyIndex * 0.1 }}
                                  className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3"
                                >
                                  <div className="flex-shrink-0 self-start">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gray-200">
                                      <img
                                        src="/assets/About/about-us.png"
                                        alt={`${reply.user.name}'s Avatar`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 shadow-sm" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}>
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 space-y-1 sm:space-y-0">
                                        <div className="flex items-center">
                                          <h4 className="font-medium text-gray-800 text-xs sm:text-sm">
                                            {reply.user.name}
                                          </h4>
                                          {reply.user.isAdmin && (
                                            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center">
                                              <Award size={8} className="mr-0.5 sm:w-2.5 sm:h-2.5" />
                                              Admin
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                          {getRelativeTime(reply.date)}
                                        </span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-700 mb-2 break-words">
                                        {reply.content}
                                      </p>
                                      <button
                                        onClick={() => handleLike(comment.id, true, reply.id)}
                                        className={`flex items-center text-xs ${
                                          reply.likes > 0 ? "text-red-500" : "text-gray-500"
                                        } hover:text-red-600 transition-colors`}
                                      >
                                        <ThumbsUp size={10} className="mr-0.5 sm:mr-1 sm:w-3 sm:h-3" />
                                        <span>{reply.likes || ""}</span>
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CommentPage;