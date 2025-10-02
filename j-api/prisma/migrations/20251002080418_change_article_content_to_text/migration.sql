-- AlterTable
ALTER TABLE `article` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `paymentMethod` ENUM('ECPAY_CREDIT', 'TAPPAY_CREDIT', 'CASH') NOT NULL;
