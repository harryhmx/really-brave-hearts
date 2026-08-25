-- Add project metadata required by the RBH project pages.
ALTER TABLE "Project"
    ADD COLUMN "slug" TEXT,
    ADD COLUMN "contentModel" TEXT,
    ADD COLUMN "imageUrl" TEXT,
    ADD COLUMN "creatorId" TEXT;

-- Preserve the existing local Adventure Academy project while making slug required.
UPDATE "Project"
SET "slug" = CASE
    WHEN "id" = 'local-adventure-academy' THEN 'adventure-academy'
    ELSE 'project-' || "id"
END
WHERE "slug" IS NULL;

ALTER TABLE "Project"
    ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

ALTER TABLE "Project"
    ADD CONSTRAINT "Project_creatorId_fkey"
    FOREIGN KEY ("creatorId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
