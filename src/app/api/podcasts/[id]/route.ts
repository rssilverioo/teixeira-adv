import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const podcast = await prisma.podcast.findUnique({
      where: { id },
    });

    if (!podcast) {
      return NextResponse.json(
        { error: 'Podcast not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return NextResponse.json(
      { error: 'Failed to fetch podcast' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const podcast = await prisma.podcast.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        episode: body.episode,
        guests: body.guests,
        duration: body.duration,
        date: body.date ? new Date(body.date) : undefined,
        youtubeUrl: body.youtubeUrl,
        thumbnailUrl: body.thumbnailUrl,
        tags: body.tags,
        active: body.active,
      },
    });

    return NextResponse.json(podcast);
  } catch (error) {
    console.error('Error updating podcast:', error);
    return NextResponse.json(
      { error: 'Failed to update podcast' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.podcast.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return NextResponse.json(
      { error: 'Failed to delete podcast' },
      { status: 500 }
    );
  }
}
