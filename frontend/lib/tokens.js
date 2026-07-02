import { PLAYER_HUES } from '@shared/gameEngine';

export const COLORS = {
  bgDeep: '#8B0D15',
  bgMid: '#A6111D',
  surface: 'rgba(247, 233, 208, 0.85)',
  surfaceStrong: 'rgba(247, 233, 208, 0.95)',
  border: 'rgba(139, 69, 19, 0.2)',
  text: '#1A1A2E',
  textMuted: '#6B4C3B',
  textDim: '#9E8577',
  danger: '#C91A29',
  success: '#24B04B',
  accent: '#FFC526',
  cream: '#F7E9D0',
};

export const GRADIENT = {
  primary: 'linear-gradient(135deg, #FFC526 0%, #FF9E00 100%)',
  primarySoft: 'linear-gradient(135deg, #FFC526 0%, #FF9E00 100%)',
  bg: 'radial-gradient(ellipse at top, #C91A29 0%, #8B0D15 60%)',
};

export const RADII = {
  sm: '8px',
  md: '14px',
  lg: '20px',
  xl: '28px',
  pill: '999px',
};

export const SHADOWS = {
  soft: '0 4px 20px rgba(100, 20, 20, 0.25)',
  glow: '0 0 24px rgba(255, 197, 38, 0.45)',
  lifted: '0 12px 40px rgba(60, 10, 10, 0.4)',
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
