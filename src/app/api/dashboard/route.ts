import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard — aggregated data for the dashboard page
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const [creditProfile, accounts, goals, recentInsights] = await Promise.all([
    prisma.creditProfile.findUnique({ where: { userId: session.user.id } }),
    prisma.financialAccount.findMany({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.financialGoal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.aiInsight.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const activeGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;
  const unreadInsights = recentInsights.filter((i) => !i.isRead).length;

  return NextResponse.json({
    success: true,
    data: {
      creditProfile,
      accounts,
      goals,
      recentInsights,
      totalAccounts: accounts.length,
      activeGoals,
      unreadInsights,
    },
  });
}
