import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Compass,
  FolderKanban,
  Layers3,
  Sparkles,
  Trophy,
  Users,
  UserRound,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDisplayName } from "@/lib/utils";

export const metadata = {
  title: "Dashboard | Really Brave Hearts",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [currentUser, projects, registeredStudents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        score: true,
        selectedProjectId: true,
        storyPhase: true,
        createdAt: true,
        selectedStory: {
          select: {
            id: true,
            title: true,
            depth: true,
            updatedAt: true,
            project: { select: { slug: true, title: true } },
          },
        },
      },
    }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        imageUrl: true,
        creatorId: true,
        _count: {
          select: { selectedByUsers: true, stories: true },
        },
      },
    }),
    prisma.user.findMany({
      where: {
        selectedProject: { slug: "adventure-academy" },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        username: true,
        storyPhase: true,
        updatedAt: true,
        selectedStory: {
          select: { title: true, depth: true },
        },
      },
    }),
  ]);

  if (!currentUser) {
    redirect("/api/auth/signout?callbackUrl=/login");
  }

  const displayName = toDisplayName(currentUser.username);
  const createdProjectCount = projects.filter(
    (project) => project.creatorId === currentUser.id
  ).length;
  const aaProject = projects.find((project) => project.slug === "adventure-academy");
  const isAaCreator = aaProject?.creatorId === currentUser.id;
  const hasSelectedAa = aaProject?.id === currentUser.selectedProjectId;
  const currentStory = currentUser.selectedStory;
  const currentStoryCompleted = Boolean(
    currentStory &&
      currentUser.storyPhase === 1 &&
      (currentStory.depth + 1) % 4 === 0
  );

  return (
    <div className="min-h-full bg-rbh-paper text-rbh-ink">
      <section className="border-b border-rbh-ink/10 bg-rbh-panel">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-end lg:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rbh-teal">
              RBH Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-rbh-ink/65">
              See your place across RBH projects, pick up your current learning track, and follow recent activity.
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-rbh-ink/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="flex size-11 items-center justify-center rounded-full bg-rbh-header font-semibold text-rbh-header-text">
              {displayName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="mt-0.5 text-xs text-rbh-ink/55">
                Member since {formatDate(currentUser.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:py-14">
        <section aria-label="Workspace overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Available projects"
            value={projects.length}
            detail="Across the RBH workspace"
            icon={<FolderKanban />}
            accent="text-rbh-teal"
          />
          <Metric
            label="Created by you"
            value={createdProjectCount}
            detail="Projects where you are creator"
            icon={<Sparkles />}
            accent="text-rbh-gold"
          />
          {isAaCreator ? (
            <>
              <Metric
                label="AA students"
                value={aaProject?._count.selectedByUsers ?? 0}
                detail="Users who selected Adventure Academy"
                icon={<Users />}
                accent="text-rbh-coral"
              />
              <Metric
                label="AA stories"
                value={aaProject?._count.stories ?? 0}
                detail="Stories in Adventure Academy"
                icon={<BookOpen />}
                accent="text-rbh-teal"
              />
            </>
          ) : (
            <>
              <Metric
                label="Your score"
                value={currentUser.score}
                detail="Adventure Academy points"
                icon={<Trophy />}
                accent="text-rbh-coral"
              />
              <Metric
                label="AA selection"
                value={hasSelectedAa ? "Selected" : "Not selected"}
                detail="Your Adventure Academy status"
                icon={<Compass />}
                accent="text-rbh-teal"
                compact
              />
            </>
          )}
        </section>

        <section className="mt-12">
          <SectionHeading
            eyebrow="Projects"
            title="List of RBH Projects"
            count={projects.length}
          />

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {projects.map((project) => {
              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-md border border-rbh-ink/10 bg-white/45 dark:bg-rbh-panel/30"
                >
                  <div className="grid sm:grid-cols-[180px_minmax(0,1fr)]">
                    <div className="relative aspect-[16/9] bg-rbh-panel sm:aspect-auto sm:min-h-56">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={`${project.title} project`}
                          fill
                          sizes="(min-width: 1024px) 180px, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-rbh-teal">
                          <Layers3 className="size-9" aria-hidden="true" />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col p-5">
                      <h2 className="text-xl font-bold tracking-tight">{project.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-rbh-ink/65">
                        {project.description ?? "No project description yet."}
                      </p>

                      <Link
                        href={`/project/${project.slug}`}
                        className="mt-5 inline-flex h-10 items-center justify-center gap-2 self-start rounded-md bg-rbh-header px-4 text-sm font-semibold text-rbh-header-text transition-colors hover:bg-rbh-teal"
                      >
                        Open project
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid items-stretch gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <DashboardPanel title="Account" icon={<UserRound />}>
            <dl className="divide-y divide-rbh-ink/10">
              <AccountRow label="Username" value={currentUser.username} />
              <AccountRow label="Email" value={currentUser.email ?? "Not provided"} />
              <AccountRow label="Phone" value={currentUser.phoneNumber ?? "Not provided"} />
              <AccountRow label="Joined" value={formatDate(currentUser.createdAt)} />
            </dl>
          </DashboardPanel>

          <DashboardPanel
            title={isAaCreator ? "List of registered students" : "Recent story activity"}
            icon={isAaCreator ? <Users /> : <BookOpen />}
          >
            {isAaCreator ? (
              registeredStudents.length === 0 ? (
                <EmptyPanelState
                  icon={<Users />}
                  message="No registered students yet"
                />
              ) : (
                <div className="divide-y divide-rbh-ink/10">
                  {registeredStudents.map((student) => {
                    const studentStoryCompleted = Boolean(
                      student.selectedStory &&
                        student.storyPhase === 1 &&
                        (student.selectedStory.depth + 1) % 4 === 0
                    );

                    return (
                      <div key={student.id} className="flex items-center justify-between gap-4 px-5 py-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{toDisplayName(student.username)}</p>
                          <p className="mt-1 truncate text-sm text-rbh-ink/55">
                            {student.selectedStory?.title ?? "No story started"}
                            {student.selectedStory && (
                              <> · {studentStoryCompleted ? "Completed" : "In progress"}</>
                            )}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-xs text-rbh-ink/50">
                          <CalendarDays className="size-4" aria-hidden="true" />
                          {formatDate(student.updatedAt)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : !currentStory ? (
              <EmptyPanelState
                icon={<BookOpen />}
                message="No story activity yet"
              />
            ) : (
              <div className="divide-y divide-rbh-ink/10">
                <Link
                  href={`/project/${currentStory.project.slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-rbh-panel/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{currentStory.title}</p>
                    <p className="mt-1 truncate text-sm text-rbh-ink/55">
                      {currentStory.project.title} · {currentStoryCompleted ? "Completed" : "In progress"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-rbh-ink/50">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    {formatDate(currentStory.updatedAt)}
                  </div>
                </Link>
              </div>
            )}
          </DashboardPanel>
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
  accent,
  compact = false,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: ReactNode;
  accent: string;
  compact?: boolean;
}) {
  return (
    <article className="min-h-36 rounded-md border border-rbh-ink/10 bg-rbh-panel/55 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-rbh-ink/60">{label}</p>
        <span className={accent}>{icon}</span>
      </div>
      <p className={`mt-5 font-bold tracking-tight ${compact ? "text-xl" : "text-3xl"}`}>
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-rbh-ink/50">{detail}</p>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-rbh-ink/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rbh-coral">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <p className="text-sm font-medium text-rbh-ink/50">
        {count} {count === 1 ? "project" : "projects"}
      </p>
    </div>
  );
}

function DashboardPanel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="h-full overflow-hidden rounded-md border border-rbh-ink/10 bg-white/40 dark:bg-rbh-panel/25">
      <div className="flex items-center gap-2 border-b border-rbh-ink/10 px-5 py-4">
        <span className="text-rbh-teal">{icon}</span>
        <h2 className="font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyPanelState({
  icon,
  message,
}: {
  icon: ReactNode;
  message: string;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
      <span className="text-rbh-coral">{icon}</span>
      <p className="mt-4 font-semibold">{message}</p>
    </div>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 px-5 py-4 text-sm">
      <dt className="text-rbh-ink/50">{label}</dt>
      <dd className="min-w-0 break-words font-medium">{value}</dd>
    </div>
  );
}
