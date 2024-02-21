-- CreateTable
CREATE TABLE "Livre" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "auteur" TEXT NOT NULL,
    "contenuUrl" TEXT NOT NULL,

    CONSTRAINT "Livre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForwardIndex" (
    "id" SERIAL NOT NULL,
    "livreId" INTEGER NOT NULL,
    "mot" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "ForwardIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvertedIndex" (
    "mot" TEXT NOT NULL,
    "occurrences" JSONB NOT NULL,

    CONSTRAINT "InvertedIndex_pkey" PRIMARY KEY ("mot")
);

-- CreateIndex
CREATE INDEX "idx_livre" ON "ForwardIndex"("livreId");

-- AddForeignKey
ALTER TABLE "ForwardIndex" ADD CONSTRAINT "ForwardIndex_livreId_fkey" FOREIGN KEY ("livreId") REFERENCES "Livre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
