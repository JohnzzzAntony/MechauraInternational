import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "Mechaura123";

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ isLoggedIn: true });
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    session.isLoggedIn = true;
    session.loggedInAt = new Date().toISOString();
    await session.save();

    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Login failed" }, { status: 500 });
  }
}
