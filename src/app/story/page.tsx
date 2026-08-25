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
      selectedStoryId: true,
      selectedProjectId: true,
      storyPhase: true,
      score: true,
      selectedProject: { select: { title: true, slug: true } },
      memberships: {
        where: {
          role: { in: ["creator", "manager"] },
          project: { contentModel: "story" },
        },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: {
          role: true,
          project: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              systemPrompt: true,
              conclusionPrompt: true,
              contentModel: true,
            },
          },
        },
      },
    },
  });

  if (!user) redirect("/api/auth/signout?callbackUrl=/login");

  // Creator management view
  const creatorProject = user.memberships[0]?.project;
  if (creatorProject) {

    return (
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        <div className="overflow-hidden rounded-md border border-rbh-ink/10 bg-rbh-panel/45">
          <div className="border-b border-rbh-ink/10 bg-rbh-header px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rbh-gold">PROJECT MANAGEMENT</p>
            <h2 className="mt-2 text-xl font-bold text-rbh-header-text">{creatorProject.title}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Description</h3>
              <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-md bg-rbh-paper p-4 font-mono text-sm text-rbh-ink/80">
                {creatorProject.description || "—"}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">System Prompt</h3>
              <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-md bg-rbh-paper p-4 font-mono text-sm text-rbh-ink/80">
                {creatorProject.systemPrompt || "—"}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Conclusion Prompt</h3>
              <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-md bg-rbh-paper p-4 font-mono text-sm text-rbh-ink/80">
                {creatorProject.conclusionPrompt || "—"}
              </pre>
            </div>

            <div className="flex gap-3">
              <Link href={`/project/${creatorProject.slug}/manage`} className="flex-1">
                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-rbh-coral text-white transition-all hover:brightness-95">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </Link>
              <Link href={`/project/${creatorProject.slug}`} className="flex-1">
                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-rbh-ink/15 text-rbh-muted transition-colors hover:bg-rbh-teal/10">
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
  if (!user.selectedStoryId) redirect(`/project/${user.selectedProject?.slug ?? "adventure-academy"}`);

  const story = await prisma.story.findUnique({
    where: { id: user.selectedStoryId },
    select: {
      id: true, title: true, content: true,
      imageUrl: true, audioUrl: true,
      rcQuestion: true, rcAnswer: true, ctQuestion: true,
      depth: true,
    },
  });

  if (!story) redirect(`/project/${user.selectedProject?.slug ?? "adventure-academy"}`);

  const isConclusion = (story.depth + 1) % 4 === 0;

  return (
    <>
      <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-full bg-rbh-gold px-4 py-2 text-rbh-header shadow-lg transition-transform hover:scale-105">
        <Star className="h-5 w-5" />
        <span className="font-bold">{user.score}</span>
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
          projectSlug={user.selectedProject?.slug}
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
