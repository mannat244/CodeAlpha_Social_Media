import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../lib/sessionOptions';
import clientPromise from '../../lib/mongodb';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);
    const user = session.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { postId, content, replyTo } = await req.json();

    if (!postId || !content) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const userId = new ObjectId(user._id);

    if (replyTo) {
      // It's a reply to a comment
      await db.collection('posts').updateOne(
        { _id: new ObjectId(postId), 'comments._id': new ObjectId(replyTo) },
        {
          $push: {
            'comments.$.replies': {
              _id: new ObjectId(),
              userId,
              content,
              createdAt: new Date(),
            },
          },
        }
      );
    } else {
      // It's a top-level comment
      await db.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: {
            comments: {
              _id: new ObjectId(),
              userId,
              content,
              createdAt: new Date(),
              replies: [],
            },
          },
        }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Comment API error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
