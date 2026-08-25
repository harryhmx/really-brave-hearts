import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProjectEditForm from "@/components/project-edit-form";

type ManagePageProps = { params: Promise<{ slug: string }> };

export default async function ProjectManagePage({ params }: ManagePageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      systemPrompt: true,
      conclusionPrompt: true,
      creatorId: true,
      memberships: {
        where: { userId: session.user.id },
        select: { role: true },
      },
    },
  });

  if (!project) notFound();
  const role = project.memberships[0]?.role;
  const canManage = project.creatorId === session.user.id || role === "creator" || role === "manager";
  if (!canManage) redirect(`/project/${project.slug}`);

  return (
    <main className="min-h-full bg-rbh-paper px-6 py-10 text-rbh-ink sm:px-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-teal">PROJECT MANAGEMENT</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">{project.title}</h1>
          </div>
          <Link href={`/project/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-rbh-teal hover:underline">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to project
          </Link>
        </div>

        <section className="rounded-md border border-rbh-ink/10 bg-rbh-panel/60 p-6 sm:p-8">
          <ProjectEditForm project={project} redirectTo={`/project/${project.slug}`} />
        </section>
      </div>
    </main>
  );
}

