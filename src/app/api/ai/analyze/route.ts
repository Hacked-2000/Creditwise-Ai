import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { $Enums } from "@prisma/client";

// POST /api/ai/analyze — generates AI insights based on user's credit data
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [profile, accounts, goals] = await Promise.all([
      prisma.creditProfile.findUnique({ where: { userId: session.user.id } }),
      prisma.financialAccount.findMany({ where: { userId: session.user.id } }),
      prisma.financialGoal.findMany({
        where: { userId: session.user.id, status: "IN_PROGRESS" },
      }),
    ]);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Please set up your credit profile first" },
        { status: 400 }
      );
    }

    // build a structured prompt with the user's financial data
    const prompt = `
You are a financial advisor AI. Analyze this user's credit profile and provide actionable insights.

Credit Score: ${profile.creditScore} (${profile.scoreCategory})
Payment History Score: ${profile.paymentHistory}/100
Credit Utilization Score: ${profile.creditUtilization}/100
Credit Age Score: ${profile.creditAge}/100
Credit Mix Score: ${profile.creditMix}/100
New Inquiries Score: ${profile.newInquiries}/100
Total Debt: ₹${profile.totalDebt}
Total Credit Available: ₹${profile.totalCredit}
Monthly Income: ₹${profile.monthlyIncome}

Active Accounts: ${accounts.length}
Credit Cards: ${accounts.filter((a) => a.accountType === "CREDIT_CARD").length}
Loans: ${accounts.filter((a) => ["PERSONAL_LOAN", "AUTO_LOAN", "MORTGAGE", "STUDENT_LOAN"].includes(a.accountType)).length}

Active Goals: ${goals.length}
${goals.map((g) => `- ${g.title}: Target score ${g.targetScore}`).join("\n")}

Provide exactly 3 insights in this JSON format (no markdown, just raw JSON):
{
  "insights": [
    {
      "type": "SCORE_IMPROVEMENT|DEBT_REDUCTION|CREDIT_UTILIZATION|PAYMENT_REMINDER|GENERAL_ADVICE",
      "title": "short title",
      "content": "2-3 sentence explanation",
      "actionItems": ["action 1", "action 2", "action 3"],
      "impact": "Low|Medium|High"
    }
  ]
}
`;

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    // parse the AI response
    let parsed;
    try {
      // strip any markdown code fences if the model adds them
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { success: false, error: "AI returned an unexpected response format" },
        { status: 500 }
      );
    }

    // save insights to DB
    const savedInsights = await Promise.all(
      parsed.insights.map(
        (insight: {
          type: string;
          title: string;
          content: string;
          actionItems: string[];
          impact: string;
        }) =>
          prisma.aiInsight.create({
            data: {
              userId: session!.user!.id!,
              type: insight.type as $Enums.InsightType,
              title: insight.title,
              content: insight.content,
              actionItems: insight.actionItems,
              impact: insight.impact,
            },
          })
      )
    );

    return NextResponse.json({ success: true, data: savedInsights });
  } catch (err) {
    console.error("[AI_ANALYZE]", err);
    return NextResponse.json(
      { success: false, error: "AI analysis failed. Check your API key." },
      { status: 500 }
    );
  }
}
