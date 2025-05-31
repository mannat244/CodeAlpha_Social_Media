// app/api/logout/route.js

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '../../lib/sessionOptions';

export async function POST() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);

  session.destroy(); // Clear session

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
