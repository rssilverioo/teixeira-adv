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

    const product = await prisma.innovationProduct.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Innovation product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching innovation product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch innovation product' },
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

    const product = await prisma.innovationProduct.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        order: body.order,
        active: body.active,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating innovation product:', error);
    return NextResponse.json(
      { error: 'Failed to update innovation product' },
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

    await prisma.innovationProduct.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting innovation product:', error);
    return NextResponse.json(
      { error: 'Failed to delete innovation product' },
      { status: 500 }
    );
  }
}
