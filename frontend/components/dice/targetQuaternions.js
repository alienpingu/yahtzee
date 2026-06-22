import * as THREE from 'three';

const HALF_PI = Math.PI / 2;

// BoxGeometry material slot order: [+X, -X, +Y, -Y, +Z, -Z]
// Standard die: opposite faces sum to 7
//   +X=2, -X=5, +Y=1, -Y=6, +Z=3, -Z=4
export const FACE_MATERIAL_ORDER = [2, 5, 1, 6, 3, 4];

// Rotations to bring face N to point toward +Z (camera-facing)
// Camera sits at +Z looking toward origin, so visible face has normal +Z
const ROTATIONS = {
  1: new THREE.Euler(HALF_PI, 0, 0),         // +Y → +Z
  2: new THREE.Euler(0, -HALF_PI, 0),         // +X → +Z
  3: new THREE.Euler(0, 0, 0),                // +Z → +Z (identity)
  4: new THREE.Euler(0, Math.PI, 0),          // -Z → +Z
  5: new THREE.Euler(0, HALF_PI, 0),          // -X → +Z
  6: new THREE.Euler(-HALF_PI, 0, 0),         // -Y → +Z
};

export const TARGET_QUATERNIONS = {};
for (let v = 1; v <= 6; v++) {
  TARGET_QUATERNIONS[v] = new THREE.Quaternion().setFromEuler(ROTATIONS[v]);
}
