import { PLAYER_HUES } from '@shared/gameEngine';

export const COLORS = {
  bgDeep: '#0F0B2E',
  bgMid: '#1A1240',
  surface: 'rgba(255, 255, 255, 0.08)',
  surfaceStrong: 'rgba(255, 255, 255, 0.14)',
  border: 'rgba(255, 255, 255, 0.18)',
  text: '#F5F3FF',
  textMuted: '#B8B3D9',
  textDim: '#7C7799',
  danger: '#F43F5E',
  success: '#34D399',
};

export const GRADIENT = {
  primary: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F59E0B 100%)',
  primarySoft: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
  bg: 'radial-gradient(ellipse at top, #2A1B5E 0%, #0F0B2E 60%)',
};

export const RADII = {
  sm: '8px',
  md: '14px',
  lg: '20px',
  xl: '28px',
  pill: '999px',
};

export const SHADOWS = {
  soft: '0 4px 20px rgba(0, 0, 0, 0.35)',
  glow: '0 0 24px rgba(124, 58, 237, 0.45)',
  lifted: '0 12px 40px rgba(0, 0, 0, 0.5)',
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const TIMING = {
  fast: '150ms',
  base: '250ms',
  slow: '400ms',
  diceRoll: 1200,
  celebration: 2500,
};

export const EASING = {
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

export const HUES = PLAYER_HUES;

export function hueFor(player) {
  if (!player) return HUES[0];
  return HUES.find((h) => h.id === player.hue) || HUES[0];
}
