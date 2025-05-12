/*
  Warnings:

  - Added the required column `date` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `explanation` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Favorite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Favorite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "explanation" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
