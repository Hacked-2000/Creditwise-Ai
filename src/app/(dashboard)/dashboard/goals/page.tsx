import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import GoalsList from "@/components/goals/GoalsList";

export default async function GoalsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const goals = await prisma.financialGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
        <p className="text-gray-400 text-sm mt-1">
          Set credit score targets and track your progress
        </p>
      </div>

      <GoalsList initialGoals={goals} />
    </div>
  );
}
