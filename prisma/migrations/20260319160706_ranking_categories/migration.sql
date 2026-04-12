/*
  Warnings:

  - A unique constraint covering the columns `[teamId,category]` on the table `LeaderboardEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LeaderboardEntry_teamId_key";

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_teamId_category_key" ON "LeaderboardEntry"("teamId", "category");
