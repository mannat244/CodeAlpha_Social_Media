// app/profile/page.jsx
import Link from "next/link";
import ProfileClient from "./ProfileClient";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "../lib/sessionOptions";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function ProfilePage({ searchParams }) {
  const sp = await searchParams;
  // 1️⃣ Read the ?userId= from the URL (passed as a plain object to this server component):
  const requestedUserId = sp?.userId || null;

  // 2️⃣ Get the Iron Session (server‐side)
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  if (!session.user) {
    return (
      <div className="text-center mt-20 text-red-600">
        Unauthorized — please <Link href="/">log in</Link>.
      </div>
    );
  }

  // 3️⃣ Determine which profile to load
  const profileUserId = new ObjectId(requestedUserId || session.user._id);

  // 4️⃣ Fetch “profile user” from MongoDB (exclude password)
  const client = await clientPromise;
  const db = client.db();
  const userDoc = await db
    .collection("users")
    .findOne(
      { _id: profileUserId },
      { projection: { password: 0 } }
    );

  if (!userDoc) {
    return (
      <div className="text-center mt-20 text-red-600">
        User not found.
      </div>
    );
  }

  // 5️⃣ Fetch posts by that user, newest first
  const posts = await db
    .collection("posts")
    .find({ authorId: profileUserId })
    .sort({ createdAt: -1 })
    .toArray();

  // 6️⃣ Enrich each post with likesCount & likedByUser
  const enrichedPosts = posts.map((post) => {
    const likesArray = Array.isArray(post.likes) ? post.likes : [];
    const likesCount = likesArray.length;
    const likedByUser = likesArray.some(
      (id) => id.toString() === session.user._id
    );

    // Convert ObjectId fields to strings for client
    return {
      _id: post._id.toString(),
      authorId: post.authorId.toString(),
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      likesCount,
      likedByUser,
      // If you have comments, convert their IDs and dates as well:
      comments: (post.comments || []).map((c) => ({
        _id: c._id.toString(),
        userId: c.userId.toString(),
        content: c.content,
        createdAt: c.createdAt.toISOString(),
        replies: (c.replies || []).map((r) => ({
          _id: r._id.toString(),
          userId: r.userId.toString(),
          content: r.content,
          createdAt: r.createdAt.toISOString(),
        })),
      })),
    };
  });

  // 7️⃣ Compute counts & follow‐status
  const postCount = enrichedPosts.length;
  const followersCount = Array.isArray(userDoc.followers)
    ? userDoc.followers.length
    : 0;
  const followingCount = Array.isArray(userDoc.following)
    ? userDoc.following.length
    : 0;

  const loggedInUser = await db
    .collection("users")
    .findOne(
      { _id: new ObjectId(session.user._id) },
      { projection: { following: 1 } }
    );

  const isFollowing = Array.isArray(loggedInUser?.following)
    ? loggedInUser.following.some(
        (id) => id.toString() === profileUserId.toString()
      )
    : false;

  // 8️⃣ Convert userDoc to plain object and IDs to strings
  const user = {
    _id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    followers: (userDoc.followers || []).map((id) => id.toString()),
    following: (userDoc.following || []).map((id) => id.toString()),
  };

  // 9️⃣ Package everything into a plain object to pass to the client
  const profileData = {
    user,
    enrichedPosts,
    postCount,
    followersCount,
    followingCount,
    isFollowing,
    loggedInUserId: session.user._id,
  };

  // 10️⃣ Render the Client Component, passing profileData
  return <ProfileClient profileData={profileData} />;
}
