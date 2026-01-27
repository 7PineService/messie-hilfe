import { Resend } from 'resend';
import { getSecret } from 'astro:env/server';

const RESEND_API_KEY = getSecret('RESEND_API_KEY') as string;
const RESEND_FROM_EMAIL = getSecret('RESEND_FROM_EMAIL') as string;
const CONTACT_RECIPIENT_EMAIL = getSecret('CONTACT_RECIPIENT_EMAIL') as string;

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
  try {
    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export function getRecipientEmail(): string {
  return CONTACT_RECIPIENT_EMAIL;
}
