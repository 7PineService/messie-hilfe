import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

interface ContactFormData {
  name?: string;
  contact: string;
  message: string;
  privacy: boolean;
  timestamp: string;
  source: string;
  hasFiles?: boolean;
  fileCount?: number;
}

interface LeadFormData {
  email: string;
  phone: string;
  salutation: string;
  first_name: string;
  last_name: string;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
  'services[]'?: string | string[];
  object_type?: string;
  elevator?: string;
  furnishing?: string;
  condition?: string;
  clutter_level?: string;
  timing?: string;
  preferred_date?: string;
  has_different_address?: boolean;
  job_street?: string;
  job_street_number?: string;
  job_postal_code?: string;
  job_city?: string;
  has_different_contact?: boolean;
  alt_salutation?: string;
  alt_first_name?: string;
  alt_last_name?: string;
  alt_email?: string;
  alt_phone?: string;
  timestamp?: string;
  source?: string;
}

function isLeadForm(body: unknown): body is LeadFormData {
  return typeof body === 'object' && body !== null && 'first_name' in body && 'last_name' in body;
}

function buildLeadFormEmail(body: LeadFormData): { subject: string; html: string; replyTo: string } {
  const services = body['services[]'];
  const servicesList = Array.isArray(services) ? services.join(', ') : services || 'Keine angegeben';

  const html = `
    <h2>Neue Anfrage von ${body.salutation} ${body.first_name} ${body.last_name}</h2>

    <h3>Kontaktdaten</h3>
    <p><strong>E-Mail:</strong> ${body.email}</p>
    <p><strong>Telefon:</strong> ${body.phone}</p>

    <h3>Adresse</h3>
    <p>${body.street} ${body.street_number}<br>${body.postal_code} ${body.city}</p>

    ${body.has_different_address ? `
      <h3>Einsatzadresse (abweichend)</h3>
      <p>${body.job_street} ${body.job_street_number}<br>${body.job_postal_code} ${body.job_city}</p>
    ` : ''}

    ${body.has_different_contact ? `
      <h3>Alternativer Ansprechpartner</h3>
      <p><strong>Name:</strong> ${body.alt_salutation} ${body.alt_first_name} ${body.alt_last_name}</p>
      <p><strong>E-Mail:</strong> ${body.alt_email}</p>
      <p><strong>Telefon:</strong> ${body.alt_phone}</p>
    ` : ''}

    <h3>Angefragte Leistungen</h3>
    <p>${servicesList}</p>

    <h3>Objektdetails</h3>
    <p><strong>Objektart:</strong> ${body.object_type || 'Nicht angegeben'}</p>
    <p><strong>Aufzug:</strong> ${body.elevator || 'Nicht angegeben'}</p>
    <p><strong>Möblierung:</strong> ${body.furnishing || 'Nicht angegeben'}</p>
    <p><strong>Zustand:</strong> ${body.condition || 'Nicht angegeben'}</p>
    <p><strong>Vermüllungsgrad:</strong> ${body.clutter_level || 'Nicht angegeben'}</p>

    <h3>Zeitrahmen</h3>
    <p><strong>Gewünschter Zeitraum:</strong> ${body.timing || 'Nicht angegeben'}</p>
    ${body.preferred_date ? `<p><strong>Wunschtermin:</strong> ${body.preferred_date}</p>` : ''}

    <hr>
    <p><small>Anfrage eingegangen am: ${body.timestamp ? new Date(body.timestamp).toLocaleString('de-DE') : new Date().toLocaleString('de-DE')}</small></p>
  `;

  return {
    subject: `Neue Anfrage: ${servicesList} - ${body.first_name} ${body.last_name}`,
    html,
    replyTo: body.email,
  };
}

function buildContactFormEmail(body: ContactFormData, fileNames: string[] = []): { subject: string; html: string; replyTo?: string } {
  const contactInfo = body.contact;
  const isEmail = contactInfo.includes('@');

  const html = `
    <h2>Neue Kontaktanfrage</h2>

    <h3>Kontaktdaten</h3>
    ${body.name ? `<p><strong>Name:</strong> ${body.name}</p>` : '<p><strong>Name:</strong> Anonym</p>'}
    <p><strong>Kontakt:</strong> ${contactInfo}</p>

    <h3>Nachricht</h3>
    <p>${body.message.replace(/\n/g, '<br>')}</p>

    ${fileNames.length > 0 ? `
      <h3>Anhänge (${fileNames.length})</h3>
      <ul>
        ${fileNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
      <p><em>Hinweis: Die Dateien wurden als Anhang an diese E-Mail gesendet.</em></p>
    ` : ''}

    <hr>
    <p><small>Quelle: ${body.source || 'Webseite'}</small></p>
    <p><small>Anfrage eingegangen am: ${body.timestamp ? new Date(body.timestamp).toLocaleString('de-DE') : new Date().toLocaleString('de-DE')}</small></p>
  `;

  return {
    subject: `Kontaktanfrage${body.name ? ` von ${body.name}` : ' (Anonym)'}`,
    html,
    replyTo: isEmail ? contactInfo : undefined,
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';

    let body: ContactFormData | LeadFormData;
    let files: File[] = [];

    // Handle FormData (contact form with files)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      body = {
        name: formData.get('name') as string || '',
        contact: formData.get('contact') as string || '',
        message: formData.get('message') as string || '',
        privacy: formData.get('privacy') === 'true',
        timestamp: formData.get('timestamp') as string || new Date().toISOString(),
        source: formData.get('source') as string || 'contact-form',
      };

      // Get all files
      const fileEntries = formData.getAll('files');
      files = fileEntries.filter((entry): entry is File => entry instanceof File);
    }
    // Handle JSON
    else if (contentType.includes('application/json')) {
      body = await request.json();
    }
    // Invalid content type
    else {
      return new Response(
        JSON.stringify({ error: 'Invalid content type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build email based on form type
    let emailConfig: { subject: string; html: string; replyTo?: string };
    let attachments: { filename: string; content: Buffer }[] = [];

    if (isLeadForm(body)) {
      emailConfig = buildLeadFormEmail(body);
    } else {
      const fileNames = files.map(f => f.name);
      emailConfig = buildContactFormEmail(body as ContactFormData, fileNames);

      // Convert files to attachments
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        attachments.push({
          filename: file.name,
          content: Buffer.from(arrayBuffer),
        });
      }
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL || 'Messie-Hilfe <onboarding@resend.dev>',
      to: import.meta.env.CONTACT_RECIPIENT_EMAIL || 'haihuynhngoc24@gmail.com',
      replyTo: emailConfig.replyTo,
      subject: emailConfig.subject,
      html: emailConfig.html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
