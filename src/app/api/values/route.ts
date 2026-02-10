import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const values = await prisma.value.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(values);
  } catch (error) {
    console.error('Error fetching values:', error);
    return NextResponse.json(
      { error: 'Failed to fetch values' },
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

    const value = await prisma.value.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        order: body.order ?? 0,
      },
    });

    return NextResponse.json(value, { status: 201 });
  } catch (error) {
    console.error('Error creating value:', error);
    return NextResponse.json(
      { error: 'Failed to create value' },
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

    const value = await prisma.value.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        order: body.order,
      },
    });

    return NextResponse.json(value);
  } catch (error) {
    console.error('Error updating value:', error);
    return NextResponse.json(
      { error: 'Failed to update value' },
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

    await prisma.value.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting value:', error);
    return NextResponse.json(
      { error: 'Failed to delete value' },
      { status: 500 }
    );
  }
}
