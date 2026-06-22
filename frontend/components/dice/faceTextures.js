import * as THREE from 'three';

const PIP_POSITIONS = {
  1: [[0.5, 0.5]],
  2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.22], [0.75, 0.22], [0.25, 0.5], [0.75, 0.5], [0.25, 0.78], [0.75, 0.78]],
};

const SIZE = 512;
const cache = new Map();

export function getFaceTexture(value) {
  if (cache.has(value)) return cache.get(value);

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // Pure white background for maximum contrast
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Pips — pure black with subtle carved depth
  const positions = PIP_POSITIONS[value] || [];
  const pipRadius = SIZE * 0.1;
  const pipDiameter = pipRadius * 2;

  for (const [px, py] of positions) {
    const cx = px * SIZE;
    const cy = py * SIZE;

    // Carved recess shadow (below pip)
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = pipDiameter * 0.35;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, pipRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1A1A1A';
    ctx.fill();
    ctx.restore();

    // Pip body (solid black)
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.arc(cx, cy, pipRadius * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Subtle top-left highlight (glossy reflection)
    const highlight = ctx.createRadialGradient(
      cx - pipRadius * 0.35, cy - pipRadius * 0.35, 0,
      cx - pipRadius * 0.35, cy - pipRadius * 0.35, pipRadius * 0.5
    );
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlight;
    ctx.beginPath();
    ctx.arc(cx, cy, pipRadius * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  cache.set(value, tex);
  return tex;
}

export function disposeFaceTextures() {
  for (const tex of cache.values()) tex.dispose();
  cache.clear();
}
