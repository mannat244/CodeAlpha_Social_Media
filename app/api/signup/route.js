import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '../../lib/sessionOptions';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await users.insertOne({ name, email, password: hashedPassword });
    const userId = result.insertedId;

    // ✅ Include _id in session!
    session.user = { _id: userId.toString(), name, email };
    await session.save();

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
