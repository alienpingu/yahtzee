'use client';

import { useState } from 'react';
import SettingsPopover from './SettingsPopover';
import styles from './GameTopBar.module.css';
import { btnDanger } from './ui.module.css';

export default function GameTopBar({ gameState, onLeave }) {
  const [showSettings, setShowSettings] = useState(false);
  const rollsLeft = gameState.rollsLeft;

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Round</span>
          <span className={styles.statValue}>{gameState.round}<span className={styles.statMax}>/13</span></span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Rolls</span>
          <div className={styles.rollDots}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`${styles.dot} ${i < rollsLeft ? styles.dotActive : ''}`} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} onClick={() => setShowSettings((s) => !s)} aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <button className={btnDanger} onClick={onLeave}>Leave</button>
      </div>

      {showSettings && <SettingsPopover onClose={() => setShowSettings(false)} />}
    </div>
  );
}
