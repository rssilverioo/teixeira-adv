import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

// GET - list all contact submissions (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST - submit contact form (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, company, subject, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Nome, email, assunto e mensagem sao obrigatorios' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalido' },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // Send email notification (non-blocking)
    if (process.env.RESEND_API_KEY) {
      try {
        const settings = await prisma.siteSettings.findUnique({
          where: { id: 'default' },
          select: { email: true, siteName: true },
        });

        const toEmail = settings?.email;
        const siteName = settings?.siteName || 'LEX';

        if (toEmail) {
          const resend = new Resend(process.env.RESEND_API_KEY);

          await resend.emails.send({
            from: `${siteName} <onboarding@resend.dev>`,
            to: [toEmail],
            subject: `Nova mensagem de contato: ${subject}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1a1f2e; border-bottom: 2px solid #C9A227; padding-bottom: 10px;">
                  Nova Mensagem de Contato
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; width: 120px;">Nome:</td>
                    <td style="padding: 8px 0; color: #1a1f2e;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 8px 0; color: #1a1f2e;">
                      <a href="mailto:${email}" style="color: #C9A227;">${email}</a>
                    </td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Telefone:</td>
                    <td style="padding: 8px 0; color: #1a1f2e;">${phone}</td>
                  </tr>
                  ` : ''}
                  ${company ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Empresa:</td>
                    <td style="padding: 8px 0; color: #1a1f2e;">${company}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Assunto:</td>
                    <td style="padding: 8px 0; color: #1a1f2e;">${subject}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
                  <p style="font-weight: bold; color: #555; margin: 0 0 8px;">Mensagem:</p>
                  <p style="color: #1a1f2e; white-space: pre-wrap; margin: 0;">${message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                  Enviado pelo formulario de contato do site ${siteName}
                </p>
              </div>
            `,
          });
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      { success: true, id: submission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact submission:', error);
    return NextResponse.json(
      { error: 'Falha ao enviar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}
