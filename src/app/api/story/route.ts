import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RBH_SKILLS_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, requireStoryId, requireChoice, depth, parentStoryTitle, freshStory } = body;
    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, age: true, level: true },
    });
    if (!user?.age || !user?.level) {
      return NextResponse.json({ error: "Profile incomplete" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, title: true, description: true },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let story = freshStory ? null : await prisma.story.findFirst({
      where: {
        projectId: project.id,
        age: user.age,
        level: user.level,
        ...(requireStoryId && { requireStoryId }),
        ...(requireChoice && { requireChoice }),
      },
    });

    let mediaReady = !!story?.imageUrl && !!story?.audioUrl;

    if (!story) {
      const skillsRes = await fetch(`${RBH_SKILLS_URL}/api/story/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer internal-service-call",
        },
        body: JSON.stringify({
          project_title: project.title,
          project_description: project.description ?? "",
          user_age: user.age,
          user_level: user.level,
          project_id: project.id,
          require_story_id: requireStoryId ?? null,
          require_choice: requireChoice ?? null,
          depth: depth ?? 0,
          parent_story_title: parentStoryTitle ?? null,
          fresh_story: true,
        }),
      });

      if (!skillsRes.ok) {
        const errorText = await skillsRes.text();
        console.error("rbh-skills error:", errorText);
        return NextResponse.json(
          { error: "Failed to generate story" },
          { status: 502 }
        );
      }

      const skillsData = await skillsRes.json();
      story = skillsData.story;
      mediaReady = skillsData.mediaReady ?? false;
    }

    if (!story) {
      return NextResponse.json({ error: "Story generation failed" }, { status: 502 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        selectedProjectId: project.id,
        selectedStoryId: story.id,
        storyPhase: 0,
      },
    });

    return NextResponse.json({ story, mediaReady });
  } catch (error) {
    console.error("Story load error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
