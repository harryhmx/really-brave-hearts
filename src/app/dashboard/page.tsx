import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toDisplayName } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { username, level, score } = session.user;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Username</p>
          <p className="text-lg font-medium">{toDisplayName(username)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Lexile Level</p>
            <p className="text-lg font-medium">{level ?? "Not set"}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-lg font-medium">{score}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
