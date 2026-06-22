import * as THREE from 'three';

const PIP_POSITIONS = {
  1: [[0.5, 0.5]],
  2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
  4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
  5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
  6: [[0.25, 0.22], [0.75, 0.22], [0.25, 0.5], [0.75, 0.5], [0.25, 0.78], [0.75, 0.78]],
};

const SIZE = 256;
const cache = new Map();

export function getFaceTexture(value) {
  if (cache.has(value)) return cache.get(value);

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = '#1A1A1A';
  const positions = PIP_POSITIONS[value] || [];
  const pipRadius = SIZE * 0.1;

  for (const [px, py] of positions) {
    ctx.beginPath();
    ctx.arc(px * SIZE, py * SIZE, pipRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  cache.set(value, tex);
  return tex;
}

export function disposeFaceTextures() {
  for (const tex of cache.values()) tex.dispose();
  cache.clear();
}
