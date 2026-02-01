import type { APIRoute } from 'astro';
import { sendEmail, getRecipientEmail } from '@/lib/resend';

export const prerender = false;

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  path: string;
}

interface ContactFormData {
  name?: string;
  contact: string;
  message: string;
  privacy: boolean;
  timestamp: string;
  source: string;
  fileUrls?: UploadedFile[];
}

function buildContactEmail(data: ContactFormData, fileUrls: UploadedFile[] = []): { subject: string; html: string; replyTo?: string } {
  const contactInfo = data.contact;
  const isEmail = contactInfo.includes('@');

  const html = `
    <h2>Neue Kontaktanfrage</h2>

    <h3>Kontaktdaten</h3>
    ${data.name ? `<p><strong>Name:</strong> ${data.name}</p>` : '<p><strong>Name:</strong> Anonym</p>'}
    <p><strong>Kontakt:</strong> ${contactInfo}</p>

    <h3>Nachricht</h3>
    <p>${data.message.replace(/\n/g, '<br>')}</p>

    ${fileUrls.length > 0 ? `
      <h3>Hochgeladene Dateien (${fileUrls.length})</h3>
      <ul>
        ${fileUrls.map(file => `<li><a href="${file.url}" target="_blank">${file.name}</a> (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
      </ul>
    ` : ''}

    <hr>
    <p><small>Quelle: ${data.source || 'Webseite'}</small></p>
    <p><small>Anfrage eingegangen am: ${data.timestamp ? new Date(data.timestamp).toLocaleString('de-DE') : new Date().toLocaleString('de-DE')}</small></p>
  `;

  return {
    subject: `Kontaktanfrage${data.name ? ` von ${data.name}` : ' (Anonym)'}`,
    html,
    replyTo: isEmail ? contactInfo : undefined,
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';

    let data: ContactFormData;

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.contact || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileUrls = data.fileUrls || [];
    const emailContent = buildContactEmail(data, fileUrls);

    const { data: emailData, error } = await sendEmail({
      to: getRecipientEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: emailContent.replyTo,
    });

    if (error) {
      console.error('Contact form email error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          details: error.message || 'Unknown error'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: emailData?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
