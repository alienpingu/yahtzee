'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSettings } from '../lib/store';
import { hueFor } from '../lib/tokens';
import styles from './DiceStage.module.css';
import { btnPrimary } from './ui.module.css';

const DiceCanvas = dynamic(() => import('./dice/DiceCanvas'), {
  ssr: false,
  loading: () => <div className={styles.canvasLoading}>Loading dice...</div>,
});

export default function DiceStage({ gameState, canRoll, canKeep, rollLabel, kept, onToggleKeep, onRoll, currentTurnPlayer }) {
  const { reduceMotion } = useSettings();
  const [pendingRoll, setPendingRoll] = useState(false);
  const prevRollsLeft = useRef(gameState.rollsLeft);

  const hueColor = hueFor(currentTurnPlayer).main;

  useEffect(() => {
    if (gameState.rollsLeft !== prevRollsLeft.current) {
      prevRollsLeft.current = gameState.rollsLeft;
      setPendingRoll(false);
    }
  }, [gameState.rollsLeft]);

  const handleRoll = () => {
    setPendingRoll(true);
    onRoll(kept);
    setTimeout(() => setPendingRoll(false), 3000);
  };

  const displayLabel = pendingRoll ? 'Rolling...' : rollLabel;

  return (
    <div className={styles.stage}>
      <div className={styles.canvasContainer}>
        <DiceCanvas
          dice={gameState.dice}
          rollsLeft={gameState.rollsLeft}
          kept={kept}
          canKeep={canKeep}
          onToggleKeep={onToggleKeep}
          reduceMotion={reduceMotion}
          hueColor={hueColor}
        />
      </div>

      <button
        className={`${styles.rollBtn} ${btnPrimary}`}
        onClick={handleRoll}
        disabled={!canRoll || pendingRoll}
      >
        {displayLabel}
      </button>
    </div>
  );
}
