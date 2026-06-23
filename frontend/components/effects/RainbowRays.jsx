'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RAY_COUNT = 12;
const RAY_LENGTH = 7;
const RAY_WIDTH = 0.35;
const RADIUS = 1.5;

const RAINBOW = [
  '#FF0040', '#FF6B00', '#FFD500', '#7CFC00',
  '#00E5FF', '#3D5AFE', '#7C4DFF', '#E040FB',
  '#FF4081', '#FF8A65', '#AED581', '#4FC3F7',
];

export default function RainbowRays() {
  const groupRef = useRef();

  const rays = useMemo(() => {
    return Array.from({ length: RAY_COUNT }, (_, i) => {
      const angle = (i / RAY_COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * RADIUS;
      const y = Math.sin(angle) * RADIUS;
      const rotZ = angle - Math.PI / 2;
      return { position: [x, y, 0], rotation: [0, 0, rotZ], color: RAINBOW[i] };
    });
  }, []);

  const matsRef = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.25;
    }
    const t = state.clock.elapsedTime;
    matsRef.current.forEach((m, i) => {
      if (m) m.opacity = 0.25 + Math.sin(t * 2 + i * 0.5) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {rays.map((ray, i) => (
        <mesh key={i} position={ray.position} rotation={ray.rotation}>
          <planeGeometry args={[RAY_LENGTH, RAY_WIDTH]} />
          <meshBasicMaterial
            ref={(el) => { matsRef.current[i] = el; }}
            color={ray.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
