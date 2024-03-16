/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `Log` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Log_roomId_key" ON "Log"("roomId");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
