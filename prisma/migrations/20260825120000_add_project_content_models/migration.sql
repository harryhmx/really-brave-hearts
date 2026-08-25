-- Additive roadmap models. Existing User, Project, and Story data is preserved.
ALTER TABLE "Project"
    ADD COLUMN IF NOT EXISTS "skillRefs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE TABLE IF NOT EXISTS "ProjectMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'manager',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProjectMembership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProjectMembership_userId_projectId_key"
    ON "ProjectMembership"("userId", "projectId");
CREATE INDEX IF NOT EXISTS "ProjectMembership_projectId_role_idx"
    ON "ProjectMembership"("projectId", "role");

ALTER TABLE "ProjectMembership"
    ADD CONSTRAINT "ProjectMembership_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectMembership"
    ADD CONSTRAINT "ProjectMembership_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "StoryProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "storyId" TEXT,
    "level" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "phase" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "StoryProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "StoryProgress_userId_projectId_key"
    ON "StoryProgress"("userId", "projectId");
CREATE INDEX IF NOT EXISTS "StoryProgress_projectId_status_idx"
    ON "StoryProgress"("projectId", "status");

ALTER TABLE "StoryProgress"
    ADD CONSTRAINT "StoryProgress_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StoryProgress"
    ADD CONSTRAINT "StoryProgress_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StoryProgress"
    ADD CONSTRAINT "StoryProgress_storyId_fkey"
    FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "access" TEXT NOT NULL DEFAULT 'free',
    "projectId" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");
CREATE INDEX IF NOT EXISTS "Article_projectId_access_idx" ON "Article"("projectId", "access");

ALTER TABLE "Article"
    ADD CONSTRAINT "Article_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article"
    ADD CONSTRAINT "Article_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
