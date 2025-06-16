-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "staffId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyEmail" TEXT,
    "companyPhone" TEXT,
    "language" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "dateFormat" TEXT NOT NULL,
    "lowStockThreshold" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AppSettings_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staff_members" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_staffId_key" ON "AppSettings"("staffId");
