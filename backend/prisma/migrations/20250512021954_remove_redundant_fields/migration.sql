/*
  Warnings:

  - You are about to drop the column `date` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Favorite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "date",
DROP COLUMN "explanation",
DROP COLUMN "title",
DROP COLUMN "url";
