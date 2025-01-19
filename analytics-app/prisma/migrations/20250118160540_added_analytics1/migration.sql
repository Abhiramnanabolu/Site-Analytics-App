/*
  Warnings:

  - A unique constraint covering the columns `[scriptToken]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Website_scriptToken_key" ON "Website"("scriptToken");
