import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RBH_SKILLS_URL } from "@/lib/config";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get("storyId");
    if (!storyId) {
      return NextResponse.json({ error: "storyId is required" }, { status: 400 });
    }

    const res = await fetch(
      `${RBH_SKILLS_URL}/api/story/status/${storyId}`,
      { headers: { Authorization: "Bearer internal-service-call" } }
    );

    if (!res.ok) {
      return NextResponse.json({ imageReady: false, audioReady: false });
    }

    const data = await res.json();

    if (data.imageReady || data.audioReady) {
      const story = await prisma.story.findUnique({
        where: { id: storyId },
        select: { imageUrl: true, audioUrl: true },
      });
      return NextResponse.json({
        imageReady: !!story?.imageUrl,
        audioReady: !!story?.audioUrl,
        imageUrl: story?.imageUrl ?? null,
        audioUrl: story?.audioUrl ?? null,
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ imageReady: false, audioReady: false });
  }
}
