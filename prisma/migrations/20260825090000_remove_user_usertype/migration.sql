-- User roles are now derived from Project.creatorId rather than a global usertype column.
ALTER TABLE "User" DROP COLUMN "usertype";
