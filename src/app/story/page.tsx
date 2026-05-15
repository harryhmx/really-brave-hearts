export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StoryPhase0 from "@/components/story-phase0";
import RCQuestion from "@/components/rc-question";
import CTQuestion from "@/components/ct-question";
import StoryCompleted from "@/components/story-completed";
import { Star, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      usertype: true,
      selectedStoryId: true,
      selectedProjectId: true,
      storyPhase: true,
      score: true,
      selectedProject: { select: { title: true } },
    },
  });

  if (!user) redirect("/api/auth/signout?callbackUrl=/login");

  // Teacher view
  if (user.usertype === "teacher") {
    const project = await prisma.project.findFirst({
      select: {
        id: true, title: true, description: true,
        systemPrompt: true, conclusionPrompt: true,
      },
    });

    if (!project) redirect("/dashboard");

    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
        <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
          <div className="bg-gradient-to-r from-[#ff6b95] to-[#a855f7] px-6 py-4">
            <h2 className="text-xl font-bold text-white">{project.title}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Description</h3>
              <pre className="whitespace-pre-wrap text-sm text-[#4a148c] dark:text-[#c4a8e8] bg-muted/30 dark:bg-muted/10 rounded-xl p-4 max-h-80 overflow-y-auto font-mono">
                {project.description || "—"}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">System Prompt</h3>
              <pre className="whitespace-pre-wrap text-sm text-[#4a148c] dark:text-[#c4a8e8] bg-muted/30 dark:bg-muted/10 rounded-xl p-4 max-h-80 overflow-y-auto font-mono">
                {project.systemPrompt || "—"}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Conclusion Prompt</h3>
              <pre className="whitespace-pre-wrap text-sm text-[#4a148c] dark:text-[#c4a8e8] bg-muted/30 dark:bg-muted/10 rounded-xl p-4 max-h-80 overflow-y-auto font-mono">
                {project.conclusionPrompt || "—"}
              </pre>
            </div>

            <div className="flex gap-3">
              <Link href="/story/edit" className="flex-1">
                <button className="w-full h-11 bg-gradient-to-r from-[#ff6b95] to-[#a855f7] text-white rounded-xl flex items-center justify-center gap-2 hover:from-[#ff527b] hover:to-[#9333ea] transition-all">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <button className="w-full h-11 rounded-xl border border-pink-100 dark:border-pink-900/30 text-muted-foreground hover:bg-pink-50/50 dark:hover:bg-pink-900/5 transition-colors flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student view
  if (!user.selectedStoryId) redirect("/dashboard");

  const story = await prisma.story.findUnique({
    where: { id: user.selectedStoryId },
    select: {
      id: true, title: true, content: true,
      imageUrl: true, audioUrl: true,
      rcQuestion: true, rcAnswer: true, ctQuestion: true,
      depth: true,
    },
  });

  if (!story) redirect("/dashboard");

  const isConclusion = (story.depth + 1) % 4 === 0;

  return (
    <>
      <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ffa500] px-4 py-2 shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30 hover:scale-105 transition-transform cursor-default">
        <Star className="h-5 w-5 text-white" />
        <span className="font-bold text-white">{user.score}</span>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
      {user.storyPhase === 0 && (
        <StoryPhase0
          title={story.title}
          content={story.content}
          imageUrl={story.imageUrl}
          audioUrl={story.audioUrl}
          storyId={story.id}
          isConclusion={isConclusion}
        />
      )}

      {user.storyPhase === 1 && isConclusion && user.selectedProjectId && (
        <StoryCompleted
          userName={user.username}
          projectTitle={user.selectedProject?.title ?? "Story"}
          projectId={user.selectedProjectId}
          score={user.score}
        />
      )}

      {user.storyPhase === 1 && !isConclusion && (
        <RCQuestion
          rcQuestion={story.rcQuestion}
          rcAnswer={story.rcAnswer}
        />
      )}

      {user.storyPhase === 2 && !isConclusion && (
        <CTQuestion
          ctQuestion={story.ctQuestion}
        />
      )}
      </div>
    </>
  );
}
