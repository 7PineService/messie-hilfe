import { Resend } from 'resend';
import { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_RECIPIENT_EMAIL } from 'astro:env/server';

console.log('🔧 [Email Service] astro:env/server - API_KEY exists:', !!RESEND_API_KEY, 'length:', RESEND_API_KEY?.length, 'prefix:', RESEND_API_KEY?.substring(0, 7));
console.log('🔧 [Email Service] process.env.RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY, 'length:', process.env.RESEND_API_KEY?.length);
console.log('🔧 [Email Service] import.meta.env.RESEND_API_KEY exists:', !!(import.meta as any).env?.RESEND_API_KEY, 'value:', (import.meta as any).env?.RESEND_API_KEY);

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
  console.log('📨 [Email Service] Sending - To:', options.to, 'From:', RESEND_FROM_EMAIL, 'Subject:', options.subject, 'Attachments:', options.attachments?.length || 0);

  try {
    const result = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments,
    });

    console.log('✉️ [Email Service] Result:', JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('❌ [Email Service] Error:', error);
    throw error;
  }
}

export function getRecipientEmail(): string {
  return CONTACT_RECIPIENT_EMAIL;
}
