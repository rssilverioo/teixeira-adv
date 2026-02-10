import { prisma } from './prisma';

export async function getSiteSettings() {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: 'default', siteDescription: '' },
    });
  }
  return settings;
}

export async function getHeroSection() {
  return prisma.heroSection.findUnique({ where: { id: 'default' } });
}

export async function getStats() {
  return prisma.stat.findMany({ orderBy: { order: 'asc' } });
}

export async function getServices(activeOnly = true) {
  return prisma.service.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { order: 'asc' },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({ where: { slug } });
}

export async function getTeamMembers(activeOnly = true) {
  return prisma.teamMember.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { order: 'asc' },
  });
}

export async function getTeamMemberBySlug(slug: string) {
  return prisma.teamMember.findUnique({ where: { slug } });
}

export async function getMediaPosts(activeOnly = true) {
  return prisma.mediaPost.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { date: 'desc' },
  });
}

export async function getMediaPostBySlug(slug: string) {
  return prisma.mediaPost.findUnique({ where: { slug } });
}

export async function getPodcasts(activeOnly = true) {
  return prisma.podcast.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { episode: 'desc' },
  });
}

export async function getInnovationProducts(activeOnly = true) {
  return prisma.innovationProduct.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: { order: 'asc' },
  });
}

export async function getValues() {
  return prisma.value.findMany({ orderBy: { order: 'asc' } });
}

export async function getDifferentiators() {
  return prisma.differentiator.findMany({ orderBy: { order: 'asc' } });
}

export async function getAboutPage() {
  return prisma.aboutPage.findUnique({ where: { id: 'default' } });
}

export async function getCTASection() {
  return prisma.cTASection.findUnique({ where: { id: 'default' } });
}

export async function getNavItems() {
  return prisma.navItem.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });
}

export async function getLegalPage(id: string) {
  return prisma.legalPage.findUnique({ where: { id } });
}

export async function getImages(category?: string) {
  return prisma.image.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}
