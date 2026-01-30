import type { APIRoute } from 'astro';
import { sendEmail, getRecipientEmail } from '@/lib/email';

export const prerender = false;

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  path: string;
}

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
  object_type_other?: string;
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
  fileUrls?: UploadedFile[];
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

function buildLeadEmail(data: LeadFormData, fileUrls: UploadedFile[] = []): { subject: string; html: string } {
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
    <p><strong>Objektart:</strong> ${data.object_type || 'Nicht angegeben'}${data.object_type === 'sonstiges' && data.object_type_other ? ` (${data.object_type_other})` : ''}</p>
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
    ${fileUrls.length > 0 ? `
      <p><strong>Hochgeladene Dateien (${fileUrls.length}):</strong></p>
      <ul>
        ${fileUrls.map(file => `<li><a href="${file.url}" target="_blank">${file.name}</a> (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
      </ul>
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

    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!data.email || !data.first_name || !data.last_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, first_name, last_name' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileUrls = data.fileUrls || [];
    const emailContent = buildLeadEmail(data, fileUrls);

    const { data: emailData, error } = await sendEmail({
      to: getRecipientEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
      replyTo: data.email,
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
