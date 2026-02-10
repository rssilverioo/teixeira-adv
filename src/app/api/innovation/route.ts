import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.innovationProduct.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching innovation products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch innovation products' },
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

    const product = await prisma.innovationProduct.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon,
        order: body.order ?? 0,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating innovation product:', error);
    return NextResponse.json(
      { error: 'Failed to create innovation product' },
      { status: 500 }
    );
  }
}
