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
  });

  if (!user) {
    redirect("/login");
  }

  if (user.usertype === "teacher") {
    const students = await prisma.user.findMany({
      where: { usertype: "student" },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Username</th>
                <th className="text-left p-3 font-medium">Age</th>
                <th className="text-left p-3 font-medium">Lexile Level</th>
                <th className="text-left p-3 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No students yet
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b last:border-0">
                    <td className="p-3">
                      {toDisplayName(student.username)}
                    </td>
                    <td className="p-3">{student.age ?? "—"}</td>
                    <td className="p-3">{student.level ?? "—"}</td>
                    <td className="p-3">{student.score}</td>
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
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        Welcome, {toDisplayName(user.username)}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Age: {user.age} · Lexile Level: {user.level} · Score: {user.score}
      </p>
      <ProjectCard
        projectId={project.id}
        title={project.title}
        description={project.description}
      />
    </div>
  );
}
