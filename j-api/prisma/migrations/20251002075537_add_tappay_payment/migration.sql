/*
  Warnings:

  - You are about to alter the column `paymentMethod` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `paymentMethod` ENUM('TAPPAY_CREDIT', 'CASH') NOT NULL;
