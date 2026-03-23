import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

/* ------------------------------------------------------------------ */
/*  Style Showcase — 25 major design styles rendered as real UI        */
/* ------------------------------------------------------------------ */

interface ShowcaseProps {
  styleName: string;
  container: React.CSSProperties;
  heading: React.CSSProperties;
  primaryBtn: React.CSSProperties;
  secondaryBtn: React.CSSProperties;
  card: React.CSSProperties;
  cardTitle: React.CSSProperties;
  cardText: React.CSSProperties;
  badge: React.CSSProperties;
  badgeAlt?: React.CSSProperties;
  badgeAlt2?: React.CSSProperties;
  inputWrapper: React.CSSProperties;
  label: React.CSSProperties;
  input: React.CSSProperties;
  fontImport?: string;
  extraBg?: React.ReactNode;
}

const Showcase = (p: ShowcaseProps) => (
  <>
    {p.fontImport && <style>{p.fontImport}</style>}
    <div style={{ ...p.container, width: 800, margin: '0 auto', padding: 40, boxSizing: 'border-box' as const, position: 'relative' as const, overflow: 'hidden' }}>
      {p.extraBg}
      <h1 style={{ ...p.heading, position: 'relative' as const, zIndex: 1 }}>{p.styleName}</h1>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, position: 'relative' as const, zIndex: 1 }}>
        <button style={p.primaryBtn}>Primary Button</button>
        <button style={p.secondaryBtn}>Secondary</button>
      </div>

      {/* Card */}
      <div style={{ ...p.card, marginBottom: 32, position: 'relative' as const, zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={p.cardTitle}>Card Title</h3>
          <span style={p.badge}>Badge</span>
        </div>
        <p style={p.cardText}>This is a sample card component rendered in the {p.styleName} style. It demonstrates how cards look with real content and layout.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {p.badgeAlt && <span style={p.badgeAlt}>Status</span>}
          {p.badgeAlt2 && <span style={p.badgeAlt2}>Tag</span>}
        </div>
      </div>

      {/* Input */}
      <div style={{ ...p.inputWrapper, position: 'relative' as const, zIndex: 1 }}>
        <label style={p.label}>Email Address</label>
        <input style={p.input} placeholder="you@example.com" />
      </div>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/*  Meta                                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: 'Theme System/Style Showcase',
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const BASE_BTN: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: 14,
  fontWeight: 600,
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

const INTER = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`;
const SPACE_MONO = `@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`;
const PLAYFAIR = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');`;
const PRESS_START = `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`;
const LORA = `@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap');`;
const LIBRE = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap');`;

/* ================================================================== */
/*  1. Minimalism                                                      */
/* ================================================================== */
export const Minimalism: Story = {
  render: () => (
    <Showcase
      styleName="Minimalism"
      fontImport={INTER}
      container={{ background: '#FFFFFF', fontFamily: "'Inter', sans-serif", borderRadius: 0 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#000000', marginBottom: 32, letterSpacing: -0.5 }}
      primaryBtn={{ ...BASE_BTN, background: '#000000', color: '#FFFFFF', borderRadius: 0 }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#000000', borderRadius: 0, border: '1px solid #000000' }}
      card={{ background: '#FAFAFA', border: '1px solid #E5E5E5', borderRadius: 0, padding: 24 }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#000000', margin: 0 }}
      cardText={{ fontSize: 14, color: '#666666', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', background: '#000000', color: '#FFFFFF', borderRadius: 0, letterSpacing: 0.5, textTransform: 'uppercase' }}
      badgeAlt={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', background: '#F0F0F0', color: '#333333', borderRadius: 0 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', border: '1px solid #CCCCCC', color: '#666666', borderRadius: 0, background: 'transparent' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 500, color: '#333333', textTransform: 'uppercase', letterSpacing: 0.5 }}
      input={{ ...BASE_INPUT, border: '1px solid #CCCCCC', borderRadius: 0, fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  2. Neumorphism                                                     */
/* ================================================================== */
export const Neumorphism: Story = {
  render: () => {
    const bg = '#E8E8E8';
    return (
      <Showcase
        styleName="Neumorphism"
        fontImport={INTER}
        container={{ background: bg, fontFamily: "'Inter', sans-serif", borderRadius: 20 }}
        heading={{ fontSize: 26, fontWeight: 700, color: '#555555', marginBottom: 32 }}
        primaryBtn={{ ...BASE_BTN, background: bg, color: '#5B7FFF', borderRadius: 14, boxShadow: '6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff', border: 'none' }}
        secondaryBtn={{ ...BASE_BTN, background: bg, color: '#888888', borderRadius: 14, boxShadow: 'inset 4px 4px 8px #c5c5c5, inset -4px -4px 8px #ffffff', border: 'none' }}
        card={{ background: bg, borderRadius: 16, padding: 24, boxShadow: '8px 8px 16px #c5c5c5, -8px -8px 16px #ffffff', border: 'none' }}
        cardTitle={{ fontSize: 16, fontWeight: 600, color: '#444444', margin: 0 }}
        cardText={{ fontSize: 14, color: '#777777', lineHeight: 1.6, margin: '12px 0' }}
        badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: bg, color: '#5B7FFF', borderRadius: 20, boxShadow: '3px 3px 6px #c5c5c5, -3px -3px 6px #ffffff' }}
        badgeAlt={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: bg, color: '#FF7EB3', borderRadius: 20, boxShadow: 'inset 2px 2px 4px #c5c5c5, inset -2px -2px 4px #ffffff' }}
        badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: bg, color: '#888', borderRadius: 20, boxShadow: '2px 2px 4px #c5c5c5, -2px -2px 4px #ffffff' }}
        inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
        label={{ fontSize: 12, fontWeight: 600, color: '#666666' }}
        input={{ ...BASE_INPUT, background: bg, border: 'none', borderRadius: 14, boxShadow: 'inset 4px 4px 8px #c5c5c5, inset -4px -4px 8px #ffffff', color: '#555', fontFamily: "'Inter', sans-serif" }}
      />
    );
  },
};

/* ================================================================== */
/*  3. Glassmorphism                                                   */
/* ================================================================== */
export const Glassmorphism: Story = {
  render: () => (
    <Showcase
      styleName="Glassmorphism"
      fontImport={INTER}
      container={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 20, minHeight: 500 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 32 }}
      primaryBtn={{ ...BASE_BTN, background: 'rgba(255,255,255,0.25)', color: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }}
      card={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: 0 }}
      cardText={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', borderRadius: 20, border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
      badgeAlt={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'transparent', color: '#FFFFFF', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#FFFFFF', backdropFilter: 'blur(8px)', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  4. Brutalism                                                       */
/* ================================================================== */
export const Brutalism: Story = {
  render: () => (
    <Showcase
      styleName="BRUTALISM"
      container={{ background: '#FFFFFF', fontFamily: 'Courier, monospace', borderRadius: 0, border: '4px solid #000000' }}
      heading={{ fontSize: 32, fontWeight: 900, color: '#000000', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}
      primaryBtn={{ ...BASE_BTN, background: '#FF0000', color: '#FFFFFF', borderRadius: 0, border: '3px solid #000000', fontFamily: 'Courier, monospace', textTransform: 'uppercase', fontWeight: 900 }}
      secondaryBtn={{ ...BASE_BTN, background: '#FFFF00', color: '#000000', borderRadius: 0, border: '3px solid #000000', fontFamily: 'Courier, monospace', textTransform: 'uppercase', fontWeight: 900 }}
      card={{ background: '#FFFFFF', borderRadius: 0, padding: 24, border: '3px solid #000000' }}
      cardTitle={{ fontSize: 18, fontWeight: 900, color: '#000000', margin: 0, textTransform: 'uppercase', fontFamily: 'Courier, monospace' }}
      cardText={{ fontSize: 14, color: '#000000', lineHeight: 1.5, margin: '12px 0', fontFamily: 'Courier, monospace' }}
      badge={{ fontSize: 11, fontWeight: 900, padding: '4px 10px', background: '#0000FF', color: '#FFFFFF', borderRadius: 0, border: '2px solid #000000', textTransform: 'uppercase', fontFamily: 'Courier, monospace' }}
      badgeAlt={{ fontSize: 11, fontWeight: 900, padding: '4px 10px', background: '#FFFF00', color: '#000000', borderRadius: 0, border: '2px solid #000000', textTransform: 'uppercase', fontFamily: 'Courier, monospace' }}
      badgeAlt2={{ fontSize: 11, fontWeight: 900, padding: '4px 10px', background: '#FF0000', color: '#FFFFFF', borderRadius: 0, border: '2px solid #000000', textTransform: 'uppercase', fontFamily: 'Courier, monospace' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 13, fontWeight: 900, color: '#000000', textTransform: 'uppercase', fontFamily: 'Courier, monospace' }}
      input={{ ...BASE_INPUT, border: '3px solid #000000', borderRadius: 0, fontFamily: 'Courier, monospace', background: '#FFFFFF' }}
    />
  ),
};

/* ================================================================== */
/*  5. Neubrutalism                                                    */
/* ================================================================== */
export const Neubrutalism: Story = {
  render: () => (
    <Showcase
      styleName="Neubrutalism"
      fontImport={INTER}
      container={{ background: '#FFF5E1', fontFamily: "'Inter', sans-serif", borderRadius: 12 }}
      heading={{ fontSize: 28, fontWeight: 800, color: '#000000', marginBottom: 32 }}
      primaryBtn={{ ...BASE_BTN, background: '#FFEB3B', color: '#000000', borderRadius: 8, border: '3px solid #000000', boxShadow: '4px 4px 0px #000000', fontWeight: 800 }}
      secondaryBtn={{ ...BASE_BTN, background: '#FFFFFF', color: '#000000', borderRadius: 8, border: '3px solid #000000', boxShadow: '4px 4px 0px #000000', fontWeight: 700 }}
      card={{ background: '#FFFFFF', borderRadius: 12, padding: 24, border: '3px solid #000000', boxShadow: '6px 6px 0px #000000' }}
      cardTitle={{ fontSize: 16, fontWeight: 800, color: '#000000', margin: 0 }}
      cardText={{ fontSize: 14, color: '#333333', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: '#FF5252', color: '#FFFFFF', borderRadius: 6, border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}
      badgeAlt={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: '#2196F3', color: '#FFFFFF', borderRadius: 6, border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}
      badgeAlt2={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: '#FFEB3B', color: '#000000', borderRadius: 6, border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 13, fontWeight: 700, color: '#000000' }}
      input={{ ...BASE_INPUT, border: '3px solid #000000', borderRadius: 8, boxShadow: '3px 3px 0px #000000', fontFamily: "'Inter', sans-serif", background: '#FFFFFF' }}
    />
  ),
};

/* ================================================================== */
/*  6. Flat Design                                                     */
/* ================================================================== */
export const FlatDesign: Story = {
  render: () => (
    <Showcase
      styleName="Flat Design"
      fontImport={INTER}
      container={{ background: '#FFFFFF', fontFamily: "'Inter', sans-serif", borderRadius: 0 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#2C3E50', marginBottom: 32 }}
      primaryBtn={{ ...BASE_BTN, background: '#3498DB', color: '#FFFFFF', borderRadius: 4 }}
      secondaryBtn={{ ...BASE_BTN, background: '#ECF0F1', color: '#2C3E50', borderRadius: 4 }}
      card={{ background: '#ECF0F1', borderRadius: 4, padding: 24, border: 'none' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#2C3E50', margin: 0 }}
      cardText={{ fontSize: 14, color: '#7F8C8D', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#E74C3C', color: '#FFFFFF', borderRadius: 3 }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#2ECC71', color: '#FFFFFF', borderRadius: 3 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#F39C12', color: '#FFFFFF', borderRadius: 3 }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 600, color: '#2C3E50' }}
      input={{ ...BASE_INPUT, background: '#ECF0F1', border: 'none', borderRadius: 4, color: '#2C3E50', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  7. Dark Mode (OLED)                                                */
/* ================================================================== */
export const DarkModeOLED: Story = {
  render: () => (
    <Showcase
      styleName="Dark Mode (OLED)"
      fontImport={INTER}
      container={{ background: '#000000', fontFamily: "'Inter', sans-serif", borderRadius: 16 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 32 }}
      primaryBtn={{ ...BASE_BTN, background: '#FFFFFF', color: '#000000', borderRadius: 8 }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#FFFFFF', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}
      card={{ background: '#121212', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: 0 }}
      cardText={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: 20 }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#0A84FF', color: '#FFFFFF', borderRadius: 20 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'transparent', color: 'rgba(255,255,255,0.5)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}
      input={{ ...BASE_INPUT, background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  8. Skeuomorphism                                                   */
/* ================================================================== */
export const Skeuomorphism: Story = {
  render: () => (
    <Showcase
      styleName="Skeuomorphism"
      fontImport={INTER}
      container={{ background: 'linear-gradient(180deg, #C0C0C0 0%, #E8E8E8 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 12 }}
      heading={{ fontSize: 26, fontWeight: 700, color: '#333333', marginBottom: 32, textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
      primaryBtn={{ ...BASE_BTN, background: 'linear-gradient(180deg, #6CB4EE 0%, #2B7DC9 100%)', color: '#FFFFFF', borderRadius: 8, border: '1px solid #1E5A94', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)', textShadow: '0 -1px 0 rgba(0,0,0,0.3)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'linear-gradient(180deg, #F8F8F8 0%, #D0D0D0 100%)', color: '#333333', borderRadius: 8, border: '1px solid #999999', boxShadow: '0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)', textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
      card={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F0F0 100%)', borderRadius: 10, padding: 24, border: '1px solid #B0B0B0', boxShadow: '0 4px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)' }}
      cardTitle={{ fontSize: 16, fontWeight: 700, color: '#333333', margin: 0, textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
      cardText={{ fontSize: 14, color: '#666666', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: 'linear-gradient(180deg, #5CB85C 0%, #449D44 100%)', color: '#FFFFFF', borderRadius: 10, border: '1px solid #398439', boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)' }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'linear-gradient(180deg, #F0AD4E 0%, #EC971F 100%)', color: '#FFFFFF', borderRadius: 10, border: '1px solid #D58512' }}
      badgeAlt2={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'linear-gradient(180deg, #D9534F 0%, #C9302C 100%)', color: '#FFFFFF', borderRadius: 10, border: '1px solid #AC2925' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 600, color: '#555555', textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
      input={{ ...BASE_INPUT, background: '#FFFFFF', border: '1px solid #AAAAAA', borderRadius: 6, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 0 rgba(255,255,255,0.8)', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  9. Claymorphism                                                    */
/* ================================================================== */
export const Claymorphism: Story = {
  render: () => (
    <Showcase
      styleName="Claymorphism"
      fontImport={INTER}
      container={{ background: '#F0E6F6', fontFamily: "'Inter', sans-serif", borderRadius: 24 }}
      heading={{ fontSize: 28, fontWeight: 800, color: '#4A3560', marginBottom: 32 }}
      primaryBtn={{ ...BASE_BTN, background: '#FDBCB4', color: '#5A2D20', borderRadius: 16, border: '3px solid rgba(0,0,0,0.05)', boxShadow: '8px 8px 16px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(0,0,0,0.05), inset 4px 4px 8px rgba(255,255,255,0.6)' }}
      secondaryBtn={{ ...BASE_BTN, background: '#ADD8E6', color: '#1A4A5E', borderRadius: 16, border: '3px solid rgba(0,0,0,0.05)', boxShadow: '8px 8px 16px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(0,0,0,0.05), inset 4px 4px 8px rgba(255,255,255,0.6)' }}
      card={{ background: '#E6E6FA', borderRadius: 20, padding: 28, border: '3px solid rgba(0,0,0,0.05)', boxShadow: '10px 10px 20px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(0,0,0,0.05), inset 4px 4px 8px rgba(255,255,255,0.5)' }}
      cardTitle={{ fontSize: 17, fontWeight: 700, color: '#3A2550', margin: 0 }}
      cardText={{ fontSize: 14, color: '#6A5580', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', background: '#98FF98', color: '#1A5A1A', borderRadius: 14, boxShadow: '4px 4px 8px rgba(0,0,0,0.08), inset 2px 2px 4px rgba(255,255,255,0.5)' }}
      badgeAlt={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', background: '#FDBCB4', color: '#5A2D20', borderRadius: 14, boxShadow: '4px 4px 8px rgba(0,0,0,0.08), inset 2px 2px 4px rgba(255,255,255,0.5)' }}
      badgeAlt2={{ fontSize: 11, fontWeight: 700, padding: '5px 14px', background: '#ADD8E6', color: '#1A4A5E', borderRadius: 14, boxShadow: '4px 4px 8px rgba(0,0,0,0.08), inset 2px 2px 4px rgba(255,255,255,0.5)' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 700, color: '#4A3560' }}
      input={{ ...BASE_INPUT, background: '#F5EDF9', border: '3px solid rgba(0,0,0,0.05)', borderRadius: 14, boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.05), inset -2px -2px 4px rgba(255,255,255,0.5)', color: '#3A2550', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  10. Retro-Futurism                                                 */
/* ================================================================== */
export const RetroFuturism: Story = {
  render: () => (
    <Showcase
      styleName="Retro-Futurism"
      fontImport={SPACE_MONO}
      container={{ background: '#1A1A2E', fontFamily: "'Space Mono', monospace", borderRadius: 0 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#00FFFF', marginBottom: 32, textShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF' }}
      primaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#FF006E', borderRadius: 0, border: '2px solid #FF006E', boxShadow: '0 0 10px rgba(255,0,110,0.5), inset 0 0 10px rgba(255,0,110,0.1)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 2 }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#00FFFF', borderRadius: 0, border: '1px solid #00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.3)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 2 }}
      card={{ background: 'rgba(0,255,255,0.05)', borderRadius: 0, padding: 24, border: '1px solid rgba(0,255,255,0.3)', boxShadow: '0 0 15px rgba(0,255,255,0.1)' }}
      cardTitle={{ fontSize: 15, fontWeight: 700, color: '#00FFFF', margin: 0, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 1 }}
      cardText={{ fontSize: 13, color: 'rgba(0,255,255,0.6)', lineHeight: 1.7, margin: '12px 0', fontFamily: "'Space Mono', monospace" }}
      badge={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', background: 'transparent', color: '#FF006E', borderRadius: 0, border: '1px solid #FF006E', boxShadow: '0 0 6px rgba(255,0,110,0.4)', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}
      badgeAlt={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', background: 'rgba(93,52,208,0.2)', color: '#A78BFA', borderRadius: 0, border: '1px solid #5D34D0', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}
      badgeAlt2={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', background: 'transparent', color: '#00FFFF', borderRadius: 0, border: '1px solid rgba(0,255,255,0.4)', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 11, fontWeight: 700, color: '#00FFFF', textTransform: 'uppercase', letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}
      input={{ ...BASE_INPUT, background: 'rgba(0,255,255,0.05)', border: '1px solid rgba(0,255,255,0.3)', borderRadius: 0, color: '#00FFFF', fontFamily: "'Space Mono', monospace", boxShadow: '0 0 8px rgba(0,255,255,0.1)' }}
    />
  ),
};

/* ================================================================== */
/*  11. Y2K Aesthetic                                                  */
/* ================================================================== */
export const Y2KAesthetic: Story = {
  render: () => (
    <Showcase
      styleName="Y2K Aesthetic"
      fontImport={INTER}
      container={{ background: 'linear-gradient(135deg, #FFB6C1 0%, #E0B0FF 50%, #87CEFA 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 20 }}
      heading={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 32, textShadow: '2px 2px 0 #FF69B4, -1px -1px 0 #00FFFF' }}
      primaryBtn={{ ...BASE_BTN, background: 'linear-gradient(135deg, #FF69B4, #9400D3)', color: '#FFFFFF', borderRadius: 24, border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 15px rgba(255,105,180,0.4)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)', color: '#333333', borderRadius: 24, border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      card={{ background: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: 24, border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 32px rgba(148,0,211,0.15)' }}
      cardTitle={{ fontSize: 17, fontWeight: 800, color: '#9400D3', margin: 0 }}
      cardText={{ fontSize: 14, color: '#666', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 700, padding: '4px 14px', background: '#FF69B4', color: '#FFFFFF', borderRadius: 20, boxShadow: '0 2px 8px rgba(255,105,180,0.4)' }}
      badgeAlt={{ fontSize: 11, fontWeight: 700, padding: '4px 14px', background: '#00FFFF', color: '#333', borderRadius: 20 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 700, padding: '4px 14px', background: 'linear-gradient(135deg, #C0C0C0, #FFFFFF)', color: '#9400D3', borderRadius: 20, border: '1px solid #C0C0C0' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 700, color: '#9400D3' }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.8)', border: '2px solid #FF69B4', borderRadius: 16, color: '#333', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  12. Cyberpunk UI                                                   */
/* ================================================================== */
export const CyberpunkUI: Story = {
  render: () => (
    <Showcase
      styleName="Cyberpunk UI"
      fontImport={SPACE_MONO}
      container={{ background: '#0D0D0D', fontFamily: "'Space Mono', monospace", borderRadius: 0 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#00FF00', marginBottom: 32, textShadow: '0 0 10px #00FF00', textTransform: 'uppercase', letterSpacing: 4 }}
      primaryBtn={{ ...BASE_BTN, background: '#FF00FF', color: '#0D0D0D', borderRadius: 0, border: '2px solid #FF00FF', boxShadow: '0 0 15px rgba(255,0,255,0.5), 4px 4px 0 #00FFFF', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 2, fontWeight: 900 }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#00FF00', borderRadius: 0, border: '1px solid #00FF00', boxShadow: '0 0 8px rgba(0,255,0,0.3)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 2 }}
      card={{ background: 'rgba(0,255,0,0.03)', borderRadius: 0, padding: 24, border: '1px solid #00FF00', boxShadow: '0 0 20px rgba(0,255,0,0.1), inset 0 0 30px rgba(0,255,0,0.02)' }}
      cardTitle={{ fontSize: 15, fontWeight: 700, color: '#00FFFF', margin: 0, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 2 }}
      cardText={{ fontSize: 12, color: 'rgba(0,255,0,0.7)', lineHeight: 1.8, margin: '12px 0', fontFamily: "'Space Mono', monospace" }}
      badge={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#FF00FF', color: '#0D0D0D', borderRadius: 0, textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}
      badgeAlt={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#00FF00', color: '#0D0D0D', borderRadius: 0, textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}
      badgeAlt2={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', background: 'transparent', color: '#00FFFF', borderRadius: 0, border: '1px solid #00FFFF', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 11, fontWeight: 700, color: '#00FF00', textTransform: 'uppercase', letterSpacing: 2, fontFamily: "'Space Mono', monospace" }}
      input={{ ...BASE_INPUT, background: 'rgba(0,255,0,0.05)', border: '1px solid #00FF00', borderRadius: 0, color: '#00FF00', fontFamily: "'Space Mono', monospace", boxShadow: '0 0 8px rgba(0,255,0,0.15)' }}
    />
  ),
};

/* ================================================================== */
/*  13. Memphis Design                                                 */
/* ================================================================== */
export const MemphisDesign: Story = {
  render: () => (
    <Showcase
      styleName="Memphis Design"
      fontImport={INTER}
      container={{ background: '#FFFFFF', fontFamily: "'Inter', sans-serif", borderRadius: 0 }}
      heading={{ fontSize: 32, fontWeight: 900, color: '#FF71CE', marginBottom: 32, textTransform: 'uppercase' }}
      primaryBtn={{ ...BASE_BTN, background: '#FF71CE', color: '#FFFFFF', borderRadius: 0, border: '3px solid #000000', boxShadow: '5px 5px 0 #FFCE5C', fontWeight: 900, textTransform: 'uppercase' }}
      secondaryBtn={{ ...BASE_BTN, background: '#86CCCA', color: '#000000', borderRadius: 0, border: '3px solid #000000', boxShadow: '5px 5px 0 #6A7BB4', fontWeight: 900, textTransform: 'uppercase' }}
      card={{ background: '#FFCE5C', borderRadius: 0, padding: 24, border: '4px solid #000000', boxShadow: '8px 8px 0 #FF71CE' }}
      cardTitle={{ fontSize: 18, fontWeight: 900, color: '#000000', margin: 0, textTransform: 'uppercase' }}
      cardText={{ fontSize: 14, color: '#333333', lineHeight: 1.5, margin: '12px 0' }}
      badge={{ fontSize: 12, fontWeight: 900, padding: '5px 14px', background: '#6A7BB4', color: '#FFFFFF', borderRadius: 0, border: '2px solid #000000' }}
      badgeAlt={{ fontSize: 12, fontWeight: 900, padding: '5px 14px', background: '#FF71CE', color: '#FFFFFF', borderRadius: 0, border: '2px solid #000000' }}
      badgeAlt2={{ fontSize: 12, fontWeight: 900, padding: '5px 14px', background: '#86CCCA', color: '#000000', borderRadius: 0, border: '2px solid #000000' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 13, fontWeight: 900, color: '#6A7BB4', textTransform: 'uppercase' }}
      input={{ ...BASE_INPUT, border: '3px solid #000000', borderRadius: 0, background: '#FFFFFF', fontFamily: "'Inter', sans-serif", boxShadow: '4px 4px 0 #86CCCA' }}
    />
  ),
};

/* ================================================================== */
/*  14. Vaporwave                                                      */
/* ================================================================== */
export const Vaporwave: Story = {
  render: () => (
    <Showcase
      styleName="Vaporwave"
      fontImport={INTER}
      container={{ background: 'linear-gradient(180deg, #1A0033 0%, #330066 50%, #660066 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 0 }}
      heading={{ fontSize: 30, fontWeight: 800, color: '#FF71CE', marginBottom: 32, textShadow: '3px 3px 0 #01CDFE' }}
      primaryBtn={{ ...BASE_BTN, background: 'linear-gradient(135deg, #FF71CE, #B967FF)', color: '#FFFFFF', borderRadius: 0, border: '2px solid #01CDFE', boxShadow: '0 0 20px rgba(255,113,206,0.4)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#01CDFE', borderRadius: 0, border: '2px solid #01CDFE', boxShadow: '0 0 10px rgba(1,205,254,0.3)' }}
      card={{ background: 'rgba(185,103,255,0.15)', borderRadius: 0, padding: 24, border: '2px solid rgba(255,113,206,0.4)', boxShadow: '0 0 30px rgba(185,103,255,0.15)' }}
      cardTitle={{ fontSize: 16, fontWeight: 700, color: '#FF71CE', margin: 0 }}
      cardText={{ fontSize: 14, color: 'rgba(1,205,254,0.8)', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: '#FF71CE', color: '#1A0033', borderRadius: 0 }}
      badgeAlt={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: '#05FFA1', color: '#1A0033', borderRadius: 0 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', background: '#01CDFE', color: '#1A0033', borderRadius: 0 }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 700, color: '#05FFA1' }}
      input={{ ...BASE_INPUT, background: 'rgba(1,205,254,0.1)', border: '2px solid rgba(1,205,254,0.4)', borderRadius: 0, color: '#01CDFE', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  15. Bento Box Grid                                                 */
/* ================================================================== */
export const BentoBoxGrid: Story = {
  render: () => (
    <Showcase
      styleName="Bento Box Grid"
      fontImport={INTER}
      container={{ background: '#F5F5F7', fontFamily: "'Inter', sans-serif", borderRadius: 20 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#1D1D1F', marginBottom: 32, letterSpacing: -0.5 }}
      primaryBtn={{ ...BASE_BTN, background: '#1D1D1F', color: '#FFFFFF', borderRadius: 12 }}
      secondaryBtn={{ ...BASE_BTN, background: '#FFFFFF', color: '#1D1D1F', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
      card={{ background: '#FFFFFF', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F', margin: 0 }}
      cardText={{ fontSize: 14, color: '#86868B', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#F5F5F7', color: '#1D1D1F', borderRadius: 8 }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#0071E3', color: '#FFFFFF', borderRadius: 8 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'transparent', color: '#86868B', borderRadius: 8, border: '1px solid #D2D2D7' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 600, color: '#1D1D1F' }}
      input={{ ...BASE_INPUT, background: '#FFFFFF', border: '1px solid #D2D2D7', borderRadius: 10, color: '#1D1D1F', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  16. Exaggerated Minimalism                                         */
/* ================================================================== */
export const ExaggeratedMinimalism: Story = {
  render: () => (
    <Showcase
      styleName="Exaggerated Minimalism"
      fontImport={INTER}
      container={{ background: '#FFFFFF', fontFamily: "'Inter', sans-serif", borderRadius: 0, paddingTop: 80, paddingBottom: 80 }}
      heading={{ fontSize: 56, fontWeight: 900, color: '#000000', marginBottom: 64, letterSpacing: -2, lineHeight: 1 }}
      primaryBtn={{ ...BASE_BTN, background: '#000000', color: '#FFFFFF', borderRadius: 0, padding: '14px 40px', fontSize: 16 }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#000000', borderRadius: 0, border: '1px solid #000000', padding: '14px 40px', fontSize: 16 }}
      card={{ background: '#FFFFFF', borderRadius: 0, padding: 32, borderTop: '1px solid #E0E0E0' }}
      cardTitle={{ fontSize: 20, fontWeight: 800, color: '#000000', margin: 0 }}
      cardText={{ fontSize: 15, color: '#999999', lineHeight: 1.8, margin: '16px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 14px', background: '#000000', color: '#FFFFFF', borderRadius: 0, textTransform: 'uppercase', letterSpacing: 2 }}
      badgeAlt={{ fontSize: 11, fontWeight: 500, padding: '4px 14px', background: 'transparent', color: '#999999', borderRadius: 0, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #999' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}
      label={{ fontSize: 11, fontWeight: 600, color: '#999999', textTransform: 'uppercase', letterSpacing: 3 }}
      input={{ ...BASE_INPUT, background: 'transparent', border: 'none', borderBottom: '1px solid #000000', borderRadius: 0, fontSize: 16, padding: '12px 0', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  17. HUD / Sci-Fi FUI                                               */
/* ================================================================== */
export const HUDSciFiFUI: Story = {
  render: () => (
    <Showcase
      styleName="HUD / Sci-Fi FUI"
      fontImport={SPACE_MONO}
      container={{ background: '#0A0A14', fontFamily: "'Space Mono', monospace", borderRadius: 0, border: '1px solid rgba(0,255,255,0.15)' }}
      heading={{ fontSize: 22, fontWeight: 700, color: '#00FFFF', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 6, fontFamily: "'Space Mono', monospace" }}
      primaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#00FFFF', borderRadius: 0, border: '1px solid #00FFFF', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 3, fontSize: 11, boxShadow: '0 0 10px rgba(0,255,255,0.2)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: 'rgba(0,255,255,0.5)', borderRadius: 0, border: '1px solid rgba(0,255,255,0.3)', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 3, fontSize: 11 }}
      card={{ background: 'rgba(0,255,255,0.03)', borderRadius: 0, padding: 24, border: '1px solid rgba(0,255,255,0.2)', position: 'relative' }}
      cardTitle={{ fontSize: 12, fontWeight: 700, color: '#00FFFF', margin: 0, fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: 3 }}
      cardText={{ fontSize: 11, color: 'rgba(0,255,255,0.5)', lineHeight: 1.8, margin: '12px 0', fontFamily: "'Space Mono', monospace" }}
      badge={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', background: 'transparent', color: '#00FFFF', borderRadius: 0, border: '1px solid #00FFFF', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", letterSpacing: 2 }}
      badgeAlt={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', background: 'transparent', color: '#FF0000', borderRadius: 0, border: '1px solid #FF0000', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", letterSpacing: 2 }}
      badgeAlt2={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', background: 'rgba(0,255,255,0.1)', color: '#0080FF', borderRadius: 0, border: '1px solid #0080FF', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace", letterSpacing: 2 }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 3, fontFamily: "'Space Mono', monospace" }}
      input={{ ...BASE_INPUT, background: 'rgba(0,255,255,0.03)', border: '1px solid rgba(0,255,255,0.25)', borderRadius: 0, color: '#00FFFF', fontFamily: "'Space Mono', monospace", fontSize: 12 }}
    />
  ),
};

/* ================================================================== */
/*  18. Pixel Art                                                      */
/* ================================================================== */
export const PixelArt: Story = {
  render: () => (
    <Showcase
      styleName="Pixel Art"
      fontImport={PRESS_START}
      container={{ background: '#2C2137', fontFamily: "'Press Start 2P', cursive", borderRadius: 0, imageRendering: 'pixelated' as React.CSSProperties['imageRendering'] }}
      heading={{ fontSize: 18, fontWeight: 400, color: '#F8E71C', marginBottom: 32, fontFamily: "'Press Start 2P', cursive" }}
      primaryBtn={{ ...BASE_BTN, background: '#E74C3C', color: '#FFFFFF', borderRadius: 0, border: '4px solid #000000', fontFamily: "'Press Start 2P', cursive", fontSize: 10, padding: '12px 20px', boxShadow: '4px 4px 0 #000000' }}
      secondaryBtn={{ ...BASE_BTN, background: '#3498DB', color: '#FFFFFF', borderRadius: 0, border: '4px solid #000000', fontFamily: "'Press Start 2P', cursive", fontSize: 10, padding: '12px 20px', boxShadow: '4px 4px 0 #000000' }}
      card={{ background: '#3D2C4E', borderRadius: 0, padding: 24, border: '4px solid #F8E71C', boxShadow: '4px 4px 0 #000000' }}
      cardTitle={{ fontSize: 12, fontWeight: 400, color: '#F8E71C', margin: 0, fontFamily: "'Press Start 2P', cursive" }}
      cardText={{ fontSize: 9, color: '#A89BBA', lineHeight: 2, margin: '16px 0', fontFamily: "'Press Start 2P', cursive" }}
      badge={{ fontSize: 8, fontWeight: 400, padding: '4px 8px', background: '#2ECC71', color: '#000000', borderRadius: 0, border: '2px solid #000000', fontFamily: "'Press Start 2P', cursive" }}
      badgeAlt={{ fontSize: 8, fontWeight: 400, padding: '4px 8px', background: '#E74C3C', color: '#FFFFFF', borderRadius: 0, border: '2px solid #000000', fontFamily: "'Press Start 2P', cursive" }}
      badgeAlt2={{ fontSize: 8, fontWeight: 400, padding: '4px 8px', background: '#F8E71C', color: '#000000', borderRadius: 0, border: '2px solid #000000', fontFamily: "'Press Start 2P', cursive" }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 9, fontWeight: 400, color: '#F8E71C', fontFamily: "'Press Start 2P', cursive" }}
      input={{ ...BASE_INPUT, background: '#1A1225', border: '4px solid #F8E71C', borderRadius: 0, color: '#FFFFFF', fontFamily: "'Press Start 2P', cursive", fontSize: 10 }}
    />
  ),
};

/* ================================================================== */
/*  19. Spatial UI (VisionOS)                                          */
/* ================================================================== */
export const SpatialUIVisionOS: Story = {
  render: () => (
    <Showcase
      styleName="Spatial UI (VisionOS)"
      fontImport={INTER}
      container={{ background: 'linear-gradient(135deg, #1C1C2E 0%, #2D2D44 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 28 }}
      heading={{ fontSize: 28, fontWeight: 600, color: '#FFFFFF', marginBottom: 32, letterSpacing: -0.3 }}
      primaryBtn={{ ...BASE_BTN, background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      card={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: 24, border: '0.5px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: 0 }}
      cardText={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: 12, backdropFilter: 'blur(10px)' }}
      badgeAlt={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'rgba(10,132,255,0.3)', color: '#4CB4FF', borderRadius: 12 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'rgba(48,209,88,0.2)', color: '#30D158', borderRadius: 12 }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#FFFFFF', backdropFilter: 'blur(10px)', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  20. Gen Z Chaos / Maximalism                                       */
/* ================================================================== */
export const GenZChaos: Story = {
  render: () => (
    <Showcase
      styleName="Gen Z Chaos"
      fontImport={INTER}
      container={{ background: '#FFFF00', fontFamily: "'Inter', sans-serif", borderRadius: 0, transform: 'rotate(0deg)' }}
      heading={{ fontSize: 36, fontWeight: 900, color: '#FF00FF', marginBottom: 32, textShadow: '3px 3px 0 #00FF00, -2px -2px 0 #0000FF', transform: 'rotate(-2deg)' }}
      primaryBtn={{ ...BASE_BTN, background: '#FF00FF', color: '#FFFF00', borderRadius: 30, border: '4px solid #0000FF', boxShadow: '6px 6px 0 #00FF00', fontWeight: 900, fontSize: 15, transform: 'rotate(2deg)' }}
      secondaryBtn={{ ...BASE_BTN, background: '#00FF00', color: '#FF00FF', borderRadius: 0, border: '4px solid #000000', boxShadow: '4px 4px 0 #FF00FF', fontWeight: 900, fontSize: 15, transform: 'rotate(-1deg)' }}
      card={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '5px solid #0000FF', boxShadow: '10px 10px 0 #FF00FF', transform: 'rotate(1deg)' }}
      cardTitle={{ fontSize: 20, fontWeight: 900, color: '#0000FF', margin: 0 }}
      cardText={{ fontSize: 14, color: '#333', lineHeight: 1.5, margin: '12px 0' }}
      badge={{ fontSize: 12, fontWeight: 900, padding: '5px 14px', background: '#FF00FF', color: '#FFFF00', borderRadius: 20, transform: 'rotate(-3deg)' }}
      badgeAlt={{ fontSize: 12, fontWeight: 900, padding: '5px 14px', background: '#00FF00', color: '#000', borderRadius: 0, border: '3px solid #000', transform: 'rotate(2deg)' }}
      badgeAlt2={{ fontSize: 12, fontWeight: 900, padding: '5px 14px', background: '#0000FF', color: '#FFFF00', borderRadius: 10, transform: 'rotate(-1deg)' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 360 }}
      label={{ fontSize: 14, fontWeight: 900, color: '#FF00FF', textTransform: 'uppercase' }}
      input={{ ...BASE_INPUT, border: '4px solid #0000FF', borderRadius: 0, background: '#FFFFFF', fontFamily: "'Inter', sans-serif", boxShadow: '4px 4px 0 #00FF00' }}
    />
  ),
};

/* ================================================================== */
/*  21. Liquid Glass                                                   */
/* ================================================================== */
export const LiquidGlass: Story = {
  render: () => (
    <Showcase
      styleName="Liquid Glass"
      fontImport={INTER}
      container={{ background: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 24 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 32, background: 'linear-gradient(90deg, #FF9ECD, #87CEEB, #FF9ECD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      primaryBtn={{ ...BASE_BTN, background: 'linear-gradient(135deg, rgba(255,158,205,0.3), rgba(135,206,235,0.3))', color: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(255,158,205,0.2)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
      card={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: 0 }}
      cardText={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 14px', background: 'linear-gradient(135deg, rgba(255,158,205,0.3), rgba(192,192,192,0.3))', color: '#FFFFFF', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}
      badgeAlt={{ fontSize: 11, fontWeight: 500, padding: '4px 14px', background: 'linear-gradient(135deg, rgba(135,206,235,0.3), rgba(192,192,192,0.2))', color: '#87CEEB', borderRadius: 20, border: '1px solid rgba(135,206,235,0.2)' }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 14px', background: 'transparent', color: 'rgba(255,255,255,0.6)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: '#FFFFFF', backdropFilter: 'blur(10px)', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  22. Aurora UI                                                      */
/* ================================================================== */
export const AuroraUI: Story = {
  render: () => (
    <Showcase
      styleName="Aurora UI"
      fontImport={INTER}
      container={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', fontFamily: "'Inter', sans-serif", borderRadius: 20 }}
      extraBg={
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20, zIndex: 0 }}>
          <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,128,255,0.3) 0%, transparent 70%)', top: -100, left: -50, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,20,147,0.25) 0%, transparent 70%)', top: 100, right: -50, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)', bottom: -80, left: 200, filter: 'blur(60px)' }} />
        </div>
      }
      heading={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginBottom: 32 }}
      primaryBtn={{ ...BASE_BTN, background: 'linear-gradient(135deg, #0080FF, #FF1493)', color: '#FFFFFF', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,128,255,0.4)' }}
      secondaryBtn={{ ...BASE_BTN, background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)' }}
      card={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      cardTitle={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: 0 }}
      cardText={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: '12px 0' }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'rgba(0,128,255,0.2)', color: '#4CB4FF', borderRadius: 10 }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: 'rgba(255,20,147,0.2)', color: '#FF69B4', borderRadius: 10 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 12px', background: 'rgba(0,255,255,0.15)', color: '#00FFFF', borderRadius: 10 }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}
    />
  ),
};

/* ================================================================== */
/*  23. Organic Biophilic                                              */
/* ================================================================== */
export const OrganicBiophilic: Story = {
  render: () => (
    <Showcase
      styleName="Organic Biophilic"
      fontImport={LORA}
      container={{ background: '#F5F5DC', fontFamily: "'Lora', serif", borderRadius: 24 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#228B22', marginBottom: 32, fontFamily: "'Lora', serif" }}
      primaryBtn={{ ...BASE_BTN, background: '#228B22', color: '#FFFFFF', borderRadius: 24, fontFamily: "'Lora', serif" }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#228B22', borderRadius: 24, border: '2px solid #228B22', fontFamily: "'Lora', serif" }}
      card={{ background: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 24, border: '1px solid rgba(34,139,34,0.15)' }}
      cardTitle={{ fontSize: 17, fontWeight: 700, color: '#8B4513', margin: 0, fontFamily: "'Lora', serif" }}
      cardText={{ fontSize: 14, color: '#5A6B4A', lineHeight: 1.7, margin: '12px 0', fontFamily: "'Lora', serif" }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 14px', background: '#228B22', color: '#FFFFFF', borderRadius: 20 }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 14px', background: '#8B4513', color: '#FFFFFF', borderRadius: 20 }}
      badgeAlt2={{ fontSize: 11, fontWeight: 500, padding: '4px 14px', background: 'transparent', color: '#228B22', borderRadius: 20, border: '1px solid #228B22' }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 600, color: '#8B4513', fontFamily: "'Lora', serif" }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(34,139,34,0.25)', borderRadius: 14, color: '#333', fontFamily: "'Lora', serif" }}
    />
  ),
};

/* ================================================================== */
/*  24. E-Ink / Paper                                                  */
/* ================================================================== */
export const EInkPaper: Story = {
  render: () => (
    <Showcase
      styleName="E-Ink / Paper"
      fontImport={LIBRE}
      container={{ background: '#FDFBF7', fontFamily: "'Libre Baskerville', serif", borderRadius: 0 }}
      heading={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 32, fontFamily: "'Libre Baskerville', serif" }}
      primaryBtn={{ ...BASE_BTN, background: '#1A1A1A', color: '#FDFBF7', borderRadius: 0, fontFamily: "'Libre Baskerville', serif" }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#1A1A1A', borderRadius: 0, border: '1px solid #1A1A1A', fontFamily: "'Libre Baskerville', serif" }}
      card={{ background: '#F5F5F0', borderRadius: 0, padding: 24, border: '1px solid #D0CBC3' }}
      cardTitle={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: 0, fontFamily: "'Libre Baskerville', serif" }}
      cardText={{ fontSize: 14, color: '#555555', lineHeight: 1.8, margin: '12px 0', fontFamily: "'Libre Baskerville', serif" }}
      badge={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', background: '#1A1A1A', color: '#FDFBF7', borderRadius: 0, fontFamily: "'Libre Baskerville', serif" }}
      badgeAlt={{ fontSize: 11, fontWeight: 400, padding: '3px 10px', background: 'transparent', color: '#555555', borderRadius: 0, border: '1px solid #999999', fontFamily: "'Libre Baskerville', serif" }}
      badgeAlt2={{ fontSize: 11, fontWeight: 400, padding: '3px 10px', background: '#E8E4DC', color: '#333', borderRadius: 0, fontFamily: "'Libre Baskerville', serif" }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 700, color: '#333333', fontFamily: "'Libre Baskerville', serif" }}
      input={{ ...BASE_INPUT, background: '#FDFBF7', border: '1px solid #B0AAA0', borderRadius: 0, color: '#1A1A1A', fontFamily: "'Libre Baskerville', serif" }}
    />
  ),
};

/* ================================================================== */
/*  25. Vintage Analog / Retro Film                                    */
/* ================================================================== */
export const VintageAnalog: Story = {
  render: () => (
    <Showcase
      styleName="Vintage Analog / Retro Film"
      fontImport={PLAYFAIR}
      container={{ background: '#F5E6C8', fontFamily: "'Playfair Display', serif", borderRadius: 0 }}
      heading={{ fontSize: 28, fontWeight: 700, color: '#D4A574', marginBottom: 32, fontFamily: "'Playfair Display', serif" }}
      primaryBtn={{ ...BASE_BTN, background: '#D4A574', color: '#FFFFFF', borderRadius: 4, fontFamily: "'Playfair Display', serif" }}
      secondaryBtn={{ ...BASE_BTN, background: 'transparent', color: '#D4A574', borderRadius: 4, border: '1px solid #D4A574', fontFamily: "'Playfair Display', serif" }}
      card={{ background: 'rgba(255,255,255,0.5)', borderRadius: 4, padding: 24, border: '1px solid rgba(212,165,116,0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      cardTitle={{ fontSize: 17, fontWeight: 700, color: '#4A7B7C', margin: 0, fontFamily: "'Playfair Display', serif" }}
      cardText={{ fontSize: 14, color: '#8B7D6B', lineHeight: 1.7, margin: '12px 0', fontFamily: "'Playfair Display', serif" }}
      badge={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#4A7B7C', color: '#F5E6C8', borderRadius: 4, fontFamily: "'Playfair Display', serif" }}
      badgeAlt={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: '#E8B4B8', color: '#5A3A3C', borderRadius: 4, fontFamily: "'Playfair Display', serif" }}
      badgeAlt2={{ fontSize: 11, fontWeight: 400, padding: '4px 12px', background: 'transparent', color: '#D4A574', borderRadius: 4, border: '1px solid #D4A574', fontFamily: "'Playfair Display', serif" }}
      inputWrapper={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}
      label={{ fontSize: 12, fontWeight: 600, color: '#8B7D6B', fontFamily: "'Playfair Display', serif" }}
      input={{ ...BASE_INPUT, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(212,165,116,0.4)', borderRadius: 4, color: '#333', fontFamily: "'Playfair Display', serif" }}
    />
  ),
};
