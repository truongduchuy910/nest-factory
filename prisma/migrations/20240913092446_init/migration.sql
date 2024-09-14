/*
  Warnings:

  - You are about to drop the `Pisma` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Pisma";

-- CreateTable
CREATE TABLE "Pris" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "string" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pris_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pris_createdAt_key" ON "Pris"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Pris_string_key" ON "Pris"("string");

-- CreateIndex
CREATE UNIQUE INDEX "Pris_number_key" ON "Pris"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Pris_date_key" ON "Pris"("date");
