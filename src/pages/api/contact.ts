import type { APIRoute } from 'astro';
import { sendEmail, getRecipientEmail } from '@/lib/email';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_RECIPIENT_EMAIL } from 'astro:env/server';

export const prerender = false;

interface ContactFormData {
  name?: string;
  contact: string;
  message: string;
  privacy: boolean;
  timestamp: string;
  source: string;
}

function buildContactEmail(data: ContactFormData, fileNames: string[] = []): { subject: string; html: string; replyTo?: string } {
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
    console.log('🔍 [Contact API] astro:env - API_KEY:', !!RESEND_API_KEY, 'len:', RESEND_API_KEY?.length, 'FROM:', RESEND_FROM_EMAIL, 'TO:', CONTACT_RECIPIENT_EMAIL);
    console.log('🔍 [Contact API] process.env - API_KEY:', !!process.env.RESEND_API_KEY, 'len:', process.env.RESEND_API_KEY?.length, 'FROM:', process.env.RESEND_FROM_EMAIL);
    console.log('🔍 [Contact API] import.meta.env - API_KEY:', !!(import.meta as any).env?.RESEND_API_KEY, 'value:', (import.meta as any).env?.RESEND_API_KEY);

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

    console.log('📧 [Contact API] Sending to:', getRecipientEmail(), 'Subject:', emailContent.subject, 'Attachments:', attachments.length);

    const { data: emailData, error } = await sendEmail({
      to: getRecipientEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: emailContent.replyTo,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    console.log('📬 [Contact API] Result - Success:', !error, 'ID:', emailData?.id, error ? 'Error:' : '', error || '');

    if (error) {
      console.error('❌ [Contact API] Failed:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to send email',
          details: error.message || 'Unknown error'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ [Contact API] Success, ID:', emailData?.id);
    return new Response(
      JSON.stringify({ success: true, id: emailData?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ [Contact API] Exception:', error instanceof Error ? error.message : error, error instanceof Error ? error.stack : '');
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
