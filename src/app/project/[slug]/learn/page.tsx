import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type LearnPageProps = { params: Promise<{ slug: string }> };

export default async function ProjectLearnPage({ params }: LearnPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { id: true, slug: true, contentModel: true, creatorId: true },
  });
  if (!project) notFound();
  if (project.contentModel === null) redirect(`/project/${project.slug}`);

  const membership = await prisma.projectMembership.findUnique({
    where: { userId_projectId: { userId: session.user.id, projectId: project.id } },
    select: { role: true },
  });
  if (project.creatorId === session.user.id || membership?.role === "creator" || membership?.role === "manager") {
    redirect(`/project/${project.slug}/manage`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { selectedProjectId: true, selectedStoryId: true },
  });
  if (user?.selectedProjectId !== project.id || !user.selectedStoryId) {
    redirect(`/project/${project.slug}`);
  }

  redirect("/story");
}

