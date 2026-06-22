'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Die3D from './Die3D';
import { disposeFaceTextures } from './faceTextures';

const DICE_SPAN = 5.2;
const MIN_Z = 3.5;

function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    const fov = (camera.fov * Math.PI) / 180;
    const requiredZ = (DICE_SPAN / 2) / (aspect * Math.tan(fov / 2)) * 1.25;
    const z = Math.max(requiredZ, MIN_Z);
    camera.position.set(0, z * 0.15, z);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function DiceCanvas({ dice, rollsLeft, kept, canKeep, onToggleKeep, reduceMotion, hueColor }) {
  return (
    <Canvas
      camera={{ fov: 45, position: [0, 2, 6] }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <CameraRig />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} castShadow />
      <directionalLight position={[-2, 1, 3]} intensity={0.3} color="#FFF1E0" />
      <pointLight position={[-3, 2, 3]} intensity={0.5} color={hueColor || '#7C3AED'} />

      {dice.map((value, i) => (
        <Die3D
          key={i}
          value={value}
          index={i}
          isKept={kept.includes(i)}
          canKeep={canKeep}
          onToggleKeep={onToggleKeep}
          reduceMotion={reduceMotion}
          hueColor={hueColor}
        />
      ))}

      <CleanupOnUnmount />
    </Canvas>
  );
}

function CleanupOnUnmount() {
  useEffect(() => {
    return () => { disposeFaceTextures(); };
  }, []);
  return null;
}
