import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import StartStoryButton from "@/components/start-story-button";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      contentModel: true,
      imageUrl: true,
      creatorId: true,
    },
  });
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  return {
    title: project ? `${project.title} | Really Brave Hearts` : "Project | Really Brave Hearts",
    description: project?.description ?? "Explore a Really Brave Hearts project.",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [session, project] = await Promise.all([auth(), getProject(slug)]);

  if (!project) notFound();

  const projectPath = `/project/${project.slug}`;
  const isAaCreator =
    project.slug === "adventure-academy" && project.creatorId === session?.user?.id;
  return (
    <div className="bg-rbh-paper text-rbh-ink">
      <section className="border-b border-rbh-ink/10 bg-rbh-panel">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-coral">RBH PROJECT</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{project.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-rbh-ink/70">{project.description || "Explore this Really Brave Hearts project."}</p>
            {project.contentModel === "story" && !isAaCreator && (
              <div className="mt-8">
                <StartStoryButton projectId={project.id} isAuthenticated={!!session?.user} callbackUrl={projectPath} />
              </div>
            )}
            {isAaCreator && (
              <p className="mt-8 max-w-md rounded-md border border-rbh-teal/25 bg-rbh-teal/10 px-4 py-3 text-sm leading-6 text-rbh-ink/70">
                You are the Adventure Academy creator. Learning access is reserved for registered students.
              </p>
            )}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-rbh-panel">
            {project.imageUrl ? (
              <Image src={project.imageUrl} alt={`${project.title} project`} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            ) : (
              <div className="absolute inset-0 bg-rbh-panel" aria-hidden="true" />
            )}
          </div>
        </div>
      </section>

      <section id="related-articles" className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:py-24">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-teal">RELATED ARTICLES</p>
          <p className="mt-4 text-lg font-medium text-rbh-ink/50">No Article</p>
        </div>
      </section>
    </div>
  );
}
