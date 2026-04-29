import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserFromHeaders } from "@/lib/resolve-user";

export async function GET(req: NextRequest) {
  try {
    const user = await resolveUserFromHeaders(req.headers);
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
