import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
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

    const settings = await prisma.siteSettings.update({
      where: { id: 'default' },
      data: {
        siteName: body.siteName,
        siteTitle: body.siteTitle,
        siteDescription: body.siteDescription,
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        colorPrimary: body.colorPrimary,
        colorPrimaryLight: body.colorPrimaryLight,
        colorAccent: body.colorAccent,
        colorAccentLight: body.colorAccentLight,
        colorAccentDark: body.colorAccentDark,
        keywords: body.keywords,
        ogImageUrl: body.ogImageUrl,
        address: body.address,
        phone: body.phone,
        email: body.email,
        whatsapp: body.whatsapp,
        workingHours: body.workingHours,
        facebookUrl: body.facebookUrl,
        instagramUrl: body.instagramUrl,
        linkedinUrl: body.linkedinUrl,
        youtubeUrl: body.youtubeUrl,
        copyrightText: body.copyrightText,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
