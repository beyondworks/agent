import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { palettes, type ColorPalette } from '../tokens/palettes';
import { fonts } from '../tokens/fonts';

/* ------------------------------------------------------------------ */
/*  Style Composer — Mix Style × Palette × Font in real-time           */
/* ------------------------------------------------------------------ */

interface StylePreset {
  name: string;
  borderRadius: string;
  buttonRadius: string;
  cardRadius: string;
  borderWidth: string;
  headingWeight: number;
  headingTransform: string;
  headingLetterSpacing: number;
  buttonWeight: number;
  buttonTransform: string;
  cardShadow: (p: ColorPalette) => string;
  buttonShadow: (p: ColorPalette) => string;
  cardBg: (p: ColorPalette) => string;
  cardBorder: (p: ColorPalette) => string;
  buttonPrimaryBg: (p: ColorPalette) => string;
  buttonPrimaryColor: (p: ColorPalette) => string;
  buttonSecondaryBg: (p: ColorPalette) => string;
  buttonSecondaryColor: (p: ColorPalette) => string;
  buttonSecondaryBorder: (p: ColorPalette) => string;
  inputBg: (p: ColorPalette) => string;
  inputBorder: (p: ColorPalette) => string;
  badgeBg: (p: ColorPalette) => string;
  badgeColor: (p: ColorPalette) => string;
  badgeBorder: (p: ColorPalette) => string;
  containerBg: (p: ColorPalette) => string;
  containerExtra?: (p: ColorPalette) => React.CSSProperties;
  extraOverlay?: (p: ColorPalette) => React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  25 Style Presets                                                    */
/* ------------------------------------------------------------------ */

const stylePresets: Record<string, StylePreset> = {
  minimalism: {
    name: 'Minimalism',
    borderRadius: '0px', buttonRadius: '0px', cardRadius: '0px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: -0.5,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: (p) => p.isDark ? `rgba(255,255,255,0.03)` : '#FAFAFA',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => p.isDark ? p.text : p.primary,
    buttonPrimaryColor: (p) => p.isDark ? p.background : '#FFFFFF',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.text}`,
    inputBg: (p) => p.background,
    inputBorder: (p) => `1px solid ${p.border}`,
    badgeBg: (p) => p.primary,
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => 'none',
    containerBg: (p) => p.background,
  },
  neumorphism: {
    name: 'Neumorphism',
    borderRadius: '20px', buttonRadius: '14px', cardRadius: '16px',
    borderWidth: '0px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: (p) => p.isDark ? '8px 8px 16px rgba(0,0,0,0.4), -8px -8px 16px rgba(255,255,255,0.05)' : '8px 8px 16px #c5c5c5, -8px -8px 16px #ffffff',
    buttonShadow: (p) => p.isDark ? '6px 6px 12px rgba(0,0,0,0.4), -6px -6px 12px rgba(255,255,255,0.05)' : '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff',
    cardBg: (p) => p.background,
    cardBorder: () => 'none',
    buttonPrimaryBg: (p) => p.background,
    buttonPrimaryColor: (p) => p.cta,
    buttonSecondaryBg: (p) => p.background,
    buttonSecondaryColor: (p) => p.secondary,
    buttonSecondaryBorder: () => 'none',
    inputBg: (p) => p.background,
    inputBorder: () => 'none',
    badgeBg: (p) => p.background,
    badgeColor: (p) => p.cta,
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#E8E8E8',
  },
  glassmorphism: {
    name: 'Glassmorphism',
    borderRadius: '20px', buttonRadius: '12px', cardRadius: '16px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => '0 8px 32px rgba(0,0,0,0.1)',
    buttonShadow: () => 'none',
    cardBg: () => 'rgba(255,255,255,0.15)',
    cardBorder: () => '1px solid rgba(255,255,255,0.2)',
    buttonPrimaryBg: () => 'rgba(255,255,255,0.25)',
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: () => '#FFFFFF',
    buttonSecondaryBorder: () => '1px solid rgba(255,255,255,0.2)',
    inputBg: () => 'rgba(255,255,255,0.15)',
    inputBorder: () => '1px solid rgba(255,255,255,0.2)',
    badgeBg: () => 'rgba(255,255,255,0.2)',
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => '1px solid rgba(255,255,255,0.25)',
    containerBg: (p) => `linear-gradient(135deg, ${p.primary} 0%, ${p.secondary} 100%)`,
    containerExtra: () => ({ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }),
  },
  brutalism: {
    name: 'BRUTALISM',
    borderRadius: '0px', buttonRadius: '0px', cardRadius: '0px',
    borderWidth: '3px', headingWeight: 900, headingTransform: 'uppercase', headingLetterSpacing: 2,
    buttonWeight: 900, buttonTransform: 'uppercase',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: (p) => p.background,
    cardBorder: (p) => `3px solid ${p.text}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.secondary,
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `3px solid ${p.text}`,
    inputBg: (p) => p.background,
    inputBorder: (p) => `3px solid ${p.text}`,
    badgeBg: (p) => p.primary,
    badgeColor: () => '#FFFFFF',
    badgeBorder: (p) => `2px solid ${p.text}`,
    containerBg: (p) => p.background,
    containerExtra: (p) => ({ border: `4px solid ${p.text}` }),
  },
  neubrutalism: {
    name: 'Neubrutalism',
    borderRadius: '12px', buttonRadius: '10px', cardRadius: '12px',
    borderWidth: '2px', headingWeight: 800, headingTransform: 'none', headingLetterSpacing: -0.3,
    buttonWeight: 700, buttonTransform: 'none',
    cardShadow: (p) => `4px 4px 0px ${p.text}`,
    buttonShadow: (p) => `3px 3px 0px ${p.text}`,
    cardBg: (p) => p.background,
    cardBorder: (p) => `2px solid ${p.text}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.isDark ? 'rgba(255,255,255,0.1)' : '#FFFFFF',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `2px solid ${p.text}`,
    inputBg: (p) => p.background,
    inputBorder: (p) => `2px solid ${p.text}`,
    badgeBg: (p) => p.cta,
    badgeColor: () => '#FFFFFF',
    badgeBorder: (p) => `2px solid ${p.text}`,
    containerBg: (p) => p.isDark ? p.background : '#FEF3C7',
  },
  flatDesign: {
    name: 'Flat Design',
    borderRadius: '6px', buttonRadius: '4px', cardRadius: '6px',
    borderWidth: '0px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F5',
    cardBorder: () => 'none',
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.isDark ? 'rgba(255,255,255,0.08)' : '#E0E0E0',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: () => 'none',
    inputBg: (p) => p.isDark ? 'rgba(255,255,255,0.06)' : '#F0F0F0',
    inputBorder: () => 'none',
    badgeBg: (p) => p.cta,
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => 'none',
    containerBg: (p) => p.background,
  },
  darkModeOLED: {
    name: 'Dark Mode (OLED)',
    borderRadius: '12px', buttonRadius: '8px', cardRadius: '12px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: -0.3,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => '0 4px 24px rgba(0,0,0,0.5)',
    buttonShadow: () => 'none',
    cardBg: () => '#111111',
    cardBorder: () => '1px solid rgba(255,255,255,0.08)',
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#000000',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: () => '#FFFFFF',
    buttonSecondaryBorder: () => '1px solid rgba(255,255,255,0.15)',
    inputBg: () => '#0A0A0A',
    inputBorder: () => '1px solid rgba(255,255,255,0.1)',
    badgeBg: (p) => p.cta,
    badgeColor: () => '#000000',
    badgeBorder: () => 'none',
    containerBg: () => '#000000',
  },
  skeuomorphism: {
    name: 'Skeuomorphism',
    borderRadius: '10px', buttonRadius: '8px', cardRadius: '10px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
    buttonShadow: () => '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)',
    cardBg: (p) => p.isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))' : 'linear-gradient(180deg, #FFFFFF, #F0F0F0)',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => `linear-gradient(180deg, ${p.cta}, ${p.primary})`,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.isDark ? 'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' : 'linear-gradient(180deg, #FAFAFA, #E0E0E0)',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.border}`,
    inputBg: (p) => p.isDark ? 'rgba(0,0,0,0.3)' : '#FFFFFF',
    inputBorder: (p) => `1px solid ${p.border}`,
    badgeBg: (p) => `linear-gradient(180deg, ${p.cta}, ${p.primary})`,
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? `linear-gradient(180deg, ${p.background}, #000000)` : 'linear-gradient(180deg, #E8E8E8, #D0D0D0)',
  },
  claymorphism: {
    name: 'Claymorphism',
    borderRadius: '24px', buttonRadius: '16px', cardRadius: '20px',
    borderWidth: '0px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: (p) => p.isDark ? '8px 8px 24px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.05)' : '8px 8px 24px rgba(0,0,0,0.08), inset 0 -4px 8px rgba(0,0,0,0.05), inset 0 4px 8px rgba(255,255,255,0.9)',
    buttonShadow: (p) => p.isDark ? '4px 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.05)' : '4px 4px 12px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.8)',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.06)' : '#F5F0FF',
    cardBorder: () => 'none',
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.isDark ? 'rgba(255,255,255,0.08)' : '#E8E0F5',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: () => 'none',
    inputBg: (p) => p.isDark ? 'rgba(255,255,255,0.04)' : '#FBF8FF',
    inputBorder: () => 'none',
    badgeBg: (p) => p.cta,
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#EDE5FF',
  },
  retroFuturism: {
    name: 'Retro-Futurism',
    borderRadius: '0px', buttonRadius: '0px', cardRadius: '0px',
    borderWidth: '2px', headingWeight: 900, headingTransform: 'uppercase', headingLetterSpacing: 4,
    buttonWeight: 700, buttonTransform: 'uppercase',
    cardShadow: (p) => `0 0 12px ${p.cta}40`,
    buttonShadow: (p) => `0 0 8px ${p.cta}60`,
    cardBg: () => 'rgba(0,0,0,0.6)',
    cardBorder: (p) => `1px solid ${p.cta}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#000000',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.cta,
    buttonSecondaryBorder: (p) => `1px solid ${p.cta}`,
    inputBg: () => 'rgba(0,0,0,0.4)',
    inputBorder: (p) => `1px solid ${p.cta}60`,
    badgeBg: (p) => `${p.cta}30`,
    badgeColor: (p) => p.cta,
    badgeBorder: (p) => `1px solid ${p.cta}`,
    containerBg: () => '#0A0A14',
  },
  y2kAesthetic: {
    name: 'Y2K Aesthetic',
    borderRadius: '20px', buttonRadius: '999px', cardRadius: '20px',
    borderWidth: '2px', headingWeight: 800, headingTransform: 'none', headingLetterSpacing: -0.5,
    buttonWeight: 700, buttonTransform: 'none',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: (p) => `linear-gradient(135deg, ${p.primary}20, ${p.secondary}20)`,
    cardBorder: (p) => `2px solid ${p.secondary}60`,
    buttonPrimaryBg: (p) => `linear-gradient(135deg, ${p.cta}, ${p.secondary})`,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => `${p.secondary}20`,
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `2px solid ${p.secondary}40`,
    inputBg: (p) => `${p.primary}10`,
    inputBorder: (p) => `2px solid ${p.secondary}40`,
    badgeBg: (p) => `linear-gradient(135deg, ${p.cta}, ${p.primary})`,
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : `linear-gradient(180deg, ${p.background}, ${p.secondary}15)`,
  },
  cyberpunkUI: {
    name: 'Cyberpunk UI',
    borderRadius: '2px', buttonRadius: '2px', cardRadius: '2px',
    borderWidth: '1px', headingWeight: 900, headingTransform: 'uppercase', headingLetterSpacing: 3,
    buttonWeight: 700, buttonTransform: 'uppercase',
    cardShadow: (p) => `0 0 20px ${p.cta}30, inset 0 0 20px ${p.cta}10`,
    buttonShadow: (p) => `0 0 12px ${p.cta}50`,
    cardBg: () => 'rgba(0,0,0,0.7)',
    cardBorder: (p) => `1px solid ${p.cta}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#000000',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.cta,
    buttonSecondaryBorder: (p) => `1px solid ${p.cta}80`,
    inputBg: () => 'rgba(0,0,0,0.5)',
    inputBorder: (p) => `1px solid ${p.cta}60`,
    badgeBg: (p) => `${p.cta}20`,
    badgeColor: (p) => p.cta,
    badgeBorder: (p) => `1px solid ${p.cta}`,
    containerBg: () => '#0A0A0F',
  },
  memphisDesign: {
    name: 'Memphis Design',
    borderRadius: '16px', buttonRadius: '999px', cardRadius: '16px',
    borderWidth: '3px', headingWeight: 900, headingTransform: 'none', headingLetterSpacing: -0.5,
    buttonWeight: 800, buttonTransform: 'none',
    cardShadow: (p) => `6px 6px 0px ${p.primary}`,
    buttonShadow: (p) => `4px 4px 0px ${p.primary}`,
    cardBg: (p) => p.background,
    cardBorder: (p) => `3px solid ${p.text}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.secondary,
    buttonSecondaryColor: () => '#FFFFFF',
    buttonSecondaryBorder: (p) => `3px solid ${p.text}`,
    inputBg: (p) => p.background,
    inputBorder: (p) => `3px solid ${p.text}`,
    badgeBg: (p) => p.secondary,
    badgeColor: () => '#FFFFFF',
    badgeBorder: (p) => `2px solid ${p.text}`,
    containerBg: (p) => p.isDark ? p.background : '#FFF8E1',
  },
  vaporwave: {
    name: 'Vaporwave',
    borderRadius: '0px', buttonRadius: '0px', cardRadius: '0px',
    borderWidth: '2px', headingWeight: 400, headingTransform: 'none', headingLetterSpacing: 6,
    buttonWeight: 400, buttonTransform: 'uppercase',
    cardShadow: () => '0 0 30px rgba(255,0,200,0.15)',
    buttonShadow: () => '0 0 16px rgba(255,0,200,0.3)',
    cardBg: () => 'rgba(20,0,40,0.6)',
    cardBorder: () => '1px solid rgba(255,0,200,0.3)',
    buttonPrimaryBg: () => 'linear-gradient(90deg, #FF00C8, #7B2FFF)',
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: () => '#FF71CE',
    buttonSecondaryBorder: () => '1px solid #FF71CE',
    inputBg: () => 'rgba(20,0,40,0.5)',
    inputBorder: () => '1px solid rgba(255,0,200,0.2)',
    badgeBg: () => 'rgba(255,0,200,0.2)',
    badgeColor: () => '#FF71CE',
    badgeBorder: () => '1px solid rgba(255,0,200,0.4)',
    containerBg: () => 'linear-gradient(180deg, #1A002E 0%, #0D001A 100%)',
  },
  bentoBoxGrid: {
    name: 'Bento Box Grid',
    borderRadius: '16px', buttonRadius: '10px', cardRadius: '16px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: -0.5,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => '0 1px 3px rgba(0,0,0,0.08)',
    buttonShadow: () => 'none',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => p.primary,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.isDark ? 'rgba(255,255,255,0.06)' : '#F5F5F5',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.border}`,
    inputBg: (p) => p.isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    inputBorder: (p) => `1px solid ${p.border}`,
    badgeBg: (p) => `${p.cta}15`,
    badgeColor: (p) => p.cta,
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#F5F5F7',
  },
  exaggeratedMinimalism: {
    name: 'Exaggerated Minimalism',
    borderRadius: '0px', buttonRadius: '0px', cardRadius: '0px',
    borderWidth: '0px', headingWeight: 300, headingTransform: 'none', headingLetterSpacing: 8,
    buttonWeight: 300, buttonTransform: 'uppercase',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: () => 'transparent',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => p.text,
    buttonPrimaryColor: (p) => p.background,
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.text}`,
    inputBg: () => 'transparent',
    inputBorder: (p) => `0 0 1px solid ${p.text}`,
    badgeBg: () => 'transparent',
    badgeColor: (p) => p.text,
    badgeBorder: (p) => `1px solid ${p.text}`,
    containerBg: (p) => p.background,
  },
  hudSciFiFUI: {
    name: 'HUD / Sci-Fi FUI',
    borderRadius: '2px', buttonRadius: '2px', cardRadius: '2px',
    borderWidth: '1px', headingWeight: 400, headingTransform: 'uppercase', headingLetterSpacing: 6,
    buttonWeight: 500, buttonTransform: 'uppercase',
    cardShadow: (p) => `0 0 16px ${p.cta}20`,
    buttonShadow: (p) => `0 0 8px ${p.cta}40`,
    cardBg: () => 'rgba(0,20,30,0.6)',
    cardBorder: (p) => `1px solid ${p.cta}60`,
    buttonPrimaryBg: (p) => `${p.cta}30`,
    buttonPrimaryColor: (p) => p.cta,
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.cta,
    buttonSecondaryBorder: (p) => `1px solid ${p.cta}40`,
    inputBg: () => 'rgba(0,20,30,0.4)',
    inputBorder: (p) => `1px solid ${p.cta}40`,
    badgeBg: (p) => `${p.cta}15`,
    badgeColor: (p) => p.cta,
    badgeBorder: (p) => `1px solid ${p.cta}60`,
    containerBg: () => '#000A0F',
  },
  pixelArt: {
    name: 'Pixel Art',
    borderRadius: '0px', buttonRadius: '0px', cardRadius: '0px',
    borderWidth: '4px', headingWeight: 400, headingTransform: 'uppercase', headingLetterSpacing: 2,
    buttonWeight: 400, buttonTransform: 'uppercase',
    cardShadow: (p) => `4px 4px 0px ${p.text}`,
    buttonShadow: (p) => `3px 3px 0px ${p.text}`,
    cardBg: (p) => p.background,
    cardBorder: (p) => `4px solid ${p.text}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.secondary,
    buttonSecondaryColor: () => '#FFFFFF',
    buttonSecondaryBorder: (p) => `4px solid ${p.text}`,
    inputBg: (p) => p.background,
    inputBorder: (p) => `4px solid ${p.text}`,
    badgeBg: (p) => p.cta,
    badgeColor: () => '#FFFFFF',
    badgeBorder: (p) => `2px solid ${p.text}`,
    containerBg: (p) => p.background,
  },
  spatialUIVisionOS: {
    name: 'Spatial UI (visionOS)',
    borderRadius: '24px', buttonRadius: '14px', cardRadius: '20px',
    borderWidth: '1px', headingWeight: 600, headingTransform: 'none', headingLetterSpacing: -0.3,
    buttonWeight: 500, buttonTransform: 'none',
    cardShadow: () => '0 8px 40px rgba(0,0,0,0.08)',
    buttonShadow: () => '0 2px 8px rgba(0,0,0,0.06)',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)',
    cardBorder: () => '1px solid rgba(255,255,255,0.2)',
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'rgba(120,120,128,0.12)',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: () => 'none',
    inputBg: () => 'rgba(120,120,128,0.08)',
    inputBorder: () => 'none',
    badgeBg: (p) => `${p.cta}18`,
    badgeColor: (p) => p.cta,
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#F2F2F7',
    containerExtra: () => ({ backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }),
  },
  genZChaos: {
    name: 'Gen-Z Chaos',
    borderRadius: '24px', buttonRadius: '999px', cardRadius: '20px',
    borderWidth: '3px', headingWeight: 900, headingTransform: 'none', headingLetterSpacing: -1,
    buttonWeight: 800, buttonTransform: 'none',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: (p) => `${p.secondary}15`,
    cardBorder: (p) => `3px solid ${p.text}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: (p) => p.secondary,
    buttonSecondaryColor: () => '#FFFFFF',
    buttonSecondaryBorder: (p) => `3px solid ${p.text}`,
    inputBg: (p) => p.background,
    inputBorder: (p) => `3px solid ${p.text}`,
    badgeBg: (p) => p.cta,
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#FFFDE7',
    containerExtra: () => ({ transform: 'rotate(-0.5deg)' }),
  },
  liquidGlass: {
    name: 'Liquid Glass',
    borderRadius: '28px', buttonRadius: '14px', cardRadius: '24px',
    borderWidth: '1px', headingWeight: 600, headingTransform: 'none', headingLetterSpacing: -0.3,
    buttonWeight: 500, buttonTransform: 'none',
    cardShadow: () => '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
    buttonShadow: () => '0 2px 8px rgba(0,0,0,0.08)',
    cardBg: () => 'rgba(255,255,255,0.12)',
    cardBorder: () => '1px solid rgba(255,255,255,0.25)',
    buttonPrimaryBg: () => 'rgba(255,255,255,0.2)',
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'rgba(255,255,255,0.08)',
    buttonSecondaryColor: () => '#FFFFFF',
    buttonSecondaryBorder: () => '1px solid rgba(255,255,255,0.15)',
    inputBg: () => 'rgba(255,255,255,0.1)',
    inputBorder: () => '1px solid rgba(255,255,255,0.2)',
    badgeBg: () => 'rgba(255,255,255,0.15)',
    badgeColor: () => '#FFFFFF',
    badgeBorder: () => '1px solid rgba(255,255,255,0.2)',
    containerBg: (p) => `linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
    containerExtra: () => ({ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }),
  },
  auroraUI: {
    name: 'Aurora UI',
    borderRadius: '20px', buttonRadius: '12px', cardRadius: '16px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: -0.3,
    buttonWeight: 600, buttonTransform: 'none',
    cardShadow: () => '0 4px 24px rgba(0,0,0,0.06)',
    buttonShadow: () => 'none',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => `linear-gradient(135deg, ${p.cta}, ${p.secondary})`,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.border}`,
    inputBg: (p) => p.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)',
    inputBorder: (p) => `1px solid ${p.border}`,
    badgeBg: (p) => `linear-gradient(135deg, ${p.cta}30, ${p.secondary}30)`,
    badgeColor: (p) => p.cta,
    badgeBorder: () => 'none',
    containerBg: (p) => p.background,
    extraOverlay: (p) => (
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, ${p.cta}15 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${p.secondary}15 0%, transparent 50%)`, pointerEvents: 'none', zIndex: 0 }} />
    ),
  },
  organicBiophilic: {
    name: 'Organic / Biophilic',
    borderRadius: '20px', buttonRadius: '999px', cardRadius: '16px',
    borderWidth: '1px', headingWeight: 600, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 500, buttonTransform: 'none',
    cardShadow: () => '0 4px 16px rgba(0,0,0,0.06)',
    buttonShadow: () => 'none',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.04)' : '#FDFBF7',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.primary,
    buttonSecondaryBorder: (p) => `1px solid ${p.primary}40`,
    inputBg: (p) => p.isDark ? 'rgba(255,255,255,0.03)' : '#FBF9F4',
    inputBorder: (p) => `1px solid ${p.border}`,
    badgeBg: (p) => `${p.cta}15`,
    badgeColor: (p) => p.cta,
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#F5F0E8',
  },
  eInkPaper: {
    name: 'E-Ink / Paper',
    borderRadius: '2px', buttonRadius: '2px', cardRadius: '2px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 0,
    buttonWeight: 500, buttonTransform: 'none',
    cardShadow: () => 'none',
    buttonShadow: () => 'none',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.03)' : '#FAFAF8',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => p.text,
    buttonPrimaryColor: (p) => p.background,
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.text}`,
    inputBg: () => 'transparent',
    inputBorder: (p) => `1px solid ${p.text}40`,
    badgeBg: () => 'transparent',
    badgeColor: (p) => p.text,
    badgeBorder: (p) => `1px solid ${p.text}`,
    containerBg: (p) => p.isDark ? p.background : '#F8F6F1',
  },
  vintageAnalog: {
    name: 'Vintage / Analog',
    borderRadius: '6px', buttonRadius: '4px', cardRadius: '6px',
    borderWidth: '1px', headingWeight: 700, headingTransform: 'none', headingLetterSpacing: 1,
    buttonWeight: 600, buttonTransform: 'uppercase',
    cardShadow: () => '0 2px 8px rgba(0,0,0,0.1)',
    buttonShadow: () => '0 1px 3px rgba(0,0,0,0.1)',
    cardBg: (p) => p.isDark ? 'rgba(255,255,255,0.05)' : '#FDF6E3',
    cardBorder: (p) => `1px solid ${p.border}`,
    buttonPrimaryBg: (p) => p.cta,
    buttonPrimaryColor: () => '#FFFFFF',
    buttonSecondaryBg: () => 'transparent',
    buttonSecondaryColor: (p) => p.text,
    buttonSecondaryBorder: (p) => `1px solid ${p.border}`,
    inputBg: (p) => p.isDark ? 'rgba(255,255,255,0.03)' : '#FFF8E7',
    inputBorder: (p) => `1px solid ${p.border}`,
    badgeBg: (p) => `${p.cta}20`,
    badgeColor: (p) => p.cta,
    badgeBorder: () => 'none',
    containerBg: (p) => p.isDark ? p.background : '#FAF3E0',
  },
};

/* ------------------------------------------------------------------ */
/*  ComposerPanel — the rendered preview                               */
/* ------------------------------------------------------------------ */

const BASE_BTN: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: 14,
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s',
};

const BASE_INPUT: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  boxSizing: 'border-box' as const,
  outline: 'none',
};

function ComposerPanel({ style, palette: paletteKey, font: fontKey }: { style: string; palette: string; font: string }) {
  const preset = stylePresets[style] ?? stylePresets.minimalism;
  const pal = palettes[paletteKey] ?? palettes.creator;
  const fnt = fonts[fontKey] ?? fonts.default;

  /* Load Google Fonts dynamically */
  useEffect(() => {
    if (!fnt.importUrl) return;
    const id = `gf-${fontKey}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = fnt.importUrl;
    document.head.appendChild(link);
  }, [fnt.importUrl, fontKey]);

  /* Determine if glassmorphism-type style needs white text override */
  const isGlassStyle = ['glassmorphism', 'liquidGlass', 'vaporwave'].includes(style);
  const isDarkStyle = ['darkModeOLED', 'retroFuturism', 'cyberpunkUI', 'hudSciFiFUI'].includes(style);
  const textColor = (isGlassStyle || isDarkStyle) ? '#FFFFFF' : pal.text;
  const secondaryText = (isGlassStyle || isDarkStyle) ? 'rgba(255,255,255,0.7)' : `${pal.text}99`;

  const containerExtra = preset.containerExtra?.(pal) ?? {};

  const cssVars = {
    '--palette': pal.name,
    '--primary': pal.primary,
    '--secondary': pal.secondary,
    '--cta': pal.cta,
    '--background': pal.background,
    '--text': pal.text,
    '--border': pal.border,
    '--font-heading': fnt.heading,
    '--font-body': fnt.body,
    '--font-mono': fnt.mono,
    '--border-radius': preset.borderRadius,
    '--card-radius': preset.cardRadius,
    '--button-radius': preset.buttonRadius,
  };

  return (
    <div style={{ width: 840, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: 24,
        padding: '16px 24px',
        background: '#1A1E26',
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: fnt.body,
      }}>
        <div>
          <span style={{ color: '#ECECEC', fontSize: 14, fontWeight: 600 }}>{preset.name}</span>
          <span style={{ color: 'rgba(236,236,236,0.4)', fontSize: 14, margin: '0 8px' }}>/</span>
          <span style={{ color: '#00BCD4', fontSize: 14 }}>{pal.name}</span>
          <span style={{ color: 'rgba(236,236,236,0.4)', fontSize: 14, margin: '0 8px' }}>/</span>
          <span style={{ color: '#F97316', fontSize: 14 }}>{fnt.name}</span>
        </div>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 999,
          background: pal.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
          color: pal.isDark ? '#ECECEC' : '#333',
        }}>
          {pal.isDark ? 'Dark' : 'Light'}
        </span>
      </div>

      {/* Preview panel */}
      <div style={{
        ...containerExtra,
        background: preset.containerBg(pal),
        borderRadius: preset.borderRadius,
        padding: 40,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: fnt.body,
      }}>
        {preset.extraOverlay?.(pal)}

        {/* Heading */}
        <h1 style={{
          fontSize: 28,
          fontWeight: preset.headingWeight,
          fontFamily: fnt.heading,
          color: textColor,
          textTransform: preset.headingTransform as React.CSSProperties['textTransform'],
          letterSpacing: preset.headingLetterSpacing,
          marginTop: 0,
          marginBottom: 8,
          position: 'relative',
          zIndex: 1,
        }}>
          {'\uC124\uACC4\uD558\uB294 \uC0AC\uB78C\uC774 \uC9C1\uC811 \uB9CC\uB4DC\uB294 \uC2DC\uB300'}
        </h1>
        <p style={{
          fontSize: 15,
          fontFamily: fnt.body,
          color: secondaryText,
          lineHeight: 1.7,
          marginTop: 0,
          marginBottom: 32,
          maxWidth: 520,
          position: 'relative',
          zIndex: 1,
        }}>
          AI {'\uC2DC\uB300\uC758 \uD575\uC2EC \uC5ED\uB7C9\uC740 \uCF54\uB529\uC774 \uC544\uB2C8\uB77C \uC124\uACC4\uC785\uB2C8\uB2E4.'}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, position: 'relative', zIndex: 1 }}>
          <button style={{
            ...BASE_BTN,
            fontFamily: fnt.body,
            fontWeight: preset.buttonWeight,
            textTransform: preset.buttonTransform as React.CSSProperties['textTransform'],
            background: preset.buttonPrimaryBg(pal),
            color: preset.buttonPrimaryColor(pal),
            borderRadius: preset.buttonRadius,
            boxShadow: preset.buttonShadow(pal),
            border: 'none',
          }}>
            {'\uC2DC\uC791\uD558\uAE30'}
          </button>
          <button style={{
            ...BASE_BTN,
            fontFamily: fnt.body,
            fontWeight: preset.buttonWeight,
            textTransform: preset.buttonTransform as React.CSSProperties['textTransform'],
            background: preset.buttonSecondaryBg(pal),
            color: preset.buttonSecondaryColor(pal),
            borderRadius: preset.buttonRadius,
            border: preset.buttonSecondaryBorder(pal),
            boxShadow: 'none',
          }}>
            {'\uB354 \uC54C\uC544\uBCF4\uAE30'}
          </button>
        </div>

        {/* Card */}
        <div style={{
          background: preset.cardBg(pal),
          borderRadius: preset.cardRadius,
          border: preset.cardBorder(pal),
          boxShadow: preset.cardShadow(pal),
          padding: 24,
          marginBottom: 32,
          position: 'relative',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{
              fontSize: 16, fontWeight: 600, fontFamily: fnt.heading,
              color: textColor, margin: 0,
            }}>
              Card Title
            </h3>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px',
              background: preset.badgeBg(pal),
              color: preset.badgeColor(pal),
              border: preset.badgeBorder(pal),
              borderRadius: preset.buttonRadius,
            }}>
              AI {'\u00D7'} {'\uAE30\uD68D'}
            </span>
          </div>
          <p style={{
            fontSize: 14, fontFamily: fnt.body,
            color: secondaryText, lineHeight: 1.6, margin: '12px 0 0',
          }}>
            AI {'\uC2DC\uB300\uC758 \uD575\uC2EC \uC5ED\uB7C9\uC740 \uCF54\uB529\uC774 \uC544\uB2C8\uB77C \uC124\uACC4\uC785\uB2C8\uB2E4.'}
          </p>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360, position: 'relative', zIndex: 1 }}>
          <label style={{
            fontSize: 12, fontWeight: 500, fontFamily: fnt.body,
            color: secondaryText,
          }}>
            {'\uD504\uB85C\uC81D\uD2B8 \uC774\uB984'}
          </label>
          <input
            style={{
              ...BASE_INPUT,
              fontFamily: fnt.body,
              background: preset.inputBg(pal),
              border: preset.inputBorder(pal),
              borderRadius: preset.buttonRadius,
              color: textColor,
            }}
            placeholder={'\uC608: Creator Agent'}
          />
        </div>
      </div>

      {/* CSS Variables code block */}
      <div style={{
        marginTop: 24,
        background: '#0F1117',
        borderRadius: 10,
        padding: '20px 24px',
        fontFamily: fnt.mono || "'JetBrains Mono', monospace",
        fontSize: 12,
        lineHeight: 1.8,
        color: '#A0AEC0',
        overflow: 'auto',
        whiteSpace: 'pre',
      }}>
        <div style={{ color: '#4A5568', marginBottom: 8 }}>{'/* Generated CSS Variables */'}</div>
        <div style={{ color: '#63B3ED' }}>{':root {'}</div>
        {Object.entries(cssVars).map(([k, v]) => (
          <div key={k}>
            {'  '}<span style={{ color: '#9F7AEA' }}>{k}</span>
            <span style={{ color: '#4A5568' }}>: </span>
            <span style={{ color: '#68D391' }}>{v}</span>
            <span style={{ color: '#4A5568' }}>;</span>
          </div>
        ))}
        <div style={{ color: '#63B3ED' }}>{'}'}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Storybook Meta + Story                                             */
/* ------------------------------------------------------------------ */

const styleNames = Object.keys(stylePresets);
const paletteNames = Object.keys(palettes);
const fontNames = Object.keys(fonts);

const meta: Meta<typeof ComposerPanel> = {
  title: 'Theme System/Style Composer',
  component: ComposerPanel,
  parameters: { layout: 'centered' },
  argTypes: {
    style: {
      control: 'select',
      options: styleNames,
      description: 'Design style (structural)',
    },
    palette: {
      control: 'select',
      options: paletteNames,
      description: 'Color palette',
    },
    font: {
      control: 'select',
      options: fontNames,
      description: 'Font pairing',
    },
  },
};
export default meta;

type Story = StoryObj<typeof ComposerPanel>;

export const Composer: Story = {
  args: {
    style: 'glassmorphism',
    palette: 'creator',
    font: 'default',
  },
};

export const NeobrutalistOceanOutfit: Story = {
  args: {
    style: 'neubrutalism',
    palette: 'ocean',
    font: 'outfit',
  },
};

export const CyberpunkNeonPressStart: Story = {
  args: {
    style: 'cyberpunkUI',
    palette: 'neon',
    font: 'pressStart',
  },
};

export const MinimalMonoSystem: Story = {
  args: {
    style: 'minimalism',
    palette: 'mono',
    font: 'system',
  },
};

export const AuroraMidnightPlayfair: Story = {
  args: {
    style: 'auroraUI',
    palette: 'midnight',
    font: 'playfair',
  },
};
