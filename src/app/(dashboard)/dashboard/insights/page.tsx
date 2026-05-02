import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InsightsClient from "@/components/insights/InsightsClient";

export default async function InsightsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [insights, profile] = await Promise.all([
    prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.creditProfile.findUnique({
      where: { userId },
      select: { id: true },
    }),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Insights</h1>
        <p className="text-gray-400 text-sm mt-1">
          Personalized credit improvement recommendations powered by Gemini AI
        </p>
      </div>

      <InsightsClient initialInsights={insights} hasProfile={!!profile} />
    </div>
  );
}
