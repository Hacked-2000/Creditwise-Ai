import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/ai/insights — fetch saved AI insights for the user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const insights = await prisma.aiInsight.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ success: true, data: insights });
}

// PATCH /api/ai/insights — mark all insights as read
export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await prisma.aiInsight.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true, message: "All insights marked as read" });
}
