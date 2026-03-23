import { createClient } from '@/lib/supabase/client';

export type UploadBucket = 'media' | 'exports' | 'references';

export async function uploadFile(
  bucket: UploadBucket,
  path: string,
  file: File | Blob,
  options?: { contentType?: string; upsert?: boolean }
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false,
    });

  if (error) throw error;
  return data;
}

export function getPublicUrl(bucket: UploadBucket, path: string) {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function getSignedUrl(
  bucket: UploadBucket,
  path: string,
  expiresIn = 86400
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFile(bucket: UploadBucket, paths: string[]) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) throw error;
}
