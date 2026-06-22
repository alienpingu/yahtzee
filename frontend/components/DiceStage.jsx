'use client';

import styles from './DiceStage.module.css';
import { btnPrimary } from './ui.module.css';

const PIP_LAYOUT = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export default function DiceStage({ gameState, isMyTurn, kept, onToggleKeep, onRoll }) {
  const canRoll = isMyTurn && gameState.rollsLeft > 0 && gameState.status === 'in_progress';
  const canKeep = isMyTurn && gameState.rollsLeft < 3 && gameState.rollsLeft > 0 && gameState.status === 'in_progress';
  const diceRolled = !gameState.dice.every((d) => d === 0);

  return (
    <div className={styles.stage}>
      <div className={styles.diceRow}>
        {gameState.dice.map((die, i) => {
          const isKept = kept.includes(i);
          const showFace = die !== 0;
          return (
            <button
              key={i}
              className={`${styles.die} ${isKept ? styles.dieKept : ''} ${!showFace ? styles.dieEmpty : ''} ${canKeep ? styles.dieInteractive : ''}`}
              onClick={() => canKeep && onToggleKeep(i)}
              disabled={!canKeep}
              aria-label={`Die ${i + 1}: ${die || 'not rolled'}`}
            >
              {showFace ? <DieFace value={die} /> : <span className={styles.diePlaceholder}>?</span>}
              {isKept && <span className={styles.keepBadge}>Lock</span>}
            </button>
          );
        })}
      </div>

      <button className={`${styles.rollBtn} ${btnPrimary}`} onClick={onRoll} disabled={!canRoll}>
        {gameState.rollsLeft === 3 ? 'Roll Dice' : `Roll (${gameState.rollsLeft} left)`}
      </button>
    </div>
  );
}

function DieFace({ value }) {
  const pips = PIP_LAYOUT[value] || [];
  return (
    <div className={styles.dieFace}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <span key={i} className={`${styles.pip} ${pips.includes(i) ? styles.pipOn : ''}`} />
      ))}
    </div>
  );
}
