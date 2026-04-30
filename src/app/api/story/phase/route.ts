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
    const { phase } = body;

    if (phase === undefined || phase < 0 || phase > 2) {
      return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { storyPhase: phase },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Phase update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
