/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `previewImage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "fileUrl",
DROP COLUMN "previewImage",
DROP COLUMN "sellerId",
DROP COLUMN "status",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "User";
