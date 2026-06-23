'use client';

import dynamic from 'next/dynamic';
import styles from './GameOverConfetti.module.css';

const CelebrationCanvas = dynamic(() => import('./CelebrationCanvas'), {
  ssr: false,
});

export default function GameOverConfetti() {
  return (
    <div className={styles.layer}>
      <CelebrationCanvas />
    </div>
  );
}
