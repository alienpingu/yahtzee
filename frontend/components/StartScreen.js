'use client';

import { useState } from 'react';
import styles from './StartScreen.module.css';
import { btnPrimary, btnGhost, glassCard, input, titleGradient, screen, error as errStyle } from './ui.module.css';

export default function StartScreen({ player, onPlay, onRules, onAbout, onIdentify }) {
  const [name, setName] = useState('');
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    if (player) { onPlay(); return; }
    if (!asking) { setAsking(true); return; }
    if (!name.trim()) { setError('Name required'); return; }
    try {
      setError('');
      setLoading(true);
      await onIdentify(name.trim());
      onPlay();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={screen}>
      <div className={styles.hero}>
        <div className={styles.diceEmoji}>🎲</div>
        <h1 className={`${styles.title} ${titleGradient}`}>Yatzy</h1>
        <p className={styles.subtitle}>Roll. Score. Celebrate.</p>
      </div>

      {player && (
        <p className={styles.welcome}>Welcome back, <strong>{player.name}</strong>!</p>
      )}

      {asking && !player && (
        <div className={`${styles.nameRow} ${glassCard}`}>
          <input
            type="text"
            className={input}
            placeholder="Enter your name"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handlePlay(); }}
          />
        </div>
      )}

      {error && <p className={errStyle}>{error}</p>}

      <div className={styles.actions}>
        <button className={btnPrimary} onClick={handlePlay} disabled={loading}>
          {loading ? 'Loading...' : asking && !player ? 'Submit' : 'Play'}
        </button>
        <div className={styles.secondaryActions}>
          <button className={btnGhost} onClick={onRules}>Rules</button>
          <button className={btnGhost} onClick={onAbout}>About</button>
        </div>
      </div>
    </div>
  );
}
