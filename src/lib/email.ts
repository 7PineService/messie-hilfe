import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_RECIPIENT_EMAIL } from 'astro:env/server';

export const resend = new Resend(RESEND_API_KEY);

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
    from: RESEND_FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });
}

export function getRecipientEmail(): string {
  return CONTACT_RECIPIENT_EMAIL;
}
