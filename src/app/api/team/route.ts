import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
  const exists = await prisma.teamMember.findFirst({ where });
  if (!exists) return slug;
  const hash = Date.now().toString(36).slice(-5);
  return `${slug}-${hash}`;
}

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
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

    const slug = await uniqueSlug(body.name);

    const member = await prisma.teamMember.create({
      data: {
        slug,
        name: body.name,
        role: body.role,
        bio: body.bio,
        expertise: body.expertise ?? [],
        imageUrl: body.imageUrl,
        linkedinUrl: body.linkedinUrl,
        email: body.email,
        order: body.order ?? 0,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
