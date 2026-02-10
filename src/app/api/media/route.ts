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

export async function GET() {
  try {
    const posts = await prisma.mediaPost.findMany({
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching media posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media posts' },
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

    const slug = await uniqueSlug(body.title);

    const post = await prisma.mediaPost.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        date: new Date(body.date),
        category: body.category,
        tags: body.tags ?? [],
        imageUrl: body.imageUrl,
        readTime: body.readTime,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating media post:', error);
    return NextResponse.json(
      { error: 'Failed to create media post' },
      { status: 500 }
    );
  }
}
