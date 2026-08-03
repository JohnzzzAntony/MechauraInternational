import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData, defaultSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.json(defaultSession);
  }

  return NextResponse.json(session);
}
