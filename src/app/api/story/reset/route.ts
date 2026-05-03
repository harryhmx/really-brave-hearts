import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        selectedStoryId: null,
        selectedProjectId: null,
        storyPhase: 0,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Story reset error:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
