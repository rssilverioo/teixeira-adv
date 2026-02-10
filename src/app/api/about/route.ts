import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const about = await prisma.aboutPage.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about page' },
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

    const about = await prisma.aboutPage.update({
      where: { id: 'default' },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        historyTitle: body.historyTitle,
        historyContent: body.historyContent,
        historyImageUrl: body.historyImageUrl,
      },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about page:', error);
    return NextResponse.json(
      { error: 'Failed to update about page' },
      { status: 500 }
    );
  }
}
