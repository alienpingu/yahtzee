'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getFaceTexture } from './faceTextures';
import { FACE_MATERIAL_ORDER, TARGET_QUATERNIONS } from './targetQuaternions';

const TUMBLE_DURATION = 900;
const LAND_DURATION = 300;
const DICE_SIZE = 0.85;
const DICE_SPACING = 1.15;

const black = new THREE.Color(0x000000);

export default function Die3D({ value, index, isKept, canKeep, onToggleKeep, reduceMotion, hueColor }) {
  const meshRef = useRef();
  const animState = useRef('idle');
  const animStart = useRef(0);
  const angularVel = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const prevValue = useRef(value);
  const [hovered, setHovered] = useState(false);

  const displayValue = value || 1;

  const materials = useMemo(() => {
    return FACE_MATERIAL_ORDER.map((faceVal) => {
      const tex = getFaceTexture(faceVal);
      return new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.25,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15,
        reflectivity: 0.5,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.8,
      });
    });
  }, []);

  const glowColor = useMemo(() => new THREE.Color(hueColor || 0x7C3AED), [hueColor]);

  useEffect(() => {
    return () => { materials.forEach((m) => m.dispose()); };
  }, [materials]);

  useEffect(() => {
    const oldValue = prevValue.current;
    prevValue.current = value;

    if (value === 0) {
      if (meshRef.current) meshRef.current.quaternion.copy(TARGET_QUATERNIONS[1]);
      animState.current = 'idle';
      return;
    }

    if (value === oldValue || isKept) return;

    if (reduceMotion) {
      if (meshRef.current) meshRef.current.quaternion.copy(TARGET_QUATERNIONS[value]);
      animState.current = 'idle';
      return;
    }

    animState.current = 'tumbling';
    animStart.current = performance.now();
    angularVel.current.set(
      (Math.random() - 0.5) * 16 + (Math.random() > 0.5 ? 6 : -6),
      (Math.random() - 0.5) * 16 + (Math.random() > 0.5 ? 6 : -6),
      (Math.random() - 0.5) * 16 + (Math.random() > 0.5 ? 6 : -6)
    );
  }, [value, isKept, reduceMotion]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const now = performance.now();
    const dt = Math.min(delta, 0.05);

    if (animState.current === 'tumbling') {
      mesh.rotation.x += angularVel.current.x * dt;
      mesh.rotation.y += angularVel.current.y * dt;
      mesh.rotation.z += angularVel.current.z * dt;

      if (now - animStart.current >= TUMBLE_DURATION) {
        animState.current = 'landing';
        animStart.current = now;
        startQuat.current.copy(mesh.quaternion);
      }
    } else if (animState.current === 'landing') {
      const elapsed = now - animStart.current;
      const t = Math.min(elapsed / LAND_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      const target = TARGET_QUATERNIONS[displayValue];
      mesh.quaternion.slerpQuaternions(startQuat.current, target, eased);

      if (t >= 1) {
        mesh.quaternion.copy(target);
        animState.current = 'idle';
      }
    }

    const targetY = isKept ? 0.4 : (hovered && canKeep ? 0.1 : 0);
    mesh.position.y += (targetY - mesh.position.y) * 0.15;

    const targetEmissive = isKept ? glowColor : black;
    for (const m of materials) {
      m.emissive.lerp(targetEmissive, 0.12);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[(index - 2) * DICE_SPACING, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (canKeep) onToggleKeep(index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (canKeep) setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[DICE_SIZE, DICE_SIZE, DICE_SIZE]} />
      {materials.map((mat, i) => (
        <primitive key={i} object={mat} attach={`material-${i}`} />
      ))}
    </mesh>
  );
}
