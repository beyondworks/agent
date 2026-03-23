'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUpload } from '@/hooks/use-upload';

interface ReferenceUploaderProps {
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  uploadedUrl?: string | null;
}

export function ReferenceUploader({
  onUploadComplete,
  onRemove,
  uploadedUrl,
}: ReferenceUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, progress, isUploading, error, reset } = useUpload({
    bucket: 'media',
    pathPrefix: 'style-references',
  });

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      try {
        const url = await upload(file);
        onUploadComplete(url);
      } catch {
        // error state is handled by useUpload
      }
    },
    [upload, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    reset();
    if (inputRef.current) inputRef.current.value = '';
    onRemove?.();
  }, [reset, onRemove]);

  if (uploadedUrl) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={uploadedUrl}
          alt="Reference image"
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-zinc-500 transition-colors"
        >
          <X className="w-4 h-4 text-zinc-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed aspect-video transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50',
          isUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3 w-full px-8 pointer-events-none">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800">
              <Upload className="w-5 h-5 text-zinc-400 animate-pulse" />
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">{progress}% 업로드 중...</p>
          </div>
        ) : (
          <div className="text-center pointer-events-none">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800 mx-auto mb-3">
              <ImageIcon className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-300">이미지를 드래그하거나 클릭하여 업로드</p>
            <p className="text-xs text-zinc-600 mt-1">PNG, JPG, WEBP (최대 10MB)</p>
          </div>
        )}
      </label>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
