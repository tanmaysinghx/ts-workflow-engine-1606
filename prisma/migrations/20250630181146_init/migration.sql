-- CreateTable
CREATE TABLE `WorkflowConfig` (
    `id` VARCHAR(191) NOT NULL,
    `workflowCode` VARCHAR(191) NOT NULL,
    `workflowName` VARCHAR(191) NOT NULL,
    `microserviceName` VARCHAR(191) NOT NULL,
    `microserviceBaseUrl` VARCHAR(191) NOT NULL,
    `downstreamEndpoint` VARCHAR(191) NOT NULL,
    `env` VARCHAR(191) NOT NULL,
    `apiVersion` VARCHAR(191) NOT NULL,
    `redirectUrl` VARCHAR(191) NULL,
    `tokenCheck` BOOLEAN NOT NULL DEFAULT false,
    `otpFlow` BOOLEAN NOT NULL DEFAULT false,
    `notification` BOOLEAN NOT NULL DEFAULT false,
    `notificationScenarioId` VARCHAR(191) NULL,
    `retryCount` INTEGER NOT NULL DEFAULT 0,
    `rollbackUrl` VARCHAR(191) NULL,
    `authLevel` VARCHAR(191) NOT NULL DEFAULT 'NONE',
    `logResponseBody` BOOLEAN NOT NULL DEFAULT false,
    `cacheResponse` BOOLEAN NOT NULL DEFAULT false,
    `featureToggleKey` VARCHAR(191) NULL,
    `workflowGroup` VARCHAR(191) NULL,
    `schemaValidatorId` VARCHAR(191) NULL,
    `stepSequence` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WorkflowConfig_workflowCode_key`(`workflowCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkflowTransaction` (
    `transactionId` VARCHAR(191) NOT NULL,
    `workflowConfigId` VARCHAR(191) NOT NULL,
    `workflowCode` VARCHAR(191) NOT NULL,
    `env` VARCHAR(191) NOT NULL,
    `apiVersion` VARCHAR(191) NOT NULL,
    `origin` VARCHAR(191) NULL,
    `redirectUrl` VARCHAR(191) NULL,
    `traceHeaders` JSON NULL,
    `requestPayload` JSON NOT NULL,
    `responsePayload` JSON NULL,
    `success` BOOLEAN NOT NULL,
    `successDescription` VARCHAR(191) NULL,
    `errorDescription` VARCHAR(191) NULL,
    `stepsFollowed` JSON NOT NULL,
    `timestampStart` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timestampEnd` DATETIME(3) NULL,

    INDEX `WorkflowTransaction_workflowCode_idx`(`workflowCode`),
    INDEX `WorkflowTransaction_env_idx`(`env`),
    PRIMARY KEY (`transactionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkflowTransaction` ADD CONSTRAINT `WorkflowTransaction_workflowConfigId_fkey` FOREIGN KEY (`workflowConfigId`) REFERENCES `WorkflowConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
