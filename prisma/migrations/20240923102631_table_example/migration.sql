-- CreateTable
CREATE TABLE "example" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "string" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duplicate" INTEGER,

    CONSTRAINT "example_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "example_created_at_key" ON "example"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "example_string_key" ON "example"("string");

-- CreateIndex
CREATE UNIQUE INDEX "example_number_key" ON "example"("number");

-- CreateIndex
CREATE UNIQUE INDEX "example_date_key" ON "example"("date");
