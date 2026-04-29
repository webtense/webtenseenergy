-- CreateEnum
CREATE TYPE "SubscriberType" AS ENUM ('PARTICULAR', 'EMPRESA', 'INSTALADOR');

-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN "subscriberType" "SubscriberType";
