-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,
    "referer" TEXT,
    "userAgent" TEXT,
    "pageUrl" TEXT,
    "location" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
