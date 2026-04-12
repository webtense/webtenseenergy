-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('ES', 'CA');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'CONTACTED', 'WON', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "StudyStatus" AS ENUM ('NEW', 'REVIEWING', 'QUOTED', 'WON', 'LOST');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ONCE');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "locale" "Locale",
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "scheduledFor" TIMESTAMP(3),
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTranslation" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostCategory" (
    "postId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "PostCategory_pkey" PRIMARY KEY ("postId","categoryId")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "oldPrice" TEXT,
    "category" TEXT NOT NULL,
    "discount" TEXT,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'contacto',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "originPath" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "contactedAt" TIMESTAMP(3),
    "wonAt" TIMESTAMP(3),
    "lostAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyRequest" (
    "id" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "fileName" TEXT,
    "fileMimeType" TEXT,
    "fileSizeBytes" INTEGER,
    "kwConsumed" TEXT,
    "habits" TEXT NOT NULL DEFAULT '[]',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "source" TEXT NOT NULL DEFAULT 'estudio',
    "status" "StudyStatus" NOT NULL DEFAULT 'NEW',
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "originPath" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "quotedAt" TIMESTAMP(3),
    "wonAt" TIMESTAMP(3),
    "lostAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "providerMessageId" TEXT,
    "error" TEXT,
    "payload" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'web',
    "consentedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "legalText" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" "Locale" NOT NULL DEFAULT 'ES',
    "subject" TEXT NOT NULL,
    "preheader" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduleType" "ScheduleType",
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignBlock" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SendJob" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SendJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SendEvent" (
    "id" TEXT NOT NULL,
    "sendJobId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SendEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramConfig" (
    "id" TEXT NOT NULL,
    "botName" TEXT,
    "channelId" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "webhookSecret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelegramConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramDeal" (
    "id" TEXT NOT NULL,
    "offerId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelegramDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "adminUserId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "status" TEXT NOT NULL,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyPriceSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "hour" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rawPayload" TEXT,

    CONSTRAINT "EnergyPriceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyDailySummary" (
    "id" TEXT NOT NULL,
    "summaryDate" TIMESTAMP(3) NOT NULL,
    "minPrice" DOUBLE PRECISION NOT NULL,
    "minHour" INTEGER NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "maxHour" INTEGER NOT NULL,
    "avgPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION,
    "entriesCount" INTEGER NOT NULL DEFAULT 24,
    "source" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnergyDailySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_status_publishedAt_idx" ON "Post"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Post_locale_idx" ON "Post"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "PostTranslation_postId_locale_key" ON "PostTranslation"("postId", "locale");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "StudyRequest_status_createdAt_idx" ON "StudyRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "StudyRequest_email_idx" ON "StudyRequest"("email");

-- CreateIndex
CREATE INDEX "EmailLog_entityType_entityId_idx" ON "EmailLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "EmailLog_status_createdAt_idx" ON "EmailLog"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE INDEX "SendJob_status_runAt_idx" ON "SendJob"("status", "runAt");

-- CreateIndex
CREATE INDEX "SendEvent_eventType_createdAt_idx" ON "SendEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "LeadNote_leadId_createdAt_idx" ON "LeadNote"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_createdAt_idx" ON "AuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");

-- CreateIndex
CREATE INDEX "EnergyPriceSnapshot_snapshotDate_idx" ON "EnergyPriceSnapshot"("snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyPriceSnapshot_snapshotDate_hour_key" ON "EnergyPriceSnapshot"("snapshotDate", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyDailySummary_summaryDate_key" ON "EnergyDailySummary"("summaryDate");

-- CreateIndex
CREATE INDEX "EnergyDailySummary_summaryDate_idx" ON "EnergyDailySummary"("summaryDate");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTranslation" ADD CONSTRAINT "PostTranslation_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategory" ADD CONSTRAINT "PostCategory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategory" ADD CONSTRAINT "PostCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBlock" ADD CONSTRAINT "CampaignBlock_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendJob" ADD CONSTRAINT "SendJob_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendEvent" ADD CONSTRAINT "SendEvent_sendJobId_fkey" FOREIGN KEY ("sendJobId") REFERENCES "SendJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendEvent" ADD CONSTRAINT "SendEvent_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "Subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramLog" ADD CONSTRAINT "TelegramLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
