-- Compatibility backfill from the legacy creator and per-user story fields.
INSERT INTO "ProjectMembership" ("id", "userId", "projectId", "role", "createdAt", "updatedAt")
SELECT 'membership_' || project."id" || '_' || project."creatorId",
       project."creatorId",
       project."id",
       'creator',
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM "Project" AS project
WHERE project."creatorId" IS NOT NULL
ON CONFLICT ("userId", "projectId") DO NOTHING;

INSERT INTO "StoryProgress" (
    "id", "userId", "projectId", "storyId", "level", "score", "phase", "status", "createdAt", "updatedAt"
)
SELECT 'progress_' || users."id" || '_' || users."selectedProjectId",
       users."id",
       users."selectedProjectId",
       users."selectedStoryId",
       users."level",
       users."score",
       users."storyPhase",
       CASE WHEN users."selectedStoryId" IS NULL THEN 'not_started' ELSE 'in_progress' END,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM "User" AS users
WHERE users."selectedProjectId" IS NOT NULL
ON CONFLICT ("userId", "projectId") DO NOTHING;
