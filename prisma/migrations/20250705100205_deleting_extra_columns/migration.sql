/*
  Warnings:

  - You are about to drop the column `authLevel` on the `WorkflowConfig` table. All the data in the column will be lost.
  - You are about to drop the column `schemaValidatorId` on the `WorkflowConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `WorkflowConfig` DROP COLUMN `authLevel`,
    DROP COLUMN `schemaValidatorId`;
