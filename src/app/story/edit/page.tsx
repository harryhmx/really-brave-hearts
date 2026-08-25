import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProjectEditForm from "@/components/project-edit-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StoryEditPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findFirst({
    where: {
      creatorId: session.user.id,
      contentModel: "story",
    },
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
          <h2 className="text-xl font-bold text-white">Edit Story</h2>
        </div>
        <div className="p-6">
          <ProjectEditForm project={project} />
          <div className="mt-4">
            <Link href="/story">
              <button className="w-full h-11 rounded-xl border border-pink-100 dark:border-pink-900/30 text-muted-foreground hover:bg-pink-50/50 dark:hover:bg-pink-900/5 transition-colors flex items-center justify-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
