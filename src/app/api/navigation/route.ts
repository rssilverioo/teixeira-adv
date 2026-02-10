import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const navItems = await prisma.navItem.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(navItems);
  } catch (error) {
    console.error('Error fetching nav items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nav items' },
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

    const navItem = await prisma.navItem.create({
      data: {
        label: body.label,
        href: body.href,
        order: body.order ?? 0,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(navItem, { status: 201 });
  } catch (error) {
    console.error('Error creating nav item:', error);
    return NextResponse.json(
      { error: 'Failed to create nav item' },
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

    const navItem = await prisma.navItem.update({
      where: { id: body.id },
      data: {
        label: body.label,
        href: body.href,
        order: body.order,
        active: body.active,
      },
    });

    return NextResponse.json(navItem);
  } catch (error) {
    console.error('Error updating nav item:', error);
    return NextResponse.json(
      { error: 'Failed to update nav item' },
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

    await prisma.navItem.delete({
      where: { id: body.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting nav item:', error);
    return NextResponse.json(
      { error: 'Failed to delete nav item' },
      { status: 500 }
    );
  }
}
