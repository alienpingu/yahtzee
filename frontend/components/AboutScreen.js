'use client';

import styles from './AboutScreen.module.css';
import { btnGhost, glassCard, screen, titleGradient } from './ui.module.css';

export default function AboutScreen({ onBack }) {
  return (
    <div className={screen}>
      <h1 className={`${styles.title} ${titleGradient}`}>About</h1>

      <div className={`${styles.card} ${glassCard}`}>
        <p className={styles.text}>
          Yatzy is a classic dice game where you roll 5 dice and try to fill
          in scoring categories for the highest possible total.
        </p>
        <p className={styles.text}>
          This version supports <strong>single-player</strong> practice,
          <strong> real-time multiplayer</strong> with room codes, and
          <strong> hot-seat</strong> pass-and-play for 2–4 players on one device.
        </p>
        <p className={styles.text}>
          Built with Next.js, Three.js for 3D dice, and a Node.js WebSocket
          server with SQLite persistence. Game state is saved automatically.
        </p>
      </div>

      <button className={btnGhost} onClick={onBack}>Back</button>
    </div>
  );
}
