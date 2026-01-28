import type { APIRoute } from 'astro';
import { sendEmail, getRecipientEmail } from '@/lib/email';

export const prerender = false;

interface LeadFormData {
  email: string;
  phone: string;
  salutation: string;
  title?: string;
  first_name: string;
  last_name: string;
  street: string;
  street_number: string;
  postal_code: string;
  city: string;
  'services[]'?: string | string[];
  payment_method?: string;
  object_type?: string;
  etage?: string;
  elevator?: string;
  furnishing?: string;
  'access[]'?: string | string[];
  access_zugang_zeiten_text?: string;
  access_parkplatz_entfernt_text?: string;
  access_besonderheiten_text?: string;
  condition?: string;
  area?: string;
  clutter_level?: string;
  condition_notes?: string;
  additional_notes?: string;
  timing?: string;
  preferred_date?: string;
  has_different_address?: boolean | string[];
  job_street?: string;
  job_street_number?: string;
  job_postal_code?: string;
  job_city?: string;
  has_different_contact?: boolean | string[];
  alt_salutation?: string;
  alt_title?: string;
  alt_first_name?: string;
  alt_last_name?: string;
  alt_email?: string;
  alt_phone?: string;
  alt_notes?: string;
  timestamp?: string;
  source?: string;
}

function formatTitle(title?: string): string {
  if (!title) return '';
  const titles: Record<string, string> = {
    'dr': 'Dr.',
    'prof': 'Prof.',
    'prof_dr': 'Prof. Dr.',
  };
  return titles[title] || title;
}

function formatAccess(data: LeadFormData): string {
  const access = data['access[]'];
  if (!access) return '';

  const accessList = Array.isArray(access) ? access : [access];
  if (accessList.length === 0) return '';

  const accessLabels: Record<string, string> = {
    'enge_treppe': 'Enge Treppe',
    'zugang_zeiten': 'Zugang nur zu bestimmten Zeiten',
    'parkplatz_entfernt': 'Parkplatz nicht direkt am Objekt',
    'besonderheiten': 'Weitere Besonderheiten',
  };

  const items = accessList.map(item => {
    let label = accessLabels[item] || item;
    if (item === 'zugang_zeiten' && data.access_zugang_zeiten_text) {
      label += `: ${data.access_zugang_zeiten_text}`;
    }
    if (item === 'parkplatz_entfernt' && data.access_parkplatz_entfernt_text) {
      label += `: ${data.access_parkplatz_entfernt_text}m`;
    }
    if (item === 'besonderheiten' && data.access_besonderheiten_text) {
      label += `: ${data.access_besonderheiten_text}`;
    }
    return `<li>${label}</li>`;
  });

  return `<ul>${items.join('')}</ul>`;
}

function hasDifferentAddress(data: LeadFormData): boolean {
  const val = data.has_different_address;
  if (typeof val === 'boolean') return val;
  if (Array.isArray(val)) return val.includes('on');
  return false;
}

function hasDifferentContact(data: LeadFormData): boolean {
  const val = data.has_different_contact;
  if (typeof val === 'boolean') return val;
  if (Array.isArray(val)) return val.includes('on');
  return false;
}

function buildLeadEmail(data: LeadFormData, fileNames: string[] = []): { subject: string; html: string } {
  const services = data['services[]'];
  const servicesList = Array.isArray(services) ? services.join(', ') : services || 'Keine angegeben';
  const titleStr = formatTitle(data.title);
  const altTitleStr = formatTitle(data.alt_title);

  const html = `
    <h2>Neue Anfrage von ${data.salutation}${titleStr ? ' ' + titleStr : ''} ${data.first_name} ${data.last_name}</h2>

    <hr>

    <h3>Schritt 1 – Leistungen & Zahlungsart</h3>
    <p><strong>Angefragte Leistungen:</strong> ${servicesList}</p>
    ${data.payment_method ? `<p><strong>Zahlungsart:</strong> ${data.payment_method}</p>` : ''}

    <hr>

    <h3>Schritt 2 – Objekt & Zugang</h3>
    <p><strong>Objektart:</strong> ${data.object_type || 'Nicht angegeben'}</p>
    ${data.etage ? `<p><strong>Etage:</strong> ${data.etage}</p>` : ''}
    <p><strong>Aufzug vorhanden:</strong> ${data.elevator || 'Nicht angegeben'}</p>
    <p><strong>Möblierungsgrad:</strong> ${data.furnishing || 'Nicht angegeben'}</p>
    ${data['access[]'] ? `<p><strong>Zugang & Besonderheiten:</strong></p>${formatAccess(data)}` : ''}

    <hr>

    <h3>Schritt 3 – Zustand & Umfang</h3>
    <p><strong>Zustand der Räume:</strong> ${data.condition || 'Nicht angegeben'}</p>
    ${data.area ? `<p><strong>Fläche:</strong> ${data.area} m²</p>` : ''}
    ${data.clutter_level ? `<p><strong>Entrümpelungsgrad:</strong> ${data.clutter_level}</p>` : ''}
    ${data.condition_notes ? `<p><strong>Hinweise zum Zustand:</strong><br>${data.condition_notes.replace(/\n/g, '<br>')}</p>` : ''}

    <hr>

    <h3>Schritt 4 – Anmerkungen & Uploads</h3>
    ${data.additional_notes ? `<p><strong>Zusätzliche Anmerkungen:</strong><br>${data.additional_notes.replace(/\n/g, '<br>')}</p>` : '<p><em>Keine Anmerkungen</em></p>'}
    ${fileNames.length > 0 ? `
      <p><strong>Uploads (${fileNames.length}):</strong></p>
      <ul>
        ${fileNames.map(name => `<li>${name}</li>`).join('')}
      </ul>
      <p><em>Dateien als Anhang beigefügt</em></p>
    ` : '<p><em>Keine Dateien hochgeladen</em></p>'}

    <hr>

    <h3>Schritt 5 – Zeitrahmen</h3>
    <p><strong>Gewünschter Zeitraum:</strong> ${data.timing || 'Nicht angegeben'}</p>
    ${data.preferred_date ? `<p><strong>Wunschtermin:</strong> ${data.preferred_date}</p>` : ''}

    <hr>

    <h3>Schritt 6 – Kontaktdaten</h3>

    <p><strong>Kontaktperson:</strong></p>
    <p>${data.salutation}${titleStr ? ' ' + titleStr : ''} ${data.first_name} ${data.last_name}</p>
    <p><strong>E-Mail:</strong> ${data.email}</p>
    <p><strong>Telefon:</strong> ${data.phone}</p>

    <p><strong>Adresse:</strong></p>
    <p>${data.street} ${data.street_number}<br>${data.postal_code} ${data.city}</p>

    ${hasDifferentAddress(data) ? `
      <p><strong>Einsatzadresse (abweichend):</strong></p>
      <p>${data.job_street} ${data.job_street_number}<br>${data.job_postal_code} ${data.job_city}</p>
    ` : ''}

    ${hasDifferentContact(data) ? `
      <p><strong>Alternativer Ansprechpartner:</strong></p>
      <p>${data.alt_salutation}${altTitleStr ? ' ' + altTitleStr : ''} ${data.alt_first_name} ${data.alt_last_name}</p>
      <p>E-Mail: ${data.alt_email}</p>
      <p>Telefon: ${data.alt_phone}</p>
      ${data.alt_notes ? `<p>Notizen: ${data.alt_notes}</p>` : ''}
    ` : ''}

    <hr>
    <p><small>Anfrage eingegangen am: ${data.timestamp ? new Date(data.timestamp).toLocaleString('de-DE') : new Date().toLocaleString('de-DE')}</small></p>
  `;

  return {
    subject: `Neue Anfrage: ${servicesList} - ${data.first_name} ${data.last_name}`,
    html,
  };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';

    let data: LeadFormData;
    let files: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      data = {
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        salutation: formData.get('salutation') as string,
        title: formData.get('title') as string || undefined,
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        street: formData.get('street') as string,
        street_number: formData.get('street_number') as string,
        postal_code: formData.get('postal_code') as string,
        city: formData.get('city') as string,
        'services[]': formData.getAll('services[]') as string[],
        payment_method: formData.get('payment_method') as string || undefined,
        object_type: formData.get('object_type') as string || undefined,
        etage: formData.get('etage') as string || undefined,
        elevator: formData.get('elevator') as string || undefined,
        furnishing: formData.get('furnishing') as string || undefined,
        'access[]': formData.getAll('access[]') as string[],
        access_zugang_zeiten_text: formData.get('access_zugang_zeiten_text') as string || undefined,
        access_parkplatz_entfernt_text: formData.get('access_parkplatz_entfernt_text') as string || undefined,
        access_besonderheiten_text: formData.get('access_besonderheiten_text') as string || undefined,
        condition: formData.get('condition') as string || undefined,
        area: formData.get('area') as string || undefined,
        clutter_level: formData.get('clutter_level') as string || undefined,
        condition_notes: formData.get('condition_notes') as string || undefined,
        additional_notes: formData.get('additional_notes') as string || undefined,
        timing: formData.get('timing') as string || undefined,
        preferred_date: formData.get('preferred_date') as string || undefined,
        has_different_address: formData.getAll('has_different_address') as string[],
        job_street: formData.get('job_street') as string || undefined,
        job_street_number: formData.get('job_street_number') as string || undefined,
        job_postal_code: formData.get('job_postal_code') as string || undefined,
        job_city: formData.get('job_city') as string || undefined,
        has_different_contact: formData.getAll('has_different_contact') as string[],
        alt_salutation: formData.get('alt_salutation') as string || undefined,
        alt_title: formData.get('alt_title') as string || undefined,
        alt_first_name: formData.get('alt_first_name') as string || undefined,
        alt_last_name: formData.get('alt_last_name') as string || undefined,
        alt_email: formData.get('alt_email') as string || undefined,
        alt_phone: formData.get('alt_phone') as string || undefined,
        alt_notes: formData.get('alt_notes') as string || undefined,
        timestamp: formData.get('timestamp') as string || undefined,
        source: formData.get('source') as string || undefined,
      };

      const fileEntries = formData.getAll('files');
      files = fileEntries.filter((entry): entry is File => entry instanceof File);

      const MAX_FILE_SIZE = 40 * 1024 * 1024;
      const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        return new Response(
          JSON.stringify({
            error: 'File size limit exceeded',
            details: `Die folgenden Dateien überschreiten die maximale Größe von 40MB: ${oversizedFiles.map(f => f.name).join(', ')}`
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json or multipart/form-data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.email || !data.first_name || !data.last_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, first_name, last_name' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileNames = files.map(f => f.name);
    const emailContent = buildLeadEmail(data, fileNames);

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
      replyTo: data.email,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Lead form email error:', error);
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
    console.error('Lead form API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
