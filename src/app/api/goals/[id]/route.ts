import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { financialGoalSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();

    // allow partial updates (status change, etc.)
    const existing = await prisma.financialGoal.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
    }

    // if it's just a status update, skip full validation
    if (body.status && Object.keys(body).length === 1) {
      const updated = await prisma.financialGoal.update({
        where: { id },
        data: { status: body.status },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    const parsed = financialGoalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.financialGoal.update({
      where: { id },
      data: {
        ...parsed.data,
        targetDate: new Date(parsed.data.targetDate),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[GOAL_PUT]", err);
    return NextResponse.json({ success: false, error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.financialGoal.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ success: false, error: "Goal not found" }, { status: 404 });
  }

  await prisma.financialGoal.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Goal deleted" });
}
