/*
  Warnings:

  - The values [BLACKCAT] on the enum `order_shippingMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `shippingMethod` ENUM('home', 'pickup') NOT NULL;
