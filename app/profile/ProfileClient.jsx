// app/profile/ProfileClient.jsx
"use client";

import { useState } from "react";
import {
  Heart,
  Mail,
  Users,
  UserRoundPlus,
  NotebookPen,
  Mailbox,
  HandHeart,
} from "lucide-react";

export default function ProfileClient({ profileData }) {
  const {
    user,
    enrichedPosts: initialPosts,
    postCount,
    followersCount: initialFollowersCount,
    followingCount,
    isFollowing: initialIsFollowing,
    loggedInUserId,
  } = profileData;

  // 1️⃣ Keep client‐state so we can update likes/follows live
  const [enrichedPosts, setEnrichedPosts] = useState(initialPosts);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2️⃣ Handle follow/unfollow
  const toggleFollow = async () => {
    setFollowLoading(true);
    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdToFollow: user._id }),
      });
      if (!res.ok) throw new Error("Failed to update follow");
      await res.json();

      // Re‐fetch profile data from server
      const updated = await fetch(`/api/profile?userId=${user._id}`);
      if (!updated.ok) throw new Error("Failed to refetch profile");
      const data = await updated.json();

      setEnrichedPosts(data.enrichedPosts);
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setFollowLoading(false);
    }
  };

  // 3️⃣ Handle like/unlike for a post
  const handleLike = async (postId) => {
    try {
      await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      // Re‐fetch just the “enrichedPosts” from profile endpoint
      const updated = await fetch(`/api/profile?userId=${user._id}`);
      const data = await updated.json();
      setEnrichedPosts(data.enrichedPosts);
    } catch {
      setError("Failed to update like.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      {error && (
        <div className="text-center mb-4 text-red-500">{error}</div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-800/50"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar & Follow Button */}
            <div className="flex items-start justify-between -mt-12 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-2xl text-4xl font-bold shadow-2xl border-4 border-slate-800">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800"></div>
              </div>

              {/* Show follow only if viewing someone else’s profile */}
              {loggedInUserId !== user._id && (
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:scale-105 flex items-center gap-2 ${
                    isFollowing
                      ? "bg-slate-600/80 text-white hover:bg-slate-500 border border-slate-500"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {followLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Please wait...
                    </>
                  ) : isFollowing ? (
                    <>
                      <span className="text-sm">
                        <Users />
                      </span>
                      Following
                    </>
                  ) : (
                    <>
                      <span className="text-sm">
                        <UserRoundPlus />
                      </span>
                      Follow
                    </>
                  )}
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                {user.name}
              </h1>
              {user.email && (
                <p className="text-slate-400 text-lg mb-4 flex items-center gap-2">
                  <span className="text-sm">
                    <Mail />
                  </span>
                  {user.email}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200">
                <div className="text-2xl font-bold text-white mb-1">{postCount}</div>
                <div className="text-slate-400 text-sm font-medium">Posts</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200">
                <div className="text-2xl font-bold text-white mb-1">{followersCount}</div>
                <div className="text-slate-400 text-sm font-medium">Followers</div>
              </div>
              <div className="text-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200">
                <div className="text-2xl font-bold text-white mb-1">{followingCount}</div>
                <div className="text-slate-400 text-sm font-medium">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-2xl border border-slate-600/50 shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                <NotebookPen />
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {loggedInUserId === user._id
                ? "Your Posts"
                : `${user.name}'s Posts`}
            </h2>
          </div>

          <div className="space-y-6">
            {enrichedPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">
                    <Mailbox />
                  </span>
                </div>
                <p className="text-slate-400 text-lg mb-2">
                  {loggedInUserId === user._id
                    ? "You haven't posted yet."
                    : "No posts yet."}
                </p>
                {loggedInUserId === user._id && (
                  <p className="text-slate-500 text-sm">
                    Share your first thought with the world!
                  </p>
                )}
              </div>
            ) : (
              enrichedPosts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 backdrop-blur-sm p-6 rounded-xl border border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-500/50"
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold text-sm">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-400">
                        {user.name}
                      </div>
                      <time className="text-slate-500 text-sm">
                        {new Date(post.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-6">
                    <p className="text-white leading-relaxed text-lg">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between border-t border-slate-600/30 pt-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-slate-600/30 ${
                        post.likedByUser
                          ? "text-red-400 bg-red-500/10"
                          : "text-slate-400 hover:text-red-400"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-200 ${
                          post.likedByUser
                            ? "fill-red-400 text-red-400 scale-110"
                            : "hover:scale-110"
                        }`}
                      />
                      <span className="font-medium">
                        {post.likesCount || 0}
                      </span>
                    </button>

                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-sm">
                        <HandHeart />
                      </span>
                      <span className="text-sm">
                        {post.likesCount === 1
                          ? "1 like"
                          : `${post.likesCount || 0} likes`}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
