import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, systemPrompt, conclusionPrompt } = body;

    if (!id || !title) {
      return NextResponse.json({ error: "id and title are required" }, { status: 400 });
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: {
        creatorId: true,
        memberships: {
          where: { userId: session.user.id },
          select: { role: true },
        },
      },
    });

    const role = existingProject?.memberships[0]?.role;
    if (!existingProject || (existingProject.creatorId !== session.user.id && role !== "creator" && role !== "manager")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description: description || null,
        systemPrompt: systemPrompt || null,
        conclusionPrompt: conclusionPrompt || null,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
