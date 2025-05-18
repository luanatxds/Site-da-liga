-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Newsletter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Newsletter" ("email", "id") SELECT "email", "id" FROM "Newsletter";
DROP TABLE "Newsletter";
ALTER TABLE "new_Newsletter" RENAME TO "Newsletter";
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
