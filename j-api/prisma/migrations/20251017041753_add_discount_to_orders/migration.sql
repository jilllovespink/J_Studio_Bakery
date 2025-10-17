-- AlterTable
ALTER TABLE `order` ADD COLUMN `discountAmount` DOUBLE NULL,
    ADD COLUMN `discountType` VARCHAR(191) NULL,
    ADD COLUMN `discountValue` DOUBLE NULL,
    ADD COLUMN `finalTotal` DOUBLE NULL,
    ADD COLUMN `guestId` VARCHAR(191) NULL;
