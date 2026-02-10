import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hero = await prisma.heroSection.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero section' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const hero = await prisma.heroSection.update({
      where: { id: 'default' },
      data: {
        title: body.title,
        highlight: body.highlight,
        subtitle: body.subtitle,
        ctaPrimaryText: body.ctaPrimaryText,
        ctaPrimaryLink: body.ctaPrimaryLink,
        ctaSecondaryText: body.ctaSecondaryText,
        ctaSecondaryLink: body.ctaSecondaryLink,
        backgroundImageUrl: body.backgroundImageUrl,
        backgroundVideoUrl: body.backgroundVideoUrl,
        slideshowImages: body.slideshowImages ?? [],
      },
    });

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json(
      { error: 'Failed to update hero section' },
      { status: 500 }
    );
  }
}
