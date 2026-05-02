import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { financialGoalSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.financialGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: goals });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = financialGoalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // grab current score from credit profile
    const profile = await prisma.creditProfile.findUnique({
      where: { userId: session.user.id },
      select: { creditScore: true },
    });

    const goal = await prisma.financialGoal.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
        currentScore: profile?.creditScore ?? 0,
        targetDate: new Date(parsed.data.targetDate),
      },
    });

    return NextResponse.json({ success: true, data: goal }, { status: 201 });
  } catch (err) {
    console.error("[GOALS_POST]", err);
    return NextResponse.json({ success: false, error: "Failed to create goal" }, { status: 500 });
  }
}
