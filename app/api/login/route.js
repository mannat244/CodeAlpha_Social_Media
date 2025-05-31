import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '../../lib/sessionOptions'; // your session config
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    const session = await getIronSession(cookieStore, sessionOptions);

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Save user info in session (IMPORTANT: _id as string)
    session.user = { 
      _id: user._id.toString(), 
      name: user.name, 
      email: user.email 
    };

    await session.save();  // save session

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
