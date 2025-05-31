import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '../../lib/sessionOptions';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    if (!session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Get userId from query params or fallback to logged-in user
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId') || session.user._id;

    const profileUserId = new ObjectId(userIdParam);

    // Fetch user profile
    const user = await db.collection('users').findOne(
      { _id: profileUserId },
      { projection: { password: 0} }
    );

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Fetch posts by this user
    const posts = await db.collection('posts')
      .find({ authorId: profileUserId })
      .sort({ createdAt: -1 })
      .toArray();

    const enrichedPosts = posts.map(post => ({
  ...post,
  likesCount: post.likes?.length || 0,
  likedByUser: post.likes?.some(id => id.toString() === session.user._id) || false,
}));
    // Counts
    const postCount = posts.length;
    const followersCount = user.followers ? user.followers.length : 0;
    const followingCount = user.following ? user.following.length : 0;

    // Check if logged-in user follows this profile
    const loggedInUserId = new ObjectId(session.user._id);
    const loggedInUser = await db.collection('users').findOne({ _id: loggedInUserId });

    const isFollowing = loggedInUser?.following?.some(id => id.toString() === profileUserId.toString()) || false;

    // Return full profile data
    return new Response(
      JSON.stringify({
        user,
        enrichedPosts,
        postCount,
        followersCount,
        followingCount,
        loggedInUserId: session.user._id ,
        isFollowing,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
