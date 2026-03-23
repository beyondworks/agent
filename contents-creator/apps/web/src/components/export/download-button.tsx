'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  projectId: string;
}

export function DownloadButton({ projectId }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/export`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? '다운로드 링크를 가져오는 데 실패했습니다.');
        return;
      }
      const url: string = json.data?.url;
      if (!url) {
        setError('다운로드 URL이 없습니다.');
        return;
      }
      // 새 탭으로 열어 브라우저 다운로드 트리거
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            준비 중...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            다운로드
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
