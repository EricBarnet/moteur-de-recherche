/*
  Warnings:

  - You are about to drop the column `bookId` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Word` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_bookId_fkey";

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "bookId",
DROP COLUMN "frequency";

-- CreateTable
CREATE TABLE "BookWord" (
    "bookId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BookWord_pkey" PRIMARY KEY ("bookId","wordId")
);

-- AddForeignKey
ALTER TABLE "BookWord" ADD CONSTRAINT "BookWord_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookWord" ADD CONSTRAINT "BookWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
