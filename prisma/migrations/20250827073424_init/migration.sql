-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "ru_title" TEXT,
    "description" TEXT,
    "year" INTEGER,
    "released" TEXT,
    "poster" TEXT,
    "backdrop" TEXT,
    "kinopoisk_id" INTEGER,
    "imdb_id" TEXT,
    "rating" REAL,
    "raw" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_kinopoisk_id_key" ON "Content"("kinopoisk_id");

-- CreateIndex
CREATE UNIQUE INDEX "Content_imdb_id_key" ON "Content"("imdb_id");
