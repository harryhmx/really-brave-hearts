import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import StoryContent from "@/components/story-content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { selectedStoryId: true },
  });

  if (!user?.selectedStoryId) redirect("/dashboard");

  const story = await prisma.story.findUnique({
    where: { id: user.selectedStoryId },
  });

  if (!story) redirect("/dashboard");

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#311b92] dark:hover:text-[#d4b8ff] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>
      <StoryContent title={story.title} content={story.content} />
    </div>
  );
}
