-- Expand weekly milestone and submission text fields.
-- This migration is additive. Do not edit the original table-creation migration.

ALTER TABLE `WeeklyMilestone`
  MODIFY COLUMN `title` VARCHAR(500) NOT NULL,
  MODIFY COLUMN `description` TEXT NULL;

ALTER TABLE `MilestoneChecklistItem`
  MODIFY COLUMN `text` TEXT NOT NULL;

ALTER TABLE `WeeklyTaskSubmission`
  MODIFY COLUMN `workLog` TEXT NULL,
  MODIFY COLUMN `feedback` TEXT NULL;

ALTER TABLE `WeeklyEvidenceLink`
  MODIFY COLUMN `title` VARCHAR(255) NOT NULL,
  MODIFY COLUMN `url` VARCHAR(500) NOT NULL;

ALTER TABLE `WeeklySyncMeeting`
  MODIFY COLUMN `locationUrl` VARCHAR(500) NOT NULL,
  MODIFY COLUMN `notes` TEXT NULL;
