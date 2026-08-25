import { prisma } from "@/lib/prisma";

export type SkillsStory = {
  id: string;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  audioUrl?: string | null;
  rcQuestion?: string | null;
  rcAnswer?: string | null;
  ctQuestion?: string | null;
  age?: number;
  level?: string;
  requireStoryId?: string | null;
  requireChoice?: string | null;
  depth?: number;
};

/**
 * Skills owns generation and media delivery; Core owns the runtime Story row.
 * The project ID is deliberately supplied by Core so remote Supabase IDs never
 * leak into the local PostgreSQL domain.
 */
export async function persistSkillsStory({
  projectId,
  age,
  level,
  story,
}: {
  projectId: string;
  age: number;
  level: string;
  story: SkillsStory;
}) {
  return prisma.story.upsert({
    where: { id: story.id },
    create: {
      id: story.id,
      title: story.title,
      content: story.content ?? null,
      imageUrl: story.imageUrl ?? null,
      audioUrl: story.audioUrl ?? null,
      rcQuestion: story.rcQuestion ?? null,
      rcAnswer: story.rcAnswer ?? null,
      ctQuestion: story.ctQuestion ?? null,
      age,
      level,
      projectId,
      requireStoryId: story.requireStoryId ?? null,
      requireChoice: story.requireChoice ?? null,
      depth: story.depth ?? 0,
    },
    update: {
      title: story.title,
      content: story.content ?? null,
      imageUrl: story.imageUrl ?? undefined,
      audioUrl: story.audioUrl ?? undefined,
      rcQuestion: story.rcQuestion ?? null,
      rcAnswer: story.rcAnswer ?? null,
      ctQuestion: story.ctQuestion ?? null,
      age,
      level,
      projectId,
      requireStoryId: story.requireStoryId ?? null,
      requireChoice: story.requireChoice ?? null,
      depth: story.depth ?? 0,
    },
  });
}

export async function upsertStoryProgress({
  userId,
  projectId,
  storyId,
  level,
  score,
  phase,
  status = "in_progress",
  completed = false,
}: {
  userId: string;
  projectId: string;
  storyId?: string | null;
  level?: string | null;
  score?: number;
  phase?: number;
  status?: string;
  completed?: boolean;
}) {
  const now = new Date();
  return prisma.storyProgress.upsert({
    where: { userId_projectId: { userId, projectId } },
    create: {
      userId,
      projectId,
      storyId: storyId ?? null,
      level: level ?? null,
      score: score ?? 0,
      phase: phase ?? 0,
      status: completed ? "completed" : status,
      startedAt: now,
      completedAt: completed ? now : null,
    },
    update: {
      storyId: storyId ?? undefined,
      level: level ?? undefined,
      score,
      phase,
      status: completed ? "completed" : status,
      ...(completed ? { completedAt: now } : {}),
    },
  });
}
