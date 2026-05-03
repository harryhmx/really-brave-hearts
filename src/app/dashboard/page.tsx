import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toDisplayName } from "@/lib/utils";
import ProfileForm from "@/components/profile-form";
import ProjectCard from "@/components/project-card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, username: true, usertype: true,
      age: true, level: true, score: true,
      selectedStoryId: true, selectedProjectId: true, storyPhase: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.selectedStoryId && user.storyPhase !== 3) {
    redirect("/story");
  }

  if (user.storyPhase === 3) {
    await prisma.user.update({
      where: { id: user.id },
      data: { selectedStoryId: null, selectedProjectId: null, storyPhase: 0 },
    });
  }

  if (user.usertype === "teacher") {
    const students = await prisma.user.findMany({
      where: { usertype: "student" },
      orderBy: { createdAt: "desc" },
      select: { id: true, username: true, age: true, level: true, score: true },
    });

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 animate-fade-in-up">
        <h1 className="text-2xl font-bold text-[#311b92] dark:text-[#d4b8ff] mb-6">
          Teacher Dashboard
        </h1>
        <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-white dark:bg-[#22103a] overflow-hidden shadow-lg shadow-pink-100/50 dark:shadow-pink-900/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#ff6b95]/10 to-[#a855f7]/10 dark:from-[#ff6b95]/5 dark:to-[#a855f7]/5">
                <th className="text-left p-4 font-semibold text-[#311b92] dark:text-[#d4b8ff]">
                  Username
                </th>
                <th className="text-left p-4 font-semibold text-[#311b92] dark:text-[#d4b8ff]">
                  Age
                </th>
                <th className="text-left p-4 font-semibold text-[#311b92] dark:text-[#d4b8ff]">
                  Lexile Level
                </th>
                <th className="text-left p-4 font-semibold text-[#311b92] dark:text-[#d4b8ff]">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No students yet
                  </td>
                </tr>
              ) : (
                students.map((student, i) => (
                  <tr
                    key={student.id}
                    className={`border-b border-pink-50 dark:border-pink-900/10 last:border-0 hover:bg-pink-50/50 dark:hover:bg-pink-900/5 transition-colors ${
                      i % 2 === 0 ? "" : "bg-muted/30"
                    }`}
                  >
                    <td className="p-4 font-medium text-[#4a148c] dark:text-[#c4a8e8]">
                      {toDisplayName(student.username)}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {student.age ?? "—"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {student.level ?? "—"}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#a855f7]/10 dark:bg-[#a855f7]/20 text-[#7c3aed] dark:text-[#c084fc]">
                        {student.score}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Student flow
  if (!user.age || !user.level) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <ProfileForm />
      </div>
    );
  }

  const project = await prisma.project.findFirst();

  if (!project) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <p className="text-muted-foreground text-center">No projects available yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
      <div className="rounded-2xl border border-pink-100 dark:border-pink-900/30 bg-gradient-to-br from-white to-pink-50/50 dark:from-[#22103a] dark:to-[#2a1040] p-6 mb-6 shadow-md">
        <h1 className="text-2xl font-bold text-[#311b92] dark:text-[#d4b8ff] mb-2">
          Welcome, {toDisplayName(user.username)}
        </h1>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Age: <span className="font-medium text-[#4a148c] dark:text-[#c4a8e8]">{user.age}</span>
          </span>
          <span className="text-muted-foreground">
            Lexile: <span className="font-medium text-[#4a148c] dark:text-[#c4a8e8]">{user.level}</span>
          </span>
          <span className="text-muted-foreground">
            Score: <span className="font-medium text-[#4a148c] dark:text-[#c4a8e8]">{user.score}</span>
          </span>
        </div>
      </div>

      <ProjectCard
        projectId={project.id}
        title={project.title}
        description={project.description}
      />
    </div>
  );
}
