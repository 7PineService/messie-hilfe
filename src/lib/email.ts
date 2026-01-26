import { Resend } from 'resend';

export const resend = new Resend(import.meta.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  return await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL || 'Messie-Hilfe <onboarding@resend.dev>',
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });
}

export function getRecipientEmail(): string {
  return import.meta.env.CONTACT_RECIPIENT_EMAIL || 'haihuynhngoc24@gmail.com';
}
