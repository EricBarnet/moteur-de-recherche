/*
  Warnings:

  - You are about to drop the `ForwardIndex` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InvertedIndex` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ForwardIndex" DROP CONSTRAINT "ForwardIndex_bookId_fkey";

-- DropTable
DROP TABLE "ForwardIndex";

-- DropTable
DROP TABLE "InvertedIndex";

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
