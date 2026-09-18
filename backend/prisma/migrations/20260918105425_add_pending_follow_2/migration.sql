/*
  Warnings:

  - Made the column `isPending` on table `Follow` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'FOLLOW_ACCEPTED';

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "isPending" SET NOT NULL,
ALTER COLUMN "isPending" SET DEFAULT false;
