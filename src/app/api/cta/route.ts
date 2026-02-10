import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cta = await prisma.cTASection.findUnique({
      where: { id: 'default' },
    });

    return NextResponse.json(cta);
  } catch (error) {
    console.error('Error fetching CTA section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CTA section' },
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

    const cta = await prisma.cTASection.update({
      where: { id: 'default' },
      data: {
        title: body.title,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
      },
    });

    return NextResponse.json(cta);
  } catch (error) {
    console.error('Error updating CTA section:', error);
    return NextResponse.json(
      { error: 'Failed to update CTA section' },
      { status: 500 }
    );
  }
}
