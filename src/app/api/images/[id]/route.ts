import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.TIGRIS_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.TIGRIS_ACCESS_KEY!,
    secretAccessKey: process.env.TIGRIS_SECRET_KEY!,
  },
});

const BUCKET = process.env.TIGRIS_BUCKET!;

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get the image record to find the S3 key
    const image = await prisma.image.findUnique({ where: { id } });
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Try to delete from Tigris if it's a Tigris URL
    if (image.url.includes(BUCKET)) {
      try {
        const key = image.url.split(`/${BUCKET}/`).pop();
        if (key) {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: BUCKET,
              Key: key,
            })
          );
        }
      } catch (s3Error) {
        console.error('Error deleting from Tigris:', s3Error);
      }
    }

    await prisma.image.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
