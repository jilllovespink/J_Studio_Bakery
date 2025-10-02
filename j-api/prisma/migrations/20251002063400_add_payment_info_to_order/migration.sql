/*
  Warnings:

  - You are about to drop the column `ecpayTradeNo` on the `order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Order_ecpayTradeNo_key` ON `order`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `ecpayTradeNo`,
    ADD COLUMN `paymentInfo` JSON NULL;
