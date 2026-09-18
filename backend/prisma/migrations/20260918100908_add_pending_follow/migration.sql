-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PENDING_FOLLOW';

-- AlterTable
ALTER TABLE "Follow" ADD COLUMN     "isPending" BOOLEAN;
