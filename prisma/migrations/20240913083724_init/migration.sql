/*
  Warnings:

  - A unique constraint covering the columns `[string]` on the table `Pisma` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Pisma` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `Pisma` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Pisma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Pisma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `string` to the `Pisma` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pisma" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "string" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pisma_string_key" ON "Pisma"("string");

-- CreateIndex
CREATE UNIQUE INDEX "Pisma_number_key" ON "Pisma"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Pisma_date_key" ON "Pisma"("date");
