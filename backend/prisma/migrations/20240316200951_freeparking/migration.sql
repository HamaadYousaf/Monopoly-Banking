-- CreateTable
CREATE TABLE "FreeParking" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "FreeParking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FreeParking" ADD CONSTRAINT "FreeParking_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
