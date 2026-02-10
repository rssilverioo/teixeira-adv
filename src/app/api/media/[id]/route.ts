import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  const where = excludeId
    ? { slug, id: { not: excludeId } }
    : { slug };
  const exists = await prisma.mediaPost.findFirst({ where });
  if (!exists) return slug;
  const hash = Date.now().toString(36).slice(-5);
  return `${slug}-${hash}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.mediaPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Media post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching media post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media post' },
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

    const slug = await uniqueSlug(body.title, id);

    const post = await prisma.mediaPost.update({
      where: { id },
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        date: body.date ? new Date(body.date) : undefined,
        category: body.category,
        tags: body.tags,
        imageUrl: body.imageUrl,
        readTime: body.readTime,
        active: body.active,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating media post:', error);
    return NextResponse.json(
      { error: 'Failed to update media post' },
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

    await prisma.mediaPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media post:', error);
    return NextResponse.json(
      { error: 'Failed to delete media post' },
      { status: 500 }
    );
  }
}
