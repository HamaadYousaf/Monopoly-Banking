/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `FreeParking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FreeParking_roomId_key" ON "FreeParking"("roomId");
