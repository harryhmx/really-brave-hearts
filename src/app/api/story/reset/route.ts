import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const current = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { selectedProjectId: true },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        selectedStoryId: null,
        selectedProjectId: null,
        storyPhase: 0,
      },
    });

    if (current?.selectedProjectId) {
      await prisma.storyProgress.updateMany({
        where: { userId: session.user.id, projectId: current.selectedProjectId },
        data: { storyId: null, phase: 0, status: "not_started", completedAt: null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Story reset error:", error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
