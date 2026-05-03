export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StoryPhase0 from "@/components/story-phase0";
import RCQuestion from "@/components/rc-question";
import CTQuestion from "@/components/ct-question";
import StoryCompleted from "@/components/story-completed";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";

export default async function StoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      selectedStoryId: true,
      selectedProjectId: true,
      storyPhase: true,
      score: true,
      selectedProject: { select: { title: true } },
    },
  });

  if (!user?.selectedStoryId) redirect("/dashboard");

  const story = await prisma.story.findUnique({
    where: { id: user.selectedStoryId },
    select: {
      id: true, title: true, content: true,
      imageUrl: true, audioUrl: true,
      rcQuestion: true, rcAnswer: true, ctQuestion: true,
    },
  });

  if (!story) redirect("/dashboard");

  return (
    <>
      <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] px-4 py-2 shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30 hover:scale-105 transition-transform cursor-default">
        <Star className="h-5 w-5 text-white" />
        <span className="font-bold text-white">{user.score}</span>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#311b92] dark:hover:text-[#d4b8ff] mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard to Restart Story
        </Link>

      {user.storyPhase === 0 && (
        <StoryPhase0
          title={story.title}
          content={story.content}
          imageUrl={story.imageUrl}
          audioUrl={story.audioUrl}
          storyId={story.id}
        />
      )}

      {user.storyPhase === 1 && (
        <RCQuestion
          rcQuestion={story.rcQuestion}
          rcAnswer={story.rcAnswer}
        />
      )}

      {user.storyPhase === 2 && (
        <CTQuestion
          ctQuestion={story.ctQuestion}
        />
      )}

      {user.storyPhase === 3 && user.selectedProjectId && (
        <StoryCompleted
          projectTitle={user.selectedProject?.title ?? "Story"}
          projectId={user.selectedProjectId}
          score={user.score}
        />
      )}
      </div>
    </>
  );
}
