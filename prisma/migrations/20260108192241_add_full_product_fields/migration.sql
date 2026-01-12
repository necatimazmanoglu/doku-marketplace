/*
  Warnings:

  - You are about to drop the column `userId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "userId",
ADD COLUMN     "sellerId" TEXT NOT NULL,
ALTER COLUMN "tags" DROP NOT NULL,
ALTER COLUMN "tags" DROP DEFAULT;
