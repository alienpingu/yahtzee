'use client';

import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import RainbowRays from './RainbowRays';

export default function CelebrationCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 5]} intensity={0.5} />

      <RainbowRays />

      <Sparkles count={50} scale={12} size={6} speed={0.8} color="#FCD34D" />
      <Sparkles count={25} scale={8} size={3} speed={0.3} color="#A78BFA" />
    </Canvas>
  );
}
