import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { financialAccountSchema } from "@/lib/validations";

// PUT /api/accounts/:id — update an account
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
    const parsed = financialAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    // make sure the account belongs to this user
    const existing = await prisma.financialAccount.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
    }

    const updated = await prisma.financialAccount.update({
      where: { id },
      data: {
        ...parsed.data,
        openedDate: new Date(parsed.data.openedDate),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("[ACCOUNT_PUT]", err);
    return NextResponse.json({ success: false, error: "Failed to update account" }, { status: 500 });
  }
}

// DELETE /api/accounts/:id — remove an account
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.financialAccount.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });
  }

  await prisma.financialAccount.delete({ where: { id } });

  return NextResponse.json({ success: true, message: "Account removed" });
}
