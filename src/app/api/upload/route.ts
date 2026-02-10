import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.TIGRIS_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.TIGRIS_ACCESS_KEY!,
    secretAccessKey: process.env.TIGRIS_SECRET_KEY!,
  },
});

const BUCKET = process.env.TIGRIS_BUCKET!;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Permitidos: JPG, PNG, GIF, WebP, SVG, MP4, WebM' },
        { status: 400 }
      );
    }

    // Validate file size
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${isVideo ? '100MB' : '10MB'}` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const safeName = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const key = `${isVideo ? 'videos' : 'images'}/${timestamp}-${randomSuffix}-${safeName}.${ext}`;

    // Upload to Tigris
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Build the public URL (virtual-hosted style)
    const endpoint = process.env.TIGRIS_ENDPOINT!.replace('https://', '');
    const url = `https://${BUCKET}.${endpoint}/${key}`;

    // Get optional metadata from form data
    const alt = (formData.get('alt') as string) || file.name;
    const category = (formData.get('category') as string) || (isVideo ? 'video' : null);

    // Create Image record in database
    const image = await prisma.image.create({
      data: {
        name: file.name,
        url,
        alt,
        category,
        size: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json(
      {
        success: true,
        url,
        image,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Falha ao fazer upload. Verifique as credenciais do Tigris.' },
      { status: 500 }
    );
  }
}
