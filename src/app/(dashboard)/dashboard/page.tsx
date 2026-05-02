import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CreditScoreCard from "@/components/dashboard/CreditScoreCard";
import StatsRow from "@/components/dashboard/StatsRow";
import RecentInsights from "@/components/dashboard/RecentInsights";
import QuickActions from "@/components/dashboard/QuickActions";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [creditProfile, accounts, goals, insights] = await Promise.all([
    prisma.creditProfile.findUnique({ where: { userId } }),
    prisma.financialAccount.findMany({ where: { userId, isActive: true } }),
    prisma.financialGoal.findMany({ where: { userId } }),
    prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const activeGoals = goals.filter((g) => g.status === "IN_PROGRESS").length;
  const unreadInsights = insights.filter((i) => !i.isRead).length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hey, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here&apos;s your financial health overview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CreditScoreCard profile={creditProfile} />
        </div>
        <div>
          <QuickActions hasProfile={!!creditProfile} />
        </div>
      </div>

      <StatsRow
        totalAccounts={accounts.length}
        activeGoals={activeGoals}
        unreadInsights={unreadInsights}
        totalDebt={creditProfile?.totalDebt ?? 0}
      />

      <RecentInsights insights={insights} />
    </div>
  );
}
