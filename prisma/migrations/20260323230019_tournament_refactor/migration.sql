-- CreateEnum
CREATE TYPE "TournamentMode" AS ENUM ('FUTSAL', 'VOLLEY');

-- AlterEnum
ALTER TYPE "MatchStatus" ADD VALUE 'WALKOVER';

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_homeTeamId_fkey";

-- AlterTable
ALTER TABLE "Match" RENAME COLUMN "awayScore" TO "teamBScore";
ALTER TABLE "Match" RENAME COLUMN "awayTeamId" TO "teamBId";
ALTER TABLE "Match" RENAME COLUMN "homeScore" TO "teamAScore";
ALTER TABLE "Match" RENAME COLUMN "homeTeamId" TO "teamAId";
ALTER TABLE "Match" RENAME COLUMN "venue" TO "location";
ALTER TABLE "Match" RENAME COLUMN "stage" TO "phase";

ALTER TABLE "Match" ALTER COLUMN "phase" SET DEFAULT 'INITIAL_STAGE';

ALTER TABLE "Match" ADD COLUMN "leg" INTEGER;
ALTER TABLE "Match" ADD COLUMN "walkoverWinnerTeamId" TEXT;
ALTER TABLE "Match" ADD COLUMN "winnerTeamId" TEXT;
ALTER TABLE "Match" ALTER COLUMN "scheduledAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN "tournamentId" TEXT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN "mode" "TournamentMode" NOT NULL DEFAULT 'FUTSAL';

-- Data Migration: Set Team.tournamentId based on Group.tournamentId
UPDATE "Team"
SET "tournamentId" = "Group"."tournamentId"
FROM "Group"
WHERE "Team"."groupId" = "Group"."id";

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamAId_fkey" FOREIGN KEY ("teamAId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamBId_fkey" FOREIGN KEY ("teamBId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
