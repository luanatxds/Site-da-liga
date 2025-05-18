/*
  Warnings:

  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `admission` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedin` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "admission" DATETIME NOT NULL,
    "linkedin" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);
INSERT INTO "new_Member" ("id", "imageUrl", "name", "role") SELECT "id", "imageUrl", "name", "role" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "year" INTEGER NOT NULL
);
INSERT INTO "new_Project" ("description", "id", "imageUrl") SELECT "description", "id", "imageUrl" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
