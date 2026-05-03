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
    const { type, answer, choice, choiceLabel } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        selectedStoryId: true,
        selectedProjectId: true,
        score: true,
        storyPhase: true,
        age: true,
        level: true,
      },
    });

    if (!user?.selectedStoryId) {
      return NextResponse.json({ error: "No story selected" }, { status: 400 });
    }

    const story = await prisma.story.findUnique({
      where: { id: user.selectedStoryId },
      select: {
        id: true, title: true, content: true, rcAnswer: true, ctQuestion: true,
        depth: true, projectId: true,
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (type === "rc") {
      if (!answer) {
        return NextResponse.json({ error: "answer is required" }, { status: 400 });
      }

      const correct = answer.toLowerCase() === story.rcAnswer?.toLowerCase();

      if (correct) {
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: { score: { increment: 10 }, storyPhase: 2 },
          select: { score: true },
        });

        return NextResponse.json({
          correct: true,
          score: updated.score,
          rcAnswer: story.rcAnswer,
          advanceToCT: true,
        });
      }

      const currentRetries = body.retries ?? 0;
      const forceAdvance = currentRetries + 1 >= 2;

      if (forceAdvance) {
        await prisma.user.update({
          where: { id: user.id },
          data: { storyPhase: 2 },
        });
      }

      return NextResponse.json({
        correct: false,
        score: user.score,
        rcAnswer: story.rcAnswer,
        advanceToCT: forceAdvance,
      });
    }

    if (type === "ct") {
      if (!choice) {
        return NextResponse.json({ error: "choice is required" }, { status: 400 });
      }

      if (!user.selectedProjectId) {
        return NextResponse.json({ error: "No project selected" }, { status: 400 });
      }

      const isStageCompleted = (story.depth + 1) % 4 === 0;

      if (isStageCompleted) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            storyPhase: 3,
            score: { increment: 20 },
          },
          select: { score: true },
        });
        return NextResponse.json({
          stageCompleted: true,
          projectId: user.selectedProjectId,
          projectTitle: (await prisma.project.findUnique({
            where: { id: user.selectedProjectId },
            select: { title: true },
          }))?.title ?? "Story",
        });
      }

      const project = await prisma.project.findUnique({
        where: { id: user.selectedProjectId },
        select: { id: true, title: true, description: true },
      });

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      // Check for existing branch story
      let nextStory = await prisma.story.findFirst({
        where: {
          projectId: project.id,
          age: user.age!,
          level: user.level!,
          requireStoryId: story.id,
          requireChoice: choice,
        },
      });

      let mediaReady = !!nextStory?.imageUrl && !!nextStory?.audioUrl;

      if (!nextStory) {
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
            require_story_id: story.id,
            require_choice: choiceLabel || choice,
            depth: story.depth + 1,
            parent_story_title: story.title,
            parent_story_content: story.content,
          }),
        });

        if (!skillsRes.ok) {
          const errorText = await skillsRes.text();
          console.error("rbh-skills error:", errorText);
          return NextResponse.json(
            { error: "Failed to generate next story" },
            { status: 502 }
          );
        }

        const skillsData = await skillsRes.json();
        nextStory = skillsData.story;
        mediaReady = skillsData.mediaReady ?? false;
      }

      if (!nextStory) {
        return NextResponse.json(
          { error: "Failed to load next story" },
          { status: 502 }
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          selectedStoryId: nextStory.id,
          storyPhase: 0,
        },
      });

      return NextResponse.json({ story: nextStory, mediaReady });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Answer submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
