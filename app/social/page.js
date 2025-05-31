"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heart, LogOut, MessageCircle,SendHorizonal ,UserRound } from "lucide-react";

export default function SocialPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState({}); // track comments open/close per post
  const [commentInputs, setCommentInputs] = useState({}); // track comment input per post

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          toast.error(data.error || "Could not load posts");
        }
      } catch (err) {
        toast.error("Network error");
      }
    };
    loadPosts();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error("Please enter a post");
      return;
    }

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        toast.success("Posted!");
        setContent("");
        const updated = await (await fetch("/api/posts")).json();
        setPosts(updated);
      } else {
        const data = await res.json();
        toast.error(data.error || "Post failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("Server error during logout");
    }
  };

  const handleLike = async (postId) => {
    try {
      await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  const toggleComments = (postId) => {
    setCommentsVisible((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const submitComment = async (postId) => {
    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) return;

    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: commentContent }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to add comment");
        return;
      }

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

      const updated = await (await fetch("/api/posts")).json();
      setPosts(updated);
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
  <ToastContainer />

  {/* Header with improved spacing and icons */}
  <div className="flex justify-between items-center mb-8 bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">S</span>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
        Synq Feed
      </h1>
    </div>
    <div className="flex gap-3">
      <button
        onClick={() => router.push("/profile")}
        className="bg-slate-700/80 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl transition-all duration-200 border border-slate-600/50 backdrop-blur-sm flex items-center gap-2 hover:scale-105"
      >
        <div className="w-fit h-fit p-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs"><UserRound /></span>
        </div>
        Profile
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-600/90 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 shadow-lg"
      >
        <span className="text-sm"><LogOut /></span>
        Logout
      </button>
    </div>
  </div>

  {/* Post creation area with enhanced design */}
  <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 mb-8 shadow-xl">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
        <span className="text-white font-semibold">You</span>
      </div>
      <div className="flex-1">
        <textarea
          className="w-full p-4 bg-slate-700/80 border border-slate-600/50 rounded-xl resize-none text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share something interesting..."
        />
        <div className="flex justify-between items-center mt-4">
          <div className="text-slate-500 text-sm">
            {content.length > 0 && `${content.length} characters`}
          </div>
          <button
            onClick={handlePost}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2.5 rounded-xl transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!content.trim()}
          >
            <span className="text-sm">✨</span>
            Post
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Posts feed with improved styling */}
  <div className="space-y-6">
    {posts.length === 0 ? (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-slate-400 text-lg">No posts yet.</p>
        <p className="text-slate-500 text-sm mt-2">Be the first to share something!</p>
      </div>
    ) : (
      posts.map((post) => (
        <div key={post._id} className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-500/50">
          {/* Post header with profile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              {post.author ? (
                <span className="text-white font-semibold text-sm">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="text-slate-400 text-sm">?</span>
              )}
            </div>
            <div className="flex-1">
              {post.author ? (
                <button
                  onClick={() => router.push(`/profile?userId=${post.author._id}`)}
                  className="font-semibold text-blue-400 hover:text-blue-300 transition-colors focus:outline-none text-left"
                >
                  {post.author.name}
                </button>
              ) : (
                <span className="text-slate-500 italic">[Deleted User]</span>
              )}
              <p className="text-slate-500 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Post content */}
          <div className="mb-6">
            <p className="text-white leading-relaxed text-lg">{post.content}</p>
          </div>

          {/* Post actions with improved icons */}
          <div className="flex items-center justify-between border-t border-slate-600/30 pt-4">
            <button
              onClick={() => handleLike(post._id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-slate-600/30 ${
                post.likedByUser 
                  ? "text-red-400 bg-red-500/10" 
                  : "text-slate-400 hover:text-red-400"
              }`}
              aria-label="Like post"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  post.likedByUser 
                    ? "fill-red-400 text-red-400 scale-110" 
                    : "hover:scale-110"
                }`}
              />
              <span className="font-medium">{post.likesCount || 0}</span>
            </button>

            <button
              onClick={() => toggleComments(post._id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-slate-600/30 ${
                commentsVisible[post._id] 
                  ? "text-blue-400 bg-blue-500/10" 
                  : "text-slate-400 hover:text-blue-400"
              }`}
              aria-label="Toggle comments"
            >
              <MessageCircle className="w-5 h-5 transition-all duration-200 hover:scale-110" />
              <span className="font-medium">{post.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments section with enhanced styling */}
          {commentsVisible[post._id] && (
            <>
              {/* Comments list */}
              <div className="mt-6 space-y-4 max-h-80 overflow-y-auto border-t border-slate-600/30 pt-6">
                {post.comments?.map((comment) => (
                  <div key={comment._id} className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-300 leading-relaxed">
                          <a
                            href={`/profile?userId=${comment.user?._id}`}
                            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors mr-2"
                          >
                            {comment.user?.name || "User"}
                          </a>
                          {comment.content}
                        </p>
                        
                        {/* Replies with improved nesting */}
                        {comment.replies?.length > 0 && (
                          <div className="ml-6 mt-3 space-y-2 border-l-2 border-slate-600/30 pl-4">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="flex items-start gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-xs font-semibold">
                                    {reply.user?.name?.charAt(0).toUpperCase() || "U"}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                  <a
                                    href={`/profile?userId=${reply.user?._id}`}
                                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors mr-2"
                                  >
                                    {reply.user?.name || "User"}
                                  </a>
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input with improved design */}
              <div className="flex gap-3 mt-6 p-4 bg-slate-700/20 rounded-xl border border-slate-600/20">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">You</span>
                </div>
                <input
                  type="text"
                  placeholder="Add a thoughtful comment..."
                  className="bg-slate-700/80 border border-slate-600/50 rounded-xl p-3 flex-1 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 backdrop-blur-sm"
                  value={commentInputs[post._id] || ""}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && (commentInputs[post._id] || "").trim()) {
                      e.preventDefault();
                      await submitComment(post._id);
                    }
                  }}
                />
                <button
                  onClick={() => submitComment(post._id)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-2 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!(commentInputs[post._id] || "").trim()}
                  aria-label="Send comment"
                >
                  <span className="text-sm"><SendHorizonal/></span>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      ))
    )}
  </div>
</div>
  );
}
