import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await prisma.stat.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
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

    const stat = await prisma.stat.create({
      data: {
        number: body.number,
        label: body.label,
        order: body.order ?? 0,
      },
    });

    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    console.error('Error creating stat:', error);
    return NextResponse.json(
      { error: 'Failed to create stat' },
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

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const stat = await prisma.stat.update({
      where: { id: body.id },
      data: {
        number: body.number,
        label: body.label,
        order: body.order,
      },
    });

    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error updating stat:', error);
    return NextResponse.json(
      { error: 'Failed to update stat' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.stat.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting stat:', error);
    return NextResponse.json(
      { error: 'Failed to delete stat' },
      { status: 500 }
    );
  }
}
