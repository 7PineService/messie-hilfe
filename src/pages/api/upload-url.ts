import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

interface UploadUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

const MAX_FILE_SIZE = 40 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf', 'video/mp4', 'video/quicktime'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: UploadUrlRequest = await request.json();

    if (data.fileSize > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 40MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_TYPES.includes(data.fileType)) {
      return new Response(
        JSON.stringify({ error: 'File type not allowed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExt = data.fileName.split('.').pop() || 'bin';
    const uniqueFileName = `${timestamp}-${randomStr}.${fileExt}`;
    const filePath = `${uniqueFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('leads-uploads')
      .createSignedUploadUrl(filePath);

    if (uploadError) {
      console.error('Error creating signed upload URL:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to create upload URL' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: { publicUrl } } = supabase.storage
      .from('leads-uploads')
      .getPublicUrl(uploadData.path);

    return new Response(
      JSON.stringify({
        signedUrl: uploadData.signedUrl,
        path: uploadData.path,
        publicUrl: publicUrl,
        token: uploadData.token,
        fileName: data.fileName,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload URL API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
