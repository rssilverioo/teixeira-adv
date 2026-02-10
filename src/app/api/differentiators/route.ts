import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const differentiators = await prisma.differentiator.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(differentiators);
  } catch (error) {
    console.error('Error fetching differentiators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch differentiators' },
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

    const differentiator = await prisma.differentiator.create({
      data: {
        title: body.title,
        description: body.description,
        order: body.order ?? 0,
      },
    });

    return NextResponse.json(differentiator, { status: 201 });
  } catch (error) {
    console.error('Error creating differentiator:', error);
    return NextResponse.json(
      { error: 'Failed to create differentiator' },
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

    const differentiator = await prisma.differentiator.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        order: body.order,
      },
    });

    return NextResponse.json(differentiator);
  } catch (error) {
    console.error('Error updating differentiator:', error);
    return NextResponse.json(
      { error: 'Failed to update differentiator' },
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

    await prisma.differentiator.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting differentiator:', error);
    return NextResponse.json(
      { error: 'Failed to delete differentiator' },
      { status: 500 }
    );
  }
}
