/*
  Warnings:

  - You are about to drop the `allowed_emails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email_verification_otps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `allowed_emails`;

-- DropTable
DROP TABLE `email_verification_otps`;

-- DropTable
DROP TABLE `password_reset_tokens`;

-- CreateTable
CREATE TABLE `publications` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `authors` VARCHAR(191) NOT NULL,
    `publicationType` ENUM('PAPER', 'PATENT', 'BOOK_CHAPTER', 'COPYRIGHT', 'REVIEW') NOT NULL,
    `subType` VARCHAR(191) NULL,
    `publicationDate` DATETIME(3) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `uniqueIdentifier` VARCHAR(191) NULL,
    `indexingType` ENUM('SCOPUS', 'SCI', 'WEB_OF_SCIENCE', 'UGC_CARE', 'NONE') NOT NULL DEFAULT 'NONE',
    `isFunded` BOOLEAN NOT NULL DEFAULT false,
    `grantTitle` VARCHAR(191) NULL,
    `fundingAgency` VARCHAR(191) NULL,
    `grantAmount` DOUBLE NULL,
    `grantNumber` VARCHAR(191) NULL,
    `detailsJson` JSON NULL,
    `enteredById` VARCHAR(191) NOT NULL,
    `approvedById` VARCHAR(191) NULL,
    `approvedAt` DATETIME(3) NULL,
    `score` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `publications_uniqueIdentifier_key`(`uniqueIdentifier`),
    INDEX `publications_projectId_idx`(`projectId`),
    INDEX `publications_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publication_score_configs` (
    `id` VARCHAR(191) NOT NULL,
    `publicationType` ENUM('PAPER', 'PATENT', 'BOOK_CHAPTER', 'COPYRIGHT', 'REVIEW') NOT NULL,
    `subType` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,

    UNIQUE INDEX `publication_score_configs_publicationType_subType_key`(`publicationType`, `subType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `publications` ADD CONSTRAINT `publications_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publications` ADD CONSTRAINT `publications_enteredById_fkey` FOREIGN KEY (`enteredById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publications` ADD CONSTRAINT `publications_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
