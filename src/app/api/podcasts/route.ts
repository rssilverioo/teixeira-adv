import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const podcasts = await prisma.podcast.findMany({
      orderBy: { episode: 'desc' },
    });

    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcasts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const podcast = await prisma.podcast.create({
      data: {
        title: body.title,
        description: body.description,
        episode: body.episode,
        guests: body.guests ?? [],
        duration: body.duration,
        date: new Date(body.date),
        youtubeUrl: body.youtubeUrl,
        thumbnailUrl: body.thumbnailUrl,
        tags: body.tags ?? [],
        active: body.active ?? true,
      },
    });

    return NextResponse.json(podcast, { status: 201 });
  } catch (error) {
    console.error('Error creating podcast:', error);
    return NextResponse.json(
      { error: 'Failed to create podcast' },
      { status: 500 }
    );
  }
}
