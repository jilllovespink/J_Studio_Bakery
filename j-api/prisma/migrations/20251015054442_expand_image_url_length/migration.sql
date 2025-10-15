/*
  Warnings:

  - You are about to drop the `addon_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `article` MODIFY `coverImageUrl` TEXT NULL;

-- AlterTable
ALTER TABLE `banners` MODIFY `image` TEXT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `isAddon` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isVisible` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `heroImage` TEXT NULL;

-- DropTable
DROP TABLE `addon_product`;
