import { NextRequest, NextResponse } from "next/server";
import { isEmailAllowed } from "@/lib/allowed-email";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ allowed: false }, { status: 400 });
  }

  const allowed = await isEmailAllowed(email);
  return NextResponse.json({ allowed });
}
