import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { fs } from './theme';

/**
 * YouTube 썸네일 (1280x720)
 * 레퍼런스: 인물(우측) + Claude 로고(중앙) + 큰 텍스트(상하)
 */

export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 배경 이미지 */}
      <Img
        src={staticFile('claude-march/background.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.6,
        }}
      />

      {/* 어두운 오버레이 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(145deg, rgba(20,12,4,0.85) 0%, rgba(10,10,10,0.9) 100%)',
        }}
      />

      {/* 골드 앰비언트 글로우 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 50% 50% at 45% 50%, rgba(255,197,5,0.08) 0%, transparent 70%)
          `,
        }}
      />

      {/* ─── 상단 텍스트: "3월 업데이트" ─── */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 50,
          right: 50,
          fontFamily: fs.font,
          fontSize: 100,
          fontWeight: 900,
          color: fs.accent,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          wordBreak: 'keep-all',
          textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(255,197,5,0.2)',
          zIndex: 10,
        }}
      >
        3월 업데이트
      </div>

      {/* ─── 중앙: Claude 로고 + 텍스트 ─── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '42%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
        }}
      >
        <Img
          src={staticFile('claude-march/claude-logo.svg')}
          style={{
            width: 80,
            height: 80,
            filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(255,197,5,0.4))',
          }}
        />
        <div
          style={{
            fontFamily: fs.english,
            fontSize: 22,
            fontWeight: 700,
            color: fs.accent,
            letterSpacing: '0.02em',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          Claude Code
        </div>
      </div>

      {/* ─── 하단 텍스트: "총정리 6분 요약" ─── */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 50,
          right: 50,
          fontFamily: fs.font,
          fontSize: 100,
          fontWeight: 900,
          color: fs.text,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          wordBreak: 'keep-all',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          zIndex: 10,
        }}
      >
        총정리 6분 요약
      </div>

      {/* ─── 인물 (우측) ─── */}
      <Img
        src={staticFile('claude-march/profile.png')}
        style={{
          position: 'absolute',
          right: -20,
          bottom: 0,
          height: '90%',
          objectFit: 'contain',
          objectPosition: 'bottom right',
          zIndex: 5,
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.04,
          pointerEvents: 'none',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px',
          zIndex: 20,
        }}
      />
    </AbsoluteFill>
  );
};
