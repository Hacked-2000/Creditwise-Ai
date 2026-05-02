import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { financialAccountSchema } from "@/lib/validations";

// GET /api/accounts — list all accounts for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.financialAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: accounts });
}

// POST /api/accounts — add a new financial account
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = financialAccountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const account = await prisma.financialAccount.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
        openedDate: new Date(parsed.data.openedDate),
      },
    });

    return NextResponse.json({ success: true, data: account }, { status: 201 });
  } catch (err) {
    console.error("[ACCOUNTS_POST]", err);
    return NextResponse.json({ success: false, error: "Failed to add account" }, { status: 500 });
  }
}
