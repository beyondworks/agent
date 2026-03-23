'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UploadBucket = 'media' | 'exports' | 'references';

export interface UseUploadOptions {
  bucket: UploadBucket;
  pathPrefix?: string;
}

export interface UseUploadReturn {
  upload: (file: File) => Promise<string>;
  progress: number;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

export function useUpload({ bucket, pathPrefix = '' }: UseUploadOptions): UseUploadReturn {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setProgress(0);
    setIsUploading(false);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File): Promise<string> => {
      setIsUploading(true);
      setError(null);
      setProgress(0);

      try {
        const supabase = createClient();
        const ext = file.name.split('.').pop() ?? 'bin';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = pathPrefix ? `${pathPrefix}/${fileName}` : fileName;

        // Simulate upload progress (Supabase JS doesn't provide native progress events)
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 15, 85));
        }, 200);

        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

        clearInterval(progressInterval);

        if (uploadError) throw uploadError;

        setProgress(100);

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        throw new Error(message);
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, pathPrefix]
  );

  return { upload, progress, isUploading, error, reset };
}
