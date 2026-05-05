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

    if (phase === undefined || phase < 0 || phase > 3) {
      return NextResponse.json({ error: "Invalid phase" }, { status: 400 });
    }

    if (phase === 1) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { selectedStoryId: true },
      });

      if (user?.selectedStoryId) {
        const story = await prisma.story.findUnique({
          where: { id: user.selectedStoryId },
          select: { depth: true },
        });

        if (story && (story.depth + 1) % 4 === 0) {
          await prisma.user.update({
            where: { id: session.user.id },
            data: {
              storyPhase: 1,
              score: { increment: 20 },
            },
          });
          return NextResponse.json({ success: true, stageCompleted: true });
        }
      }
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
