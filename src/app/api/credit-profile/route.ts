import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { creditProfileSchema } from "@/lib/validations";
import { getCreditScoreCategory } from "@/lib/utils";

// GET /api/credit-profile — fetch the current user's credit profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.creditProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true, data: profile });
}

// POST /api/credit-profile — create a new credit profile
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = creditProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.creditProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Credit profile already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    const profile = await prisma.creditProfile.create({
      data: {
        ...parsed.data,
        userId: session.user.id,
        scoreCategory: getCreditScoreCategory(parsed.data.creditScore),
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (err) {
    console.error("[CREDIT_PROFILE_POST]", err);
    return NextResponse.json({ success: false, error: "Failed to create profile" }, { status: 500 });
  }
}

// PUT /api/credit-profile — update existing credit profile
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = creditProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const profile = await prisma.creditProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...parsed.data,
        scoreCategory: getCreditScoreCategory(parsed.data.creditScore),
        lastUpdated: new Date(),
      },
      create: {
        ...parsed.data,
        userId: session.user.id,
        scoreCategory: getCreditScoreCategory(parsed.data.creditScore),
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (err) {
    console.error("[CREDIT_PROFILE_PUT]", err);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
