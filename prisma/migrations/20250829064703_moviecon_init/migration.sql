-- CreateTable
CREATE TABLE "content" (
    "id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "ru_title" TEXT,
    "orig_title" TEXT,
    "description" TEXT,
    "year" INTEGER,
    "released" TEXT,
    "poster" TEXT,
    "backdrop" TEXT,
    "kinopoisk_id" INTEGER,
    "imdb_id" TEXT,
    "rating" DOUBLE PRECISION,
    "iframe_src" TEXT,
    "raw" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);
