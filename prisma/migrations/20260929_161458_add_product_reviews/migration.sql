-- CreateTable ProductReview
CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "asin" VARCHAR(50) NOT NULL,
    "categoryId" VARCHAR(100),
    "imageUrl" VARCHAR(500),
    "affiliateUrl" VARCHAR(1000) NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" DOUBLE PRECISION,
    "priceUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable PostProductReview
CREATE TABLE "PostProductReview" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "productReviewId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_asin_key" ON "ProductReview"("asin");

-- CreateIndex
CREATE INDEX "ProductReview_categoryId_idx" ON "ProductReview"("categoryId");

-- CreateIndex
CREATE INDEX "ProductReview_createdAt_idx" ON "ProductReview"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PostProductReview_postId_productReviewId_key" ON "PostProductReview"("postId", "productReviewId");

-- CreateIndex
CREATE INDEX "PostProductReview_postId_idx" ON "PostProductReview"("postId");

-- AddForeignKey
ALTER TABLE "PostProductReview" ADD CONSTRAINT "PostProductReview_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostProductReview" ADD CONSTRAINT "PostProductReview_productReviewId_fkey" FOREIGN KEY ("productReviewId") REFERENCES "ProductReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
