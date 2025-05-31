// /app/api/like/route.js
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import clientPromise from '../../lib/mongodb';
import { sessionOptions } from '../../lib/sessionOptions';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    if (!session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { postId } = await req.json();
    const userId = new ObjectId(session.user._id);
    const client = await clientPromise;
    const db = client.db();

    const post = await db.collection('posts').findOne({ _id: new ObjectId(postId) });
    if (!post) return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });

    const alreadyLiked = post.likes?.some(id => id.toString() === userId.toString());

    const update = alreadyLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    await db.collection('posts').updateOne({ _id: post._id }, update);

    return new Response(JSON.stringify({ liked: !alreadyLiked }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
