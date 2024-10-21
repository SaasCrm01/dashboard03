/*
  Warnings:

  - You are about to drop the `ClientTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientTag" DROP CONSTRAINT "ClientTag_clientId_fkey";

-- DropForeignKey
ALTER TABLE "ClientTag" DROP CONSTRAINT "ClientTag_tagId_fkey";

-- DropTable
DROP TABLE "ClientTag";

-- CreateTable
CREATE TABLE "_ClientTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientTags_AB_unique" ON "_ClientTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientTags_B_index" ON "_ClientTags"("B");

-- AddForeignKey
ALTER TABLE "_ClientTags" ADD CONSTRAINT "_ClientTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientTags" ADD CONSTRAINT "_ClientTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
