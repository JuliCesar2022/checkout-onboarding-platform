/*
  Warnings:

  - You are about to drop the column `productId` on the `deliveries` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_productId_fkey";

-- AlterTable
ALTER TABLE "deliveries" DROP COLUMN "productId";
