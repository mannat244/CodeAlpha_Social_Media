import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '../../lib/sessionOptions';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    if (!session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { content } = await req.json();

    if (!content || content.trim() === '') {
      return new Response(JSON.stringify({ error: 'Content required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Convert session user id string to ObjectId
    const authorObjectId = new ObjectId(session.user._id);

    await db.collection('posts').insertOne({
      authorId: authorObjectId,
      content: content.trim(),
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
