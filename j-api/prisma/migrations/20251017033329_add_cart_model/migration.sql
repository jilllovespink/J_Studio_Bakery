-- CreateTable
CREATE TABLE `Cart` (
    `guestId` VARCHAR(191) NOT NULL,
    `shippingMethod` VARCHAR(191) NULL DEFAULT 'home',
    `discountType` VARCHAR(191) NULL,
    `discountValue` DOUBLE NULL,

    PRIMARY KEY (`guestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartId` VARCHAR(191) NOT NULL,
    `productId` INTEGER NULL,
    `variantId` INTEGER NULL,
    `productName` VARCHAR(191) NOT NULL,
    `variantName` VARCHAR(191) NOT NULL,
    `productImg` VARCHAR(191) NULL,
    `price` DOUBLE NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`guestId`) ON DELETE RESTRICT ON UPDATE CASCADE;
