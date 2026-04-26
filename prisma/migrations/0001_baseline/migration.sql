-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `rollNumber` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allowed_emails` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `addedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NULL,

    UNIQUE INDEX `allowed_emails_email_key`(`email`),
    INDEX `allowed_emails_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_verification_otps` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otpHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `email_verification_otps_email_key`(`email`),
    INDEX `email_verification_otps_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `maxGroupSize` INTEGER NOT NULL DEFAULT 4,
    `completionPercentage` DOUBLE NOT NULL DEFAULT 0,
    `teacherId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('INHOUSE', 'OUTHOUSE', 'INDUSTRY_SPONSORED') NULL,
    `category` ENUM('APPLICATION', 'MULTIDISCIPLINARY', 'RESEARCH', 'CORE') NULL,
    `application` ENUM('SOCIETY_USE', 'GOVERNMENT_USE', 'INSTITUTE_USE', 'INDUSTRY_USE') NULL,
    `outcome` ENUM('PUBLICATION', 'PATENT', 'PRODUCT', 'COPYRIGHT') NULL,
    `poMapping` VARCHAR(191) NULL,
    `psoMapping` VARCHAR(191) NULL,
    `sdg` ENUM('GOAL_1_NO_POVERTY', 'GOAL_2_ZERO_HUNGER', 'GOAL_3_GOOD_HEALTH', 'GOAL_4_QUALITY_EDUCATION', 'GOAL_5_GENDER_EQUALITY', 'GOAL_6_CLEAN_WATER', 'GOAL_7_CLEAN_ENERGY', 'GOAL_8_DECENT_WORK', 'GOAL_9_INDUSTRY_INNOVATION', 'GOAL_10_REDUCED_INEQUALITIES', 'GOAL_11_SUSTAINABLE_CITIES', 'GOAL_12_RESPONSIBLE_CONSUMPTION', 'GOAL_13_CLIMATE_ACTION', 'GOAL_14_LIFE_BELOW_WATER', 'GOAL_15_LIFE_ON_LAND', 'GOAL_16_PEACE_AND_JUSTICE', 'GOAL_17_PARTNERSHIPS') NULL,
    `groupNo` VARCHAR(191) NULL,
    `isRblProject` BOOLEAN NOT NULL DEFAULT false,

    INDEX `projects_teacherId_idx`(`teacherId`),
    INDEX `projects_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pending_project_assignments` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `memberRole` ENUM('LEAD', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `invitedById` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pending_project_assignments_email_idx`(`email`),
    INDEX `pending_project_assignments_status_idx`(`status`),
    UNIQUE INDEX `pending_project_assignments_projectId_email_key`(`projectId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_queue` (
    `id` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` LONGTEXT NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `errorLog` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `email_queue_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `email_queue_to_idx`(`to`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_members` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `role` ENUM('LEAD', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_members_studentId_idx`(`studentId`),
    UNIQUE INDEX `project_members_projectId_studentId_key`(`projectId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `assignedToId` VARCHAR(191) NULL,
    `status` ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'BLOCKED') NOT NULL DEFAULT 'TODO',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    `dueDate` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `parentTaskId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tasks_projectId_idx`(`projectId`),
    INDEX `tasks_assignedToId_idx`(`assignedToId`),
    INDEX `tasks_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `milestones` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `dueDate` DATETIME(3) NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `weight` INTEGER NOT NULL DEFAULT 10,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `milestones_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `reviewerId` VARCHAR(191) NOT NULL,
    `reviewType` VARCHAR(191) NOT NULL,
    `scheduledAt` DATETIME(3) NOT NULL,
    `conductedAt` DATETIME(3) NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'MISSED', 'RESCHEDULED') NOT NULL DEFAULT 'SCHEDULED',
    `overallScore` DOUBLE NULL,
    `feedback` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `reviews_projectId_idx`(`projectId`),
    INDEX `reviews_reviewerId_idx`(`reviewerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_criteria` (
    `id` VARCHAR(191) NOT NULL,
    `reviewId` VARCHAR(191) NOT NULL,
    `criteriaName` VARCHAR(191) NOT NULL,
    `score` DOUBLE NOT NULL,
    `remarks` TEXT NULL,

    INDEX `review_criteria_reviewId_idx`(`reviewId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_files` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NULL,
    `uploadedBy` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `s3Key` VARCHAR(191) NOT NULL,
    `s3Url` TEXT NOT NULL,
    `category` ENUM('REPORT', 'PRESENTATION', 'CODE', 'DATASET', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_files_projectId_idx`(`projectId`),
    INDEX `project_files_taskId_idx`(`taskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` VARCHAR(191) NOT NULL,
    `taskId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `comments_taskId_idx`(`taskId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` ENUM('TASK_ASSIGNED', 'DEADLINE_APPROACHING', 'REVIEW_SCHEDULED', 'FEEDBACK_GIVEN', 'PROJECT_UPDATED', 'MILESTONE_DUE', 'PROJECT_SUBMITTED', 'FEEDBACK_ADDED', 'CHANGES_REQUESTED', 'PROJECT_APPROVED', 'PROJECT_PUBLISHED') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `link` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_userId_idx`(`userId`),
    INDEX `notifications_isRead_idx`(`isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tags_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_tags` (
    `projectId` VARCHAR(191) NOT NULL,
    `tagId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`projectId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showcase_projects` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `shortDescription` VARCHAR(500) NOT NULL DEFAULT '',
    `fullDescription` TEXT NOT NULL,
    `problemStatement` TEXT NULL,
    `objectives` TEXT NULL,
    `methodology` TEXT NULL,
    `architectureDescription` TEXT NULL,
    `databaseUsed` VARCHAR(191) NULL,
    `githubUrl` VARCHAR(500) NULL,
    `liveDemoUrl` VARCHAR(500) NULL,
    `documentationUrl` VARCHAR(500) NULL,
    `projectDomain` ENUM('AI', 'WEB', 'IOT', 'DATA_SCIENCE', 'MOBILE', 'CLOUD', 'CYBERSECURITY', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `mentorName` VARCHAR(191) NULL,
    `mentorEmail` VARCHAR(191) NULL,
    `keyFeatures` JSON NOT NULL,
    `techStack` JSON NOT NULL,
    `apiIntegrations` JSON NOT NULL,
    `categories` JSON NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'CHANGES_REQUESTED', 'RESUBMITTED', 'APPROVED', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
    `currentVersion` INTEGER NOT NULL DEFAULT 1,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `showcase_projects_ownerId_idx`(`ownerId`),
    INDEX `showcase_projects_status_idx`(`status`),
    INDEX `showcase_projects_isPublic_idx`(`isPublic`),
    INDEX `showcase_projects_projectDomain_idx`(`projectDomain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_versions` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `version` INTEGER NOT NULL,
    `snapshot` JSON NOT NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `project_versions_projectId_idx`(`projectId`),
    UNIQUE INDEX `project_versions_projectId_version_key`(`projectId`, `version`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_feedback` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `versionId` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `isResolved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `review_feedback_projectId_idx`(`projectId`),
    INDEX `review_feedback_versionId_idx`(`versionId`),
    INDEX `review_feedback_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_assets` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `versionId` VARCHAR(191) NULL,
    `kind` ENUM('DOCUMENTATION', 'SCREENSHOT', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `fileName` VARCHAR(191) NULL,
    `fileUrl` TEXT NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,

    INDEX `project_assets_projectId_idx`(`projectId`),
    INDEX `project_assets_versionId_idx`(`versionId`),
    INDEX `project_assets_kind_idx`(`kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `showcase_team_members` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `orderIndex` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `showcase_team_members_projectId_idx`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pending_project_assignments` ADD CONSTRAINT `pending_project_assignments_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pending_project_assignments` ADD CONSTRAINT `pending_project_assignments_invitedById_fkey` FOREIGN KEY (`invitedById`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_parentTaskId_fkey` FOREIGN KEY (`parentTaskId`) REFERENCES `tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `milestones` ADD CONSTRAINT `milestones_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_criteria` ADD CONSTRAINT `review_criteria_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `reviews`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_files` ADD CONSTRAINT `project_files_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_files` ADD CONSTRAINT `project_files_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_files` ADD CONSTRAINT `project_files_uploadedBy_fkey` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_tags` ADD CONSTRAINT `project_tags_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_tags` ADD CONSTRAINT `project_tags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showcase_projects` ADD CONSTRAINT `showcase_projects_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_versions` ADD CONSTRAINT `project_versions_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `showcase_projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_feedback` ADD CONSTRAINT `review_feedback_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `showcase_projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_feedback` ADD CONSTRAINT `review_feedback_versionId_fkey` FOREIGN KEY (`versionId`) REFERENCES `project_versions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_feedback` ADD CONSTRAINT `review_feedback_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_assets` ADD CONSTRAINT `project_assets_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `showcase_projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_assets` ADD CONSTRAINT `project_assets_versionId_fkey` FOREIGN KEY (`versionId`) REFERENCES `project_versions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `showcase_team_members` ADD CONSTRAINT `showcase_team_members_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `showcase_projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

