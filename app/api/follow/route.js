// /api/follow/route.js or route.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions } from "../../lib/sessionOptions";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const cookieStore = cookies();
    const session = await getIronSession(cookieStore, sessionOptions);

    if (!session.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { userIdToFollow } = await req.json();
    if (!userIdToFollow) {
      return new Response(JSON.stringify({ error: "Missing userIdToFollow" }), { status: 400 });
    }

    const loggedInUserId = new ObjectId(session.user._id);
    const targetUserId = new ObjectId(userIdToFollow);

    const client = await clientPromise;
    const db = client.db();

    const users = db.collection("users");

    const loggedInUser = await users.findOne({ _id: loggedInUserId });

    const isAlreadyFollowing = loggedInUser.following?.some(
      (id) => id.toString() === targetUserId.toString()
    );

    if (isAlreadyFollowing) {
      // Unfollow
      await users.updateOne(
        { _id: loggedInUserId },
        { $pull: { following: targetUserId } }
      );
      await users.updateOne(
        { _id: targetUserId },
        { $pull: { followers: loggedInUserId } }
      );
      return new Response(JSON.stringify({ following: false }), { status: 200 });
    } else {
      // Follow
      await users.updateOne(
        { _id: loggedInUserId },
        { $addToSet: { following: targetUserId } }
      );
      await users.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: loggedInUserId } }
      );
      return new Response(JSON.stringify({ following: true }), { status: 200 });
    }
  } catch (err) {
    console.error("Follow error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
