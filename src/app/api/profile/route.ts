import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { age, level, selectedProjectId } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(age !== undefined && { age: Number(age) }),
        ...(level !== undefined && { level: String(level) }),
        ...(selectedProjectId !== undefined && { selectedProjectId }),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
