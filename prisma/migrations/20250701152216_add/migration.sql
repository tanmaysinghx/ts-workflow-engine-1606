-- AlterTable
ALTER TABLE `WorkflowConfig` ADD COLUMN `notificationServiceUrl` VARCHAR(191) NULL,
    ADD COLUMN `otpMicroServiceUrl` VARCHAR(191) NULL;
