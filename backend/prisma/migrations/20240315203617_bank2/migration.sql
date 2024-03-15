/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Bank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bank_userId_key" ON "Bank"("userId");
