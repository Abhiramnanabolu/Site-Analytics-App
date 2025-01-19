/*
  Warnings:

  - You are about to drop the column `url` on the `Website` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain]` on the table `Website` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `Website` table without a default value. This is not possible if the table is not empty.
  - The required column `scriptToken` was added to the `Website` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Website_url_key";

-- AlterTable
ALTER TABLE "Website" DROP COLUMN "url",
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "scriptToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Website_domain_key" ON "Website"("domain");
