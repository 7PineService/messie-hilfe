import type { APIRoute } from 'astro';
import { sendEmail, getRecipientEmail } from '@/lib/email';

export const prerender = false;

interface ContactFormData {
  name?: string;
  contact: string;
  message: string;
  privacy: boolean;
  timestamp: string;
  source: string;
}

function buildContactEmail(data: ContactFormData, fileNames: string[] = []): { subject: string; html: string } {
  const contactInfo = data.contact;
  const isEmail = contactInfo.includes('@');

  const html = `
    <h2>Neue Kontaktanfrage</h2>

    <h3>Kontaktdaten</h3>
    ${data.name ? `<p><strong>Name:</strong> ${data.name}</p>` : '<p><strong>Name:</strong> Anonym</p>'}
    <p><strong>Kontakt:</strong> ${contactInfo}</p>

    <h3>Nachricht</h3>
    <p>${data.message.replace(/\n/g, '<br>')}</p>

    ${fileNames.length > 0 ? `
      <h3>Anhänge (${fileNames.length})</h3>
      <ul>
        ${fileNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
      <p><em>Hinweis: Die Dateien wurden als Anhang an diese E-Mail gesendet.</em></p>
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
    let files: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      data = {
        name: formData.get('name') as string || '',
        contact: formData.get('contact') as string || '',
        message: formData.get('message') as string || '',
        privacy: formData.get('privacy') === 'true',
        timestamp: formData.get('timestamp') as string || new Date().toISOString(),
        source: formData.get('source') as string || 'contact-form',
      };

      const fileEntries = formData.getAll('files');
      files = fileEntries.filter((entry): entry is File => entry instanceof File);
    } else if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.contact || !data.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileNames = files.map(f => f.name);
    const emailContent = buildContactEmail(data, fileNames);

    const attachments = await Promise.all(
      files.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(await file.arrayBuffer()),
      }))
    );

    const { data: emailData, error } = await sendEmail({
      to: getRecipientEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: emailContent.replyTo,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Contact form email error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
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
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
