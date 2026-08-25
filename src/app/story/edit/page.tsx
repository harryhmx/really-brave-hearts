import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function StoryEditPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findFirst({
    where: {
      creatorId: session.user.id,
      contentModel: "story",
    },
    select: {
      slug: true,
    },
  });

  if (!project) redirect("/dashboard");
  redirect(`/project/${project.slug}/manage`);
}
