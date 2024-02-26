/*
  Warnings:

  - You are about to drop the column `livreId` on the `ForwardIndex` table. All the data in the column will be lost.
  - You are about to drop the column `mot` on the `ForwardIndex` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `ForwardIndex` table. All the data in the column will be lost.
  - The primary key for the `InvertedIndex` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mot` on the `InvertedIndex` table. All the data in the column will be lost.
  - You are about to drop the column `occurrences` on the `InvertedIndex` table. All the data in the column will be lost.
  - You are about to drop the `Livre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookId` to the `ForwardIndex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `ForwardIndex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `word` to the `InvertedIndex` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ForwardIndex" DROP CONSTRAINT "ForwardIndex_livreId_fkey";

-- DropIndex
DROP INDEX "idx_livre";

-- AlterTable
ALTER TABLE "ForwardIndex" DROP COLUMN "livreId",
DROP COLUMN "mot",
DROP COLUMN "position",
ADD COLUMN     "bookId" INTEGER NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "InvertedIndex" DROP CONSTRAINT "InvertedIndex_pkey",
DROP COLUMN "mot",
DROP COLUMN "occurrences",
ADD COLUMN     "bookIds" INTEGER[],
ADD COLUMN     "word" TEXT NOT NULL,
ADD CONSTRAINT "InvertedIndex_pkey" PRIMARY KEY ("word");

-- DropTable
DROP TABLE "Livre";

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3),
    "language" TEXT,
    "url" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ForwardIndex" ADD CONSTRAINT "ForwardIndex_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
