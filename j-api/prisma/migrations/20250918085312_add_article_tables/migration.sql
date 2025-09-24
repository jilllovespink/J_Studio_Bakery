/*
  Warnings:

  - You are about to drop the column `coverImage` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `article` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Made the column `excerpt` on table `article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publishedAt` on table `article` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Article_status_publishedAt_idx` ON `article`;

-- AlterTable
ALTER TABLE `article` DROP COLUMN `coverImage`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `status`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `coverImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `subCategoryId` INTEGER NOT NULL,
    MODIFY `excerpt` VARCHAR(191) NOT NULL,
    MODIFY `content` VARCHAR(191) NOT NULL,
    MODIFY `publishedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product` MODIFY `heroImage` VARCHAR(10000) NULL;

-- CreateTable
CREATE TABLE `ArticleCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `orderIndex` INTEGER NOT NULL,

    UNIQUE INDEX `ArticleCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArticleSubCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `orderIndex` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    UNIQUE INDEX `ArticleSubCategory_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArticleSubCategory` ADD CONSTRAINT `ArticleSubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ArticleCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ArticleCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `ArticleSubCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
