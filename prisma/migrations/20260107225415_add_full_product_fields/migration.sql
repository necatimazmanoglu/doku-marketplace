/*
  Warnings:

  - Added the required column `fileName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pdfUrl` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pdfUrl" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
