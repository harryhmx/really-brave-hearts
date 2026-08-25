import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertStoryProgress } from "@/lib/story-service";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phase } = body;

    if (phase === undefined || phase < 0 || phase > 3) {
      return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
    }

    if (phase === 1) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { selectedStoryId: true, selectedProjectId: true, level: true, score: true },
      });

      if (user?.selectedStoryId) {
        const story = await prisma.story.findUnique({
          where: { id: user.selectedStoryId },
          select: { depth: true },
        });

        if (story && (story.depth + 1) % 4 === 0) {
          const updated = await prisma.user.update({
            where: { id: session.user.id },
            data: {
              storyPhase: 1,
              score: { increment: 20 },
            },
          });
          if (user.selectedProjectId) {
            await upsertStoryProgress({
              userId: session.user.id,
              projectId: user.selectedProjectId,
              storyId: user.selectedStoryId,
              level: user.level,
              score: updated.score,
              phase: 1,
              completed: true,
            });
          }
          return NextResponse.json({ success: true, stageCompleted: true });
        }
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { selectedProjectId: true, selectedStoryId: true, level: true, score: true },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { storyPhase: phase },
    });
    if (user?.selectedProjectId) {
      await upsertStoryProgress({
        userId: session.user.id,
        projectId: user.selectedProjectId,
        storyId: user.selectedStoryId,
        level: user.level,
        score: user.score,
        phase,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Phase update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
