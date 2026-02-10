-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'LEX',
    "siteTitle" TEXT NOT NULL DEFAULT 'LEX - Escritorio de Advocacia Premium',
    "siteDescription" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "colorPrimary" TEXT NOT NULL DEFAULT '#0B0F1A',
    "colorPrimaryLight" TEXT NOT NULL DEFAULT '#1A1F2E',
    "colorAccent" TEXT NOT NULL DEFAULT '#C9A227',
    "colorAccentLight" TEXT NOT NULL DEFAULT '#D4B550',
    "colorAccentDark" TEXT NOT NULL DEFAULT '#A68519',
    "keywords" TEXT[],
    "ogImageUrl" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "workingHours" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "copyrightText" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroSection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL,
    "highlight" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "ctaPrimaryText" TEXT NOT NULL,
    "ctaPrimaryLink" TEXT NOT NULL,
    "ctaSecondaryText" TEXT NOT NULL,
    "ctaSecondaryLink" TEXT NOT NULL,
    "backgroundImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "expertise" TEXT[],
    "imageUrl" TEXT,
    "linkedinUrl" TEXT,
    "email" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "imageUrl" TEXT,
    "readTime" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "episode" INTEGER NOT NULL,
    "guests" TEXT[],
    "duration" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "tags" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InnovationProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InnovationProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Value" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Differentiator" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Differentiator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "historyTitle" TEXT NOT NULL,
    "historyContent" TEXT NOT NULL,
    "historyImageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CTASection" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "buttonText" TEXT NOT NULL,
    "buttonLink" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CTASection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NavItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "category" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "size" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MediaPost_slug_key" ON "MediaPost"("slug");
