import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '../../lib/sessionOptions';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    if (!session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const loggedInUserId = session.user._id;

    const client = await clientPromise;
    const db = client.db();

    // Fetch posts sorted by newest first
    const posts = await db.collection('posts').find({}).sort({ createdAt: -1 }).toArray();

    // Collect all userIds from posts, comments, replies for batch fetch
    const allUserIds = new Set();

    for (const post of posts) {
      allUserIds.add(post.authorId?.toString());

      (post.comments || []).forEach((comment) => {
        allUserIds.add(comment.userId?.toString());
        (comment.replies || []).forEach((reply) => {
          allUserIds.add(reply.userId?.toString());
        });
      });
    }

    // Fetch all involved users, exclude sensitive fields
    const users = await db.collection('users')
      .find({ _id: { $in: [...allUserIds].map(id => new ObjectId(id)) } })
      .project({ password: 0, email: 0 })
      .toArray();

    // Create map for quick lookup
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Map posts to include author, comments with users, and likes info
    const postsWithUsers = posts.map(post => {
      const likes = post.likes || [];
      const likesCount = likes.length;
      const likedByUser = likes.some(id => id.toString() === loggedInUserId);

      return {
        ...post,
        author: userMap[post.authorId?.toString()] || null,
        likesCount,
        likedByUser,
        comments: (post.comments || []).map(comment => ({
          ...comment,
          user: userMap[comment.userId?.toString()] || null,
          replies: (comment.replies || []).map(reply => ({
            ...reply,
            user: userMap[reply.userId?.toString()] || null,
          })),
        })),
      };
    });

    return new Response(JSON.stringify(postsWithUsers), { status: 200 });
  } catch (error) {
    console.error('Get posts error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
