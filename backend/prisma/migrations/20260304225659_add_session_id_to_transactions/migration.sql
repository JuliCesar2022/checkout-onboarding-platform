-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE INDEX "transactions_sessionId_idx" ON "transactions"("sessionId");
