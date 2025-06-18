-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_staff_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_staff_members" ("address", "avatarUrl", "createdAt", "email", "id", "isActive", "name", "password", "phone", "role", "updatedAt") SELECT "address", "avatarUrl", "createdAt", "email", "id", "isActive", "name", "password", "phone", "role", "updatedAt" FROM "staff_members";
DROP TABLE "staff_members";
ALTER TABLE "new_staff_members" RENAME TO "staff_members";
CREATE UNIQUE INDEX "staff_members_name_key" ON "staff_members"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
